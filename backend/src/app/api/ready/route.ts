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
