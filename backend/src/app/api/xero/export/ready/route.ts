import { NextRequest, NextResponse } from 'next/server'
import { XeroClient } from 'xero-node'
import { prisma } from '@/lib/prisma'
import { createReadStream } from 'fs'
import { join } from 'path'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

function getXeroClient() {
  const clientId = process.env.XERO_CLIENT_ID
  const clientSecret = process.env.XERO_CLIENT_SECRET
  const redirectUri = process.env.XERO_REDIRECT_URI
  const envScopes = process.env.XERO_SCOPES?.split(' ') || []
  const required = ['openid','profile','email','offline_access','accounting.settings','accounting.transactions','accounting.contacts','accounting.attachments']
  const scopes = Array.from(new Set([...envScopes, ...required]))
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Xero environment variables')
  }
  return new XeroClient({ clientId, clientSecret, redirectUris: [redirectUri], scopes })
}

function getErrMsg(e: any) {
  const r = e?.response
  const d = r?.data
  if (typeof d === 'string') return d
  if (d?.message) return d.message
  const elements = d?.Elements || d?.elements
  if (Array.isArray(elements) && elements.length) {
    const v = elements[0]?.ValidationErrors || elements[0]?.validationErrors
    if (Array.isArray(v) && v.length) {
      const msgs = v.map((x: any) => x?.Message || x?.message).filter(Boolean)
      if (msgs.length) return msgs.join('; ')
    }
  }
  const m = e?.message || e?.toString?.()
  if (m && m !== '[object Object]') return m
  try { return JSON.stringify(d || e) } catch { return 'Unknown error' }
}

async function ensureContact(accountingApi: any, tenantId: string, vendorName: string, vendorAbn?: string | null) {
  const name = vendorName?.trim()
  if (!name) throw new Error('Missing vendor name')
  try {
    const found = await accountingApi.getContacts(tenantId, undefined, `Name=="${name}"`)
    const existing = found?.body?.contacts?.[0]
    if (existing) return existing
  } catch {}
  try {
    const createRes = await accountingApi.createContacts(tenantId, {
      contacts: [{
        name,
        taxNumber: vendorAbn || undefined,
        isSupplier: true,
        isCustomer: false,
      }]
    })
    const created = createRes?.body?.contacts?.[0]
    if (!created) throw new Error('Failed to create Xero contact')
    return created
  } catch (err: any) {
    const hdr = err?.response?.headers?.['www-authenticate'] || err?.response?.headers?.wwwAuthenticate
    if (typeof hdr === 'string' && hdr.toLowerCase().includes('insufficient_scope')) {
      throw new Error('Insufficient Xero scope: reconnect and grant accounting.contacts and accounting.attachments')
    }
    throw new Error(getErrMsg(err))
  }
}

async function resolveExpenseAccountCode(accountingApi: any, tenantId: string, expenseCategory?: string | null) {
  const res = await accountingApi.getAccounts(tenantId)
  const accounts = res?.body?.accounts || []
  // Prefer an EXPENSE account matching category by name
  const normalized = (expenseCategory || '').toLowerCase()
  const byName = accounts.find((a: any) => a.status === 'ACTIVE' && a._class === 'EXPENSE' && a.name?.toLowerCase().includes(normalized))
  if (byName?.code) return byName.code
  // Fallback: first active EXPENSE account
  const firstExpense = accounts.find((a: any) => a.status === 'ACTIVE' && a._class === 'EXPENSE' && a.code)
  if (firstExpense?.code) return firstExpense.code
  // Last resort: any active account that allows expenses
  const anyActive = accounts.find((a: any) => a.status === 'ACTIVE' && a.code)
  return anyActive?.code || '400'
}

