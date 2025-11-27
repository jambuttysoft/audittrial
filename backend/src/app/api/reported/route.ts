import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const userId = searchParams.get('userId')
    const file = searchParams.get('file') || ''
    if (!companyId || !userId) {
      return NextResponse.json({ error: 'Company ID and User ID are required' }, { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
    const where: any = { companyId, userId }
    if (file) where.exportFileName = { contains: file }
    const items = await (prisma as any).digitizedReported.findMany({ where, orderBy: { exportedAt: 'desc' } })
    return NextResponse.json({ success: true, reported: items }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reported items' }, { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, userId, companyId, fileName, exportedAt, status } = body
    if (!Array.isArray(ids) || !ids.length || !userId || !companyId || !fileName) {
      return NextResponse.json({ error: 'ids, userId, companyId and fileName are required' }, { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
    const readyItems = await (prisma as any).digitizedReady.findMany({ where: { id: { in: ids.map((v: any) => String(v)) }, userId, companyId } })
    const now = exportedAt ? new Date(exportedAt) : new Date()
    let moved = 0

    // Generate and save Excel file on server
    const rows = readyItems.map((d: any) => ({
      purchaseDate: d.purchaseDate || '',
      vendorName: d.vendorName || '',
      vendorAbn: d.vendorAbn || '',
      vendorAddress: d.vendorAddress || '',
      documentType: d.documentType || '',
      receiptNumber: d.receiptNumber || '',
      paymentType: d.paymentType || '',
      cashOutAmount: typeof d.cashOutAmount === 'number' ? d.cashOutAmount : 0,
      discountAmount: typeof d.discountAmount === 'number' ? d.discountAmount : 0,
      surchargeAmount: typeof d.surchargeAmount === 'number' ? d.surchargeAmount : 0,
      amountExclTax: typeof d.amountExclTax === 'number' ? d.amountExclTax : 0,
      taxAmount: typeof d.taxAmount === 'number' ? d.taxAmount : 0,
      totalAmount: typeof d.totalAmount === 'number' ? d.totalAmount : 0,
      totalPaidAmount: typeof d.totalPaidAmount === 'number' ? d.totalPaidAmount : 0,
      expenseCategory: d.expenseCategory || '',
      taxStatus: d.taxStatus || '',
      originalName: d.originalName || '',
      fileName: d.fileName || '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    const dir = join(process.cwd(), 'storage', 'exports', companyId)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    const fullPath = join(dir, fileName)
    const out = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
    writeFileSync(fullPath, out)
    for (const d of readyItems) {
      await (prisma as any).digitizedReported.upsert({
        where: { originalDigitizedId: d.originalDigitizedId },
        update: {
          companyId: d.companyId,
          userId: d.userId,
          originalDocumentId: d.originalDocumentId,
          fileName: d.fileName,
          originalName: d.originalName,
          filePath: d.filePath,
          fileSize: d.fileSize,
          mimeType: d.mimeType,
          purchaseDate: d.purchaseDate,
          vendorName: d.vendorName,
          vendorAbn: d.vendorAbn,
          vendorAddress: d.vendorAddress,
          documentType: d.documentType,
          receiptNumber: d.receiptNumber,
          paymentType: d.paymentType,
          cashOutAmount: d.cashOutAmount,
          discountAmount: d.discountAmount,
          amountExclTax: d.amountExclTax,
          taxAmount: d.taxAmount,
          totalAmount: d.totalAmount,
          totalPaidAmount: d.totalPaidAmount,
          surchargeAmount: d.surchargeAmount,
          expenseCategory: d.expenseCategory,
          taxStatus: d.taxStatus,
          exportedAt: now,
          exportFileName: fileName,
          exportStatus: status || 'SUCCESS',
        },
        create: {
          originalDigitizedId: d.originalDigitizedId,
          companyId: d.companyId,
          userId: d.userId,
          originalDocumentId: d.originalDocumentId,
          fileName: d.fileName,
          originalName: d.originalName,
          filePath: d.filePath,
          fileSize: d.fileSize,
          mimeType: d.mimeType,
          purchaseDate: d.purchaseDate,
          vendorName: d.vendorName,
          vendorAbn: d.vendorAbn,
          vendorAddress: d.vendorAddress,
          documentType: d.documentType,
          receiptNumber: d.receiptNumber,
          paymentType: d.paymentType,
          cashOutAmount: d.cashOutAmount,
          discountAmount: d.discountAmount,
          amountExclTax: d.amountExclTax,
          taxAmount: d.taxAmount,
          totalAmount: d.totalAmount,
          totalPaidAmount: d.totalPaidAmount,
          surchargeAmount: d.surchargeAmount,
          expenseCategory: d.expenseCategory,
          taxStatus: d.taxStatus,
          exportedAt: now,
          exportFileName: fileName,
          exportStatus: status || 'SUCCESS',
        },
      })
      try {
        await (prisma as any).digitizedReady.delete({ where: { id: d.id } })
      } catch {}
      moved++
    }
    await (prisma as any).exportHistory.create({
      data: {
        companyId,
        userId,
        fileName,
        exportedAt: now,
        status: status || 'SUCCESS',
        totalRows: moved,
      },
    })
    return NextResponse.json({ success: true, moved }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to move items to reported' }, { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') })
  }
}
