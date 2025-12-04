import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { getXeroClient } from '@/lib/xero'

function round2(n: number) { return Math.round(n * 100) / 100 }
function toNum(v: any) { if (typeof v === 'number') return v; if (typeof v === 'string') { const n = parseFloat(v); return Number.isFinite(n) ? n : 0 } return 0 }

async function tryFindContact(accountingApi: any, tenantId: string, name: string) {
  try {
    const found = await accountingApi.getContacts(tenantId, undefined, `Name=="${name}"`)
    const existing = found?.body?.contacts?.[0]
    if (existing) return { contactID: existing.contactID, name: existing.name }
  } catch {}
  return { name }
}

async function resolveExpenseAccountCode(accountingApi: any, tenantId: string, expenseCategory?: string | null) {
  const res = await accountingApi.getAccounts(tenantId)
  const accounts = res?.body?.accounts || []
  const normalized = (expenseCategory || '').toLowerCase()
  const byName = accounts.find((a: any) => a.status === 'ACTIVE' && a._class === 'EXPENSE' && a.name?.toLowerCase().includes(normalized))
  if (byName?.code) return byName.code
  const firstExpense = accounts.find((a: any) => a.status === 'ACTIVE' && a._class === 'EXPENSE' && a.code)
  if (firstExpense?.code) return firstExpense.code
  const anyActive = accounts.find((a: any) => a.status === 'ACTIVE' && a.code)
  return anyActive?.code || '400'
}

function normalizeTaxType(v: any, hasGst: boolean) {
  const s = String(v || '').toUpperCase()
  if (!s) return hasGst ? 'INPUT' : 'NONE'
  if (s === 'OUTPUT') return 'OUTPUT'
  if (s === 'INPUT') return 'INPUT'
  if (['EXEMPTEXPENSES','EXEMPTOUTPUT','BASEXCLUDED'].includes(s)) return 'NONE'
  if (s === 'GSTONIMPORTS') return hasGst ? 'INPUT' : 'NONE'
  return hasGst ? 'INPUT' : 'NONE'
}