async function resolveCashOutAccountCode(accountingApi: any, tenantId: string) {
  const res = await accountingApi.getAccounts(tenantId)
  const accounts = res?.body?.accounts || []
  const names = ['cash', 'petty cash', 'cash on hand']
  const byName = accounts.find((a: any) => a.status === 'ACTIVE' && a.code && names.some(n => (a.name || '').toLowerCase().includes(n)))
  if (byName?.code) return byName.code
  const expense = accounts.find((a: any) => a.status === 'ACTIVE' && a._class === 'EXPENSE' && a.code)
  return expense?.code || '400'
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const body = await request.json()
    const { userId, companyId, documentIds, dateRangeStart, dateRangeEnd, mode, taxMode } = body || {}
    if (!userId || !companyId) {
      return NextResponse.json({ error: 'userId and companyId are required' }, { status: 400, headers: corsHeaders })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const company = await prisma.company.findUnique({ where: { id: companyId } })
    if (!user || !user.xeroAccessToken) {
      return NextResponse.json({ error: 'Xero not connected for user' }, { status: 401, headers: corsHeaders })
    }
    const companyTenantId = (company as any)?.xeroTenantId as string | undefined
    if (!company || !companyTenantId) {
      return NextResponse.json({ error: 'Company not linked to Xero tenant' }, { status: 400, headers: corsHeaders })
    }

    const tokenExpiry = user.xeroTokenExpiry ? new Date(user.xeroTokenExpiry) : null
    if (tokenExpiry && new Date() >= tokenExpiry) {
      return NextResponse.json({ error: 'Xero token expired. Please reconnect.' }, { status: 401, headers: corsHeaders })
    }

    const xero = getXeroClient()
    await xero.setTokenSet({ access_token: user.xeroAccessToken, refresh_token: user.xeroRefreshToken || undefined, expires_at: tokenExpiry?.getTime() })
    const accountingApi = xero.accountingApi
    const tenantId = companyTenantId

    // Load documents from DigitizedReady for this company
    const where: any = { companyId }
    if (Array.isArray(documentIds) && documentIds.length > 0) where.originalDocumentId = { in: documentIds }
    let docs = await prisma.digitizedReady.findMany({ where })
    // Optional date filter
    if (dateRangeStart && dateRangeEnd) {
      const start = new Date(dateRangeStart)
      const end = new Date(dateRangeEnd)
      docs = docs.filter(d => d.purchaseDate && d.purchaseDate >= start && d.purchaseDate <= end)
    }
    if (!docs.length) {
      return NextResponse.json({ error: 'No documents to export' }, { status: 400, headers: corsHeaders })
    }

    const successes: any[] = []
    const failures: any[] = []
    const exportRequests: any[] = []

    const exportMode = (mode === 'spend') ? 'spend' : 'bill'

    const resolveBankAccountID = async () => {
      const selectedId = (company as any)?.xeroBankAccountId as string | undefined
      if (selectedId) return selectedId
      const res = await accountingApi.getAccounts(tenantId)
      const accounts = res?.body?.accounts || []
      const bank = accounts.find((a: any) => a.status === 'ACTIVE' && a.type === 'BANK' && a.accountID)
      return bank?.accountID || null
    }

    const toNum = (v: any) => {
      if (typeof v === 'number') return v
      if (typeof v === 'string') {
        const n = parseFloat(v)
        return Number.isFinite(n) ? n : 0
      }
      return 0
    }

  const region = (company as any)?.taxRegion as string | undefined
  const getTaxTypeByRegion = (isTaxable: boolean) => {
    const r = (region || 'AU').toUpperCase()
    if (!isTaxable) return 'NONE'
    switch (r) {
      case 'AU':
      case 'NZ':
      case 'UK':
      case 'EU':
      case 'CA':
      case 'US':
        return 'INPUT'
      default:
        return 'INPUT'
    }
  }
  const normalizeTaxType = (v: any, hasGst: boolean) => {
    const s = String(v || '').toUpperCase()
    if (!s) return getTaxTypeByRegion(hasGst)
    if (s === 'OUTPUT') return 'OUTPUT'
    if (s === 'INPUT') return 'INPUT'
    if (s === 'EXEMPTEXPENSES') return 'NONE'
    if (s === 'EXEMPTOUTPUT') return 'NONE'
    if (s === 'BASEXCLUDED') return 'NONE'
    if (s === 'GSTONIMPORTS') return hasGst ? 'INPUT' : 'NONE'
    return getTaxTypeByRegion(hasGst)
  }
    const taxModeOverride = typeof taxMode === 'string' ? taxMode.toLowerCase() : ''
    const isOverrideExclusive = taxModeOverride === 'exclusive'
    const isOverrideInclusive = taxModeOverride === 'inclusive'

    for (const doc of docs) {
      let stage = 'preflight'
      try {
        stage = 'ensureContact'
        const contact = await ensureContact(accountingApi, tenantId, doc.vendorName || 'Unknown Supplier', doc.vendorAbn || undefined)
        stage = 'resolveAccount'
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
        const round2 = (n: number) => Math.round(n * 100) / 100
        const netRounded = round2(net)
        const grossRounded = round2(gross)
        const taxRate = amountExclTaxNum > 0 ? taxAmountNum / amountExclTaxNum : 0
        const discountExclusive = round2(discountAmountNum && taxRate > 0 ? (discountAmountNum / (1 + taxRate)) : discountAmountNum)

        const dateStr = (doc.purchaseDate ? new Date(doc.purchaseDate) : new Date()).toISOString().slice(0,10)

        const taxStatusStr = String((doc as any).taxStatus || '').toLowerCase()
        const taxTypeStr = String((doc as any).taxType || '').toUpperCase()
        const isNoTax = !hasGst || taxStatusStr.includes('tax-free') || ['EXEMPTEXPENSES','EXEMPTOUTPUT','BASEXCLUDED'].includes(taxTypeStr)
        const resolveLineAmountTypes = () => {
          if (isOverrideExclusive) return 'Exclusive'
          if (isOverrideInclusive) return 'Inclusive'
          if (isNoTax) return 'NoTax'
          if (amountExclTaxNum > 0 && !totalAmountNum) return 'Exclusive'
          if (totalAmountNum > 0 && !amountExclTaxNum) return 'Inclusive'
          return totalAmountNum ? 'Inclusive' : (amountExclTaxNum ? 'Exclusive' : 'Inclusive')
        }

        stage = 'compose'
        if (exportMode === 'bill') {
          const dueStr = (doc.purchaseDate ? new Date(doc.purchaseDate.getTime() + 14 * 24 * 3600 * 1000) : new Date(Date.now() + 14 * 24 * 3600 * 1000)).toISOString().slice(0,10)
          const lineAmountTypesBill = resolveLineAmountTypes() as any
          const mainUnit = lineAmountTypesBill === 'Exclusive' ? Number(netRounded || 0) : Number(grossRounded || 0)
          const invoice = {
            type: 'ACCPAY' as any,
            contact: { contactID: contact.contactID },
            date: dateStr,
            dueDate: dueStr,
            lineAmountTypes: lineAmountTypesBill as any,
            lineItems: [{
              description: doc.documentType || doc.originalName || 'Expense',
              quantity: 1,
              unitAmount: mainUnit,
              accountCode: accountCode,
              taxType: (isNoTax ? 'NONE' : taxType) as any,
              taxAmount: lineAmountTypesBill === 'Inclusive' && hasGst ? Number(round2(taxAmountNum)) : undefined,
            }],
            status: 'DRAFT' as any,
          }
          if (cashOutAmountNum > 0) {
            invoice.lineItems.push({
              description: 'Cash Out',
              quantity: 1,
              unitAmount: Number(-round2(cashOutAmountNum)),
              accountCode: await resolveCashOutAccountCode(accountingApi, tenantId),
              taxType: 'NONE' as any,
              taxAmount: 0
            })
          }
          if (discountAmountNum > 0) {
            const discUnit = lineAmountTypesBill === 'Exclusive' ? Number(-discountExclusive) : Number(-round2(discountAmountNum))
            invoice.lineItems.push({
              description: 'Discount',
              quantity: 1,
              unitAmount: discUnit,
              accountCode: accountCode,
              taxType: (isNoTax ? 'NONE' : normalizeTaxType((doc as any).taxType, hasGst)) as any,
              taxAmount: 0
            })
          }
          const invPayload = { invoices: [invoice] }
          {
            const pathStr = doc.filePath ? (doc.filePath.startsWith('/') ? doc.filePath : join(process.cwd(), doc.filePath)) : ''
            const fileNameAttach = doc.originalName || doc.fileName || `receipt-${doc.originalDocumentId}`
            exportRequests.push({ endpoint: 'createInvoices', originalDocumentId: doc.originalDocumentId, body: invPayload, attachment: pathStr ? { fileName: fileNameAttach, path: pathStr } : undefined, audit: { hasGst, taxAmount: taxAmountNum, net: netRounded, gross: grossRounded, lineAmountTypes: lineAmountTypesBill, discount: discountAmountNum, cashOut: cashOutAmountNum, region } })
          }
          stage = 'createInvoice'
          const res = await accountingApi.createInvoices(tenantId, invPayload)
          const created = res?.body?.invoices?.[0]
          if (!created) throw new Error('Xero did not return created invoice')
          successes.push({ documentId: doc.originalDocumentId, xeroInvoiceId: created.invoiceID })
          try {
            const pathStr = doc.filePath ? (doc.filePath.startsWith('/') ? doc.filePath : join(process.cwd(), doc.filePath)) : ''
            if (pathStr) {
              const fileNameAttach = doc.originalName || doc.fileName || `receipt-${doc.originalDocumentId}`
              const bodyStream = createReadStream(pathStr)
              const headers = doc.mimeType ? { headers: { 'Content-Type': doc.mimeType } } : undefined
              stage = 'attachInvoice'
              await accountingApi.createInvoiceAttachmentByFileName(tenantId, created.invoiceID, fileNameAttach, bodyStream, undefined, true, headers)
            }
          } catch {}
        } else {
          stage = 'resolveBankAccount'
          const bankAccountID = await resolveBankAccountID()
          if (!bankAccountID) throw new Error('No active bank account found in Xero')
          const lineAmountTypesSpend = resolveLineAmountTypes() as any
          const bankTransaction = {
            type: 'SPEND' as any,
            contact: { contactID: contact.contactID },
            bankAccount: { accountID: bankAccountID },
            date: dateStr,
            lineAmountTypes: lineAmountTypesSpend as any,
            lineItems: [{
              description: doc.documentType || doc.originalName || 'Expense',
              quantity: 1,
              unitAmount: Number((lineAmountTypesSpend === 'Exclusive' ? netRounded : grossRounded) || 0),
              accountCode: accountCode,
              taxType: (isNoTax ? 'NONE' : taxType) as any,
            }],
            status: 'AUTHORISED' as any,
          }
          if (cashOutAmountNum > 0) {
            bankTransaction.lineItems.push({
              description: 'Cash Out',
              quantity: 1,
              unitAmount: Number(-round2(cashOutAmountNum)),
              accountCode: await resolveCashOutAccountCode(accountingApi, tenantId),
              taxType: 'NONE' as any,
            })
          }
          if (discountAmountNum > 0) {
            bankTransaction.lineItems.push({
              description: 'Discount',
              quantity: 1,
              unitAmount: Number(-round2(discountAmountNum)),
              accountCode: accountCode,
              taxType: (isNoTax ? 'NONE' : normalizeTaxType((doc as any).taxType, hasGst)) as any,
            })
          }
          const spendPayload = { bankTransactions: [bankTransaction] }
          {
            const pathStr = doc.filePath ? (doc.filePath.startsWith('/') ? doc.filePath : join(process.cwd(), doc.filePath)) : ''
            const fileNameAttach = doc.originalName || doc.fileName || `receipt-${doc.originalDocumentId}`
            exportRequests.push({ endpoint: 'createBankTransactions', originalDocumentId: doc.originalDocumentId, body: spendPayload, attachment: pathStr ? { fileName: fileNameAttach, path: pathStr } : undefined, audit: { hasGst, taxAmount: taxAmountNum, net: netRounded, gross: grossRounded, lineAmountTypes: lineAmountTypesSpend, discount: discountAmountNum, cashOut: cashOutAmountNum, region } })
          }
          stage = 'createSpend'
          const res = await accountingApi.createBankTransactions(tenantId, spendPayload)
          const created = res?.body?.bankTransactions?.[0]
          if (!created) throw new Error('Xero did not return created bank transaction')
          successes.push({ documentId: doc.originalDocumentId, xeroBankTransactionId: created.bankTransactionID })
          try {
            const pathStr = doc.filePath ? (doc.filePath.startsWith('/') ? doc.filePath : join(process.cwd(), doc.filePath)) : ''
            if (pathStr) {
              const fileNameAttach = doc.originalName || doc.fileName || `receipt-${doc.originalDocumentId}`
              const bodyStream = createReadStream(pathStr)
              const headers = doc.mimeType ? { headers: { 'Content-Type': doc.mimeType } } : undefined
              stage = 'attachSpend'
              await accountingApi.createBankTransactionAttachmentByFileName(tenantId, created.bankTransactionID, fileNameAttach, bodyStream, undefined, headers)
            }
          } catch {}
        }

        await (prisma as any).digitizedReported.create({
          data: {
            originalDigitizedId: doc.id,
            companyId: doc.companyId,
            userId: doc.userId,
            originalDocumentId: doc.originalDocumentId,
            fileName: doc.fileName,
            originalName: doc.originalName,
            filePath: doc.filePath,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            purchaseDate: doc.purchaseDate,
            vendorName: doc.vendorName,
            vendorAbn: doc.vendorAbn,
            vendorAddress: doc.vendorAddress,
            documentType: doc.documentType,
            receiptNumber: doc.receiptNumber,
            paymentType: doc.paymentType,
            cashOutAmount: doc.cashOutAmount,
            discountAmount: doc.discountAmount,
            amountExclTax: doc.amountExclTax,
            taxAmount: doc.taxAmount,
            totalAmount: doc.totalAmount,
            totalPaidAmount: doc.totalPaidAmount,
            surchargeAmount: doc.surchargeAmount,
            expenseCategory: doc.expenseCategory,
            taxStatus: doc.taxStatus,
            taxType: (doc as any).taxType ?? null,
            taxTypeName: (doc as any).taxTypeName ?? null,
            exportedAt: new Date(),
            exportFileName: exportMode === 'bill' ? `xero-invoice-${new Date().toISOString()}` : `xero-spend-${new Date().toISOString()}`,
            exportStatus: 'SUCCESS',
          },
        })

        await prisma.digitizedReady.delete({ where: { id: doc.id } })
      } catch (err: any) {
        const msg = getErrMsg(err)
        const code = err?.response?.status
        failures.push({ documentId: doc.originalDocumentId, stage, error: msg, code, tenantId, vendorName: doc.vendorName || null })
      }
    }

    // Write export history summary
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
    const fileName = `xero-${ts}.json`
    await prisma.exportHistory.create({
      data: {
        companyId,
        userId,
        fileName,
        exportedAt: now,
        status: failures.length ? 'PARTIAL' : 'SUCCESS',
        totalRows: successes.length,
      },
    })

    try {
      const { mkdir, writeFile } = await import('fs/promises')
      const { join } = await import('path')
      const dir = join(process.cwd(), 'storage', 'exports', companyId)
      const fullPath = join(dir, fileName)
      await mkdir(dir, { recursive: true })
      const payloadToSave = { exportedAt: now.toISOString(), mode: exportMode, tenantId, requests: exportRequests, successes, failures }
      await writeFile(fullPath, Buffer.from(JSON.stringify(payloadToSave, null, 2)))
    } catch {}

    return NextResponse.json({ success: true, summary: { successes, failures } }, { headers: corsHeaders })
  } catch (error: any) {
    if (error?.response) {
      const status = error.response.status || 500
      const message = error.response.data?.message || error.message
      return NextResponse.json({ error: `Xero API error: ${message}` }, { status, headers: corsHeaders })
    }
    return NextResponse.json({ error: 'Failed to export to Xero', details: error.message }, { status: 500, headers: corsHeaders })
  }
}
