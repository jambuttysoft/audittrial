import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const companyId = searchParams.get('companyId')
    if (!userId || !companyId) {
      return NextResponse.json({ success: false, code: 'BAD_REQUEST', message: 'userId and companyId are required' }, { status: 400, headers: corsHeaders })
    }
    const items = await (prisma as any).digitizedReady.findMany({ where: { userId, companyId }, orderBy: { movedAt: 'desc' } })
    return NextResponse.json({ success: true, code: 'SUCCESS', ready: items, message: 'Operation completed successfully' }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message: 'Failed to fetch ready items' }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const body = await request.json()
    const { id, userId } = body
    if (!id || !userId) {
      return NextResponse.json({ success: false, code: 'BAD_REQUEST', message: 'id and userId are required' }, { status: 400, headers: corsHeaders })
    }
    const doc = await (prisma as any).digitized.findUnique({ where: { id: String(id) } })
    if (!doc || doc.userId !== userId) {
      return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Item not found' }, { status: 404, headers: corsHeaders })
    }
    await (prisma as any).digitizedReady.upsert({
      where: { originalDigitizedId: doc.id },
      update: {
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
        subTotal: doc.subTotal,
        amountExclTax: doc.amountExclTax,
        taxAmount: doc.taxAmount,
        totalAmount: doc.totalAmount,
        totalPaidAmount: doc.totalPaidAmount,
        surchargeAmount: doc.surchargeAmount,
        expenseCategory: doc.expenseCategory,
        taxStatus: doc.taxStatus,
        taxType: doc.taxType,
        taxTypeName: doc.taxTypeName,
        lineItems: doc.lineItems,
        xeroApiRequests: doc.xeroApiRequests,
        movedAt: new Date(),
      },
      create: {
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
        subTotal: doc.subTotal,
        amountExclTax: doc.amountExclTax,
        taxAmount: doc.taxAmount,
        totalAmount: doc.totalAmount,
        totalPaidAmount: doc.totalPaidAmount,
        surchargeAmount: doc.surchargeAmount,
        expenseCategory: doc.expenseCategory,
        taxStatus: doc.taxStatus,
        taxType: doc.taxType,
        taxTypeName: doc.taxTypeName,
        lineItems: doc.lineItems,
        xeroApiRequests: doc.xeroApiRequests,
      },
    })
    await (prisma as any).digitized.delete({ where: { id: String(id) } })
    return NextResponse.json({ success: true, code: 'SUCCESS', message: 'Item moved to Ready for Report' }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message: 'Failed to move item to Ready' }, { status: 500, headers: corsHeaders })
  }
}

export async function DELETE(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    if (!id || !userId) {
      return NextResponse.json({ success: false, code: 'BAD_REQUEST', message: 'id and userId are required' }, { status: 400, headers: corsHeaders })
    }
    const item = await (prisma as any).digitizedReady.findUnique({ where: { id: String(id) } })
    if (!item || item.userId !== userId) {
      return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Item not found' }, { status: 404, headers: corsHeaders })
    }
    const payload: any = {
      originalDigitizedId: item.originalDigitizedId,
      companyId: item.companyId,
      userId: item.userId,
      originalDocumentId: item.originalDocumentId,
      fileName: item.fileName,
      originalName: item.originalName,
      filePath: item.filePath,
      fileSize: item.fileSize,
      mimeType: item.mimeType,
      purchaseDate: item.purchaseDate,
      vendorName: item.vendorName,
      vendorAbn: item.vendorAbn,
      vendorAddress: item.vendorAddress,
      documentType: item.documentType,
      receiptNumber: item.receiptNumber,
      paymentType: item.paymentType,
      cashOutAmount: item.cashOutAmount,
      discountAmount: item.discountAmount,
      subTotal: item.subTotal,
      amountExclTax: item.amountExclTax,
      taxAmount: item.taxAmount,
      totalAmount: item.totalAmount,
      totalPaidAmount: item.totalPaidAmount,
      surchargeAmount: item.surchargeAmount,
      expenseCategory: item.expenseCategory,
      taxStatus: item.taxStatus,
      taxType: item.taxType,
      taxTypeName: item.taxTypeName,
      lineItems: item.lineItems,
      xeroApiRequests: item.xeroApiRequests,
    }
    await (prisma as any).digitizedReview.create({ data: payload })
    await (prisma as any).digitizedReady.delete({ where: { id: String(id) } })
    return NextResponse.json({ success: true, code: 'SUCCESS', message: 'Item moved to Deleted' }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message: 'Failed to delete ready item' }, { status: 500, headers: corsHeaders })
  }
}