function mapItemTaxType(t: any, hasGstItem: boolean) {
  const s = String(t || '').toUpperCase()
  if (s === 'INPUT') return 'INPUT'
  if (s === 'EXEMPTINPUT' || s.includes('EXEMPT')) return hasGstItem ? 'INPUT' : 'NONE'
  if (['EXEMPTEXPENSES','EXEMPTOUTPUT','BASEXCLUDED'].includes(s)) return 'NONE'
  return hasGstItem ? 'INPUT' : 'NONE'
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const body = await request.json()
    const { userId, companyId, digitizedId } = body || {}
    if (!userId || !companyId || !digitizedId) {
      return NextResponse.json({ success: false, code: 'BAD_REQUEST', message: 'userId, companyId, digitizedId are required' }, { status: 400, headers: corsHeaders })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const company = await prisma.company.findUnique({ where: { id: companyId } })
    const doc = await (prisma as any).digitized.findUnique({ where: { id: String(digitizedId) } })
    if (!user || !user.xeroAccessToken) return NextResponse.json({ success: false, code: 'UNAUTHORIZED', message: 'Xero not connected for user' }, { status: 401, headers: corsHeaders })
    if (!company || !(company as any).xeroTenantId) return NextResponse.json({ success: false, code: 'BAD_REQUEST', message: 'Company not linked to Xero tenant' }, { status: 400, headers: corsHeaders })
    if (!doc) return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Digitized document not found' }, { status: 404, headers: corsHeaders })

    const tenantId = (company as any).xeroTenantId as string
    const xero = getXeroClient()
    await xero.setTokenSet({ access_token: user.xeroAccessToken!, refresh_token: user.xeroRefreshToken || undefined, expires_at: user.xeroTokenExpiry ? new Date(user.xeroTokenExpiry).getTime() : undefined })
    const accountingApi = xero.accountingApi

    const contact = await tryFindContact(accountingApi, tenantId, doc.vendorName || 'Unknown Supplier')
    const accountCode = await resolveExpenseAccountCode(accountingApi, tenantId, doc.expenseCategory || null)

    const taxAmountNum = toNum(doc.taxAmount)
    const totalAmountNum = toNum(doc.totalAmount)
    const amountExclTaxNum = toNum(doc.amountExclTax)
    const discountAmountNum = toNum((doc as any).discountAmount)
    const cashOutAmountNum = toNum((doc as any).cashOutAmount)
    const hasGst = taxAmountNum > 0
    const taxType = normalizeTaxType((doc as any).taxType, hasGst) as any
    const net = amountExclTaxNum || (totalAmountNum ? (totalAmountNum - taxAmountNum) : 0)
    const gross = totalAmountNum || (amountExclTaxNum ? (amountExclTaxNum + taxAmountNum) : 0)
    const netRounded = round2(net)
    const grossRounded = round2(gross)
    const taxRate = amountExclTaxNum > 0 ? taxAmountNum / amountExclTaxNum : 0
    const discountExclusive = round2(discountAmountNum && taxRate > 0 ? (discountAmountNum / (1 + taxRate)) : discountAmountNum)

    const dateStr = (doc.purchaseDate ? new Date(doc.purchaseDate) : new Date()).toISOString().slice(0,10)
    const dueStr = (doc.purchaseDate ? new Date(doc.purchaseDate.getTime() + 14 * 24 * 3600 * 1000) : new Date(Date.now() + 14 * 24 * 3600 * 1000)).toISOString().slice(0,10)

    const taxStatusStr = String((doc as any).taxStatus || '').toLowerCase()
    const taxTypeStr = String((doc as any).taxType || '').toUpperCase()
    const isNoTax = !hasGst || taxStatusStr.includes('tax-free') || ['EXEMPTEXPENSES','EXEMPTOUTPUT','BASEXCLUDED'].includes(taxTypeStr)
    const hasLineItems = Array.isArray((doc as any).lineItems) && (doc as any).lineItems.length > 0
    const resolveLineAmountTypes = (): 'Inclusive' | 'Exclusive' | 'NoTax' => {
      if (hasLineItems) return 'Inclusive'
      if (isNoTax) return 'NoTax'
      if (amountExclTaxNum > 0 && !totalAmountNum) return 'Exclusive'
      if (totalAmountNum > 0 && !amountExclTaxNum) return 'Inclusive'
      return totalAmountNum ? 'Inclusive' : (amountExclTaxNum ? 'Exclusive' : 'Inclusive')
    }

    const lineAmountTypes = resolveLineAmountTypes() as any
    const mainUnit = lineAmountTypes === 'Exclusive' ? Number(netRounded || 0) : Number(grossRounded || 0)

    const invoice: any = {
      type: 'ACCPAY',
      contact: contact.contactID ? { contactID: contact.contactID } : { name: contact.name },
      date: dateStr,
      dueDate: dueStr,
      lineAmountTypes,
      lineItems: [] as any[],
      status: 'DRAFT',
      reference: doc.receiptNumber || undefined,
    }

    if (hasLineItems) {
      try {
        const items = ((doc as any).lineItems || []) as any[]
        for (const it of items) {
          const qty = toNum(it.quantity) || 1
          const unit = toNum(it.unitAmount)
          const hasGstItem = !!(it.taxType && String(it.taxType).toUpperCase() === 'INPUT')
          invoice.lineItems.push({ description: String(it.description || doc.documentType || doc.originalName || 'Item'), quantity: Number(qty || 1), unitAmount: Number(unit || 0), accountCode, taxType: mapItemTaxType(it.taxType, hasGstItem) })
        }
      } catch {}
    } else {
      invoice.lineItems.push({ description: doc.documentType || doc.originalName || 'Expense', quantity: 1, unitAmount: mainUnit, accountCode, taxType: (isNoTax ? 'NONE' : taxType), taxAmount: lineAmountTypes === 'Inclusive' && hasGst ? Number(round2(taxAmountNum)) : undefined })
    }

    if (cashOutAmountNum > 0) {
      invoice.lineItems.push({ description: 'Cash Out', quantity: 1, unitAmount: Number(-round2(cashOutAmountNum)), accountCode: (company as any)?.xeroCashOutAccountCode || '800', taxType: 'NONE', taxAmount: 0 })
    }
    if (discountAmountNum > 0) {
      const discUnit = lineAmountTypes === 'Exclusive' ? Number(-discountExclusive) : Number(-round2(discountAmountNum))
      invoice.lineItems.push({ description: 'Discount', quantity: 1, unitAmount: discUnit, accountCode, taxType: 'NONE', taxAmount: 0 })
    }
    if ((doc as any).surchargeAmount && discountAmountNum >= 0) {
      const sur = toNum((doc as any).surchargeAmount)
      if (sur > 0) {
        invoice.lineItems.push({ description: 'Payment Surcharge', quantity: 1, unitAmount: Number(round2(sur)), accountCode, taxType: 'INPUT' })
      }
    }

    const subtotalCalc = round2(invoice.lineItems.reduce((s: number, li: any) => s + Number(li.quantity || 1) * Number(li.unitAmount || 0), 0))
    const taxCalc = round2(lineAmountTypes === 'Exclusive' ? (hasGst ? subtotalCalc * 0.1 : 0) : (hasGst ? (subtotalCalc * (1/11)) : 0))
    const totalCalc = round2(lineAmountTypes === 'Exclusive' ? subtotalCalc + taxCalc : subtotalCalc)

    const warnings: string[] = []
    if (!doc.vendorName) warnings.push('Missing vendor name')
    const abn = (doc.vendorAbn || '').replace(/\D/g, '')
    if (abn && abn.length !== 11) warnings.push('Invalid ABN format (must be 11 digits)')
    if (!doc.purchaseDate) warnings.push('Missing purchase date')
    if (!invoice.lineItems.length) warnings.push('No line items found')
    if (Math.abs(totalCalc - (grossRounded || totalAmountNum || 0)) > 0.05) warnings.push('Calculated total differs from extracted total')

    const payload = { invoices: [invoice] }
    return NextResponse.json({ success: true, code: 'SUCCESS', data: { payload, audit: { subtotalCalc, taxCalc, totalCalc, hasGst, lineAmountTypes }, warnings } }, { headers: corsHeaders })
  } catch (error: any) {
    const status = error?.response?.status || 500
    const message = error?.message || 'Failed to generate Xero Bill preview'
    return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message, error: { type: 'ExternalServiceError', details: [ { field: 'xero', message } ] } }, { status, headers: corsHeaders })
  }
}
