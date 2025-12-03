import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { prisma } from '@/lib/prisma'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const userId = searchParams.get('userId')
    if (!companyId || !userId) {
      return NextResponse.json({ error: 'Company ID and User ID are required' }, { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
    const items = await (prisma as any).digitizedReady.findMany({ where: { companyId, userId }, orderBy: { movedAt: 'desc' } })
    return NextResponse.json({ success: true, ready: items }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ready items' }, { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, userId } = body
    if (!id || !userId) {
      return NextResponse.json({ error: 'Digitized ID and User ID are required' }, { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
    const digitized = await prisma.digitized.findFirst({ where: { id, userId } })
    if (!digitized) {
      return NextResponse.json({ error: 'Digitized not found' }, { status: 404, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
    await (prisma as any).digitizedReady.upsert({
      where: { originalDigitizedId: digitized.id },
      update: {
        companyId: digitized.companyId,
        userId: digitized.userId,
        originalDocumentId: digitized.originalDocumentId,
        fileName: digitized.fileName,
        originalName: digitized.originalName,
        filePath: digitized.filePath,
        fileSize: digitized.fileSize,
        mimeType: digitized.mimeType,
        purchaseDate: digitized.purchaseDate,
        vendorName: digitized.vendorName,
        vendorAbn: digitized.vendorAbn,
        vendorAddress: digitized.vendorAddress,
        documentType: digitized.documentType,
        receiptNumber: digitized.receiptNumber,
        paymentType: digitized.paymentType,
        cashOutAmount: digitized.cashOutAmount,
        discountAmount: digitized.discountAmount,
        amountExclTax: digitized.amountExclTax,
        taxAmount: digitized.taxAmount,
        totalAmount: digitized.totalAmount,
        totalPaidAmount: (digitized as any).totalPaidAmount ?? null,
        surchargeAmount: (digitized as any).surchargeAmount ?? null,
        expenseCategory: digitized.expenseCategory,
        taxStatus: digitized.taxStatus,
        taxType: (digitized as any).taxType ?? null,
        taxTypeName: (digitized as any).taxTypeName ?? null,
        movedAt: new Date(),
      },
      create: {
        originalDigitizedId: digitized.id,
        companyId: digitized.companyId,
        userId: digitized.userId,
        originalDocumentId: digitized.originalDocumentId,
        fileName: digitized.fileName,
        originalName: digitized.originalName,
        filePath: digitized.filePath,
        fileSize: digitized.fileSize,
        mimeType: digitized.mimeType,
        purchaseDate: digitized.purchaseDate,
        vendorName: digitized.vendorName,
        vendorAbn: digitized.vendorAbn,
        vendorAddress: digitized.vendorAddress,
        documentType: digitized.documentType,
        receiptNumber: digitized.receiptNumber,
        paymentType: digitized.paymentType,
        cashOutAmount: digitized.cashOutAmount,
        discountAmount: digitized.discountAmount,
        amountExclTax: digitized.amountExclTax,
        taxAmount: digitized.taxAmount,
        totalAmount: digitized.totalAmount,
        totalPaidAmount: (digitized as any).totalPaidAmount ?? null,
        surchargeAmount: (digitized as any).surchargeAmount ?? null,
        expenseCategory: digitized.expenseCategory,
        taxStatus: digitized.taxStatus,
        taxType: (digitized as any).taxType ?? null,
        taxTypeName: (digitized as any).taxTypeName ?? null,
      },
    })
    try {
      await prisma.digitized.delete({ where: { id: digitized.id } })
    } catch (e) {
      // ignore if already removed
    }
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to move item to ready' }, { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') })
  }
}
