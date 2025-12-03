import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors';

// Replace local PrismaClient with shared client
import { prisma } from '@/lib/prisma';

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '');
}

// GET - получить все оцифрованные документы для компании
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const userId = searchParams.get('userId');

    if (!companyId || !userId) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json(
        { error: 'Company ID and User ID are required' },
        { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') }
      );
    }

    const digitizedDocuments = await prisma.digitized.findMany({
      where: {
        companyId,
        userId,
      },
      orderBy: {
        digitizedAt: 'desc',
      },
    });

    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    return NextResponse.json({
      success: true,
      digitized: digitizedDocuments
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching digitized documents:', error);
    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    return NextResponse.json(
      { error: 'Failed to fetch digitized documents' },
      { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') }
    );
  }
}

// POST - создать новую запись оцифрованного документа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId,
      userId,
      originalDocumentId,
      fileName,
      originalName,
      filePath,
      fileSize,
      mimeType,
      purchaseDate,
      vendorName,
      vendorAbn,
      vendorAddress,
      documentType,
      receiptNumber,
      paymentType,
      amountExclTax,
      taxAmount,
      totalAmount,
      expenseCategory,
      taxStatus,
    } = body;

    if (!companyId || !userId || !originalDocumentId) {
      return NextResponse.json(
        { error: 'Company ID, User ID, and Original Document ID are required' },
        { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') }
      );
    }

    // Создаем запись в таблице Digitized
    const digitizedDocument = await prisma.digitized.create({
      data: {
        company: { connect: { id: companyId } },
        user: { connect: { id: userId } },
        originalDocumentId,
        fileName,
        originalName: originalName ?? fileName,
        filePath,
        fileSize,
        mimeType,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        vendorName,
        vendorAbn,
        vendorAddress,
        documentType,
        receiptNumber,
        paymentType,
        amountExclTax,
        taxAmount,
        totalAmount,
        expenseCategory,
        taxStatus,
      },
    });

    return NextResponse.json(digitizedDocument, { 
      status: 201, 
      headers: getCorsHeaders(request.headers.get('origin') || '') 
    });
  } catch (error) {
    console.error('Error creating digitized document:', error);
    return NextResponse.json(
      { error: 'Failed to create digitized document' },
      { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') }
    );
  }
}

// DELETE - удалить оцифрованный документ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Document ID and User ID are required' },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // Проверяем, что документ принадлежит пользователю
  const digitizedDocument = await prisma.digitized.findFirst({
    where: {
      id,
      userId,
    },
  });

    if (!digitizedDocument) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404, headers: getCorsHeaders(request.headers.get('origin') || '') }
      );
    }

  await (prisma as any).digitizedReview.upsert({
    where: { originalDigitizedId: digitizedDocument.id },
    update: {
      companyId: digitizedDocument.companyId,
      userId: digitizedDocument.userId,
      originalDocumentId: digitizedDocument.originalDocumentId,
      fileName: digitizedDocument.fileName,
      originalName: digitizedDocument.originalName,
      filePath: digitizedDocument.filePath,
      fileSize: digitizedDocument.fileSize,
      mimeType: digitizedDocument.mimeType,
      purchaseDate: digitizedDocument.purchaseDate,
      vendorName: digitizedDocument.vendorName,
      vendorAbn: digitizedDocument.vendorAbn,
      vendorAddress: digitizedDocument.vendorAddress,
      documentType: digitizedDocument.documentType,
      receiptNumber: digitizedDocument.receiptNumber,
      paymentType: digitizedDocument.paymentType,
      cashOutAmount: digitizedDocument.cashOutAmount,
      discountAmount: digitizedDocument.discountAmount,
      amountExclTax: digitizedDocument.amountExclTax,
      taxAmount: digitizedDocument.taxAmount,
      totalAmount: digitizedDocument.totalAmount,
      totalPaidAmount: (digitizedDocument as any).totalPaidAmount ?? null,
      surchargeAmount: (digitizedDocument as any).surchargeAmount ?? null,
      expenseCategory: digitizedDocument.expenseCategory,
      taxStatus: digitizedDocument.taxStatus,
      taxType: (digitizedDocument as any).taxType ?? null,
      taxTypeName: (digitizedDocument as any).taxTypeName ?? null,
      movedAt: new Date(),
    },
    create: {
      originalDigitizedId: digitizedDocument.id,
      companyId: digitizedDocument.companyId,
      userId: digitizedDocument.userId,
      originalDocumentId: digitizedDocument.originalDocumentId,
      fileName: digitizedDocument.fileName,
      originalName: digitizedDocument.originalName,
      filePath: digitizedDocument.filePath,
      fileSize: digitizedDocument.fileSize,
      mimeType: digitizedDocument.mimeType,
      purchaseDate: digitizedDocument.purchaseDate,
      vendorName: digitizedDocument.vendorName,
      vendorAbn: digitizedDocument.vendorAbn,
      vendorAddress: digitizedDocument.vendorAddress,
      documentType: digitizedDocument.documentType,
      receiptNumber: digitizedDocument.receiptNumber,
      paymentType: digitizedDocument.paymentType,
      cashOutAmount: digitizedDocument.cashOutAmount,
      discountAmount: digitizedDocument.discountAmount,
      amountExclTax: digitizedDocument.amountExclTax,
      taxAmount: digitizedDocument.taxAmount,
      totalAmount: digitizedDocument.totalAmount,
      totalPaidAmount: (digitizedDocument as any).totalPaidAmount ?? null,
      surchargeAmount: (digitizedDocument as any).surchargeAmount ?? null,
      expenseCategory: digitizedDocument.expenseCategory,
      taxStatus: digitizedDocument.taxStatus,
      taxType: (digitizedDocument as any).taxType ?? null,
      taxTypeName: (digitizedDocument as any).taxTypeName ?? null,
    },
  });

  await prisma.digitized.delete({ where: { id } });

  return NextResponse.json(
    { message: 'Document moved to Deleted' },
    { headers: getCorsHeaders(request.headers.get('origin') || '') }
  );
  } catch (error) {
    console.error('Error deleting digitized document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

// PUT - обновить данные оцифрованного документа
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Document ID and User ID are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const existing = await prisma.digitized.findFirst({
      where: { id, userId },
      select: { id: true }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404, headers: corsHeaders }
      )
    }

    const body = await request.json()

    // Валидация базовых полей и чисел
    const toNumber = (v: any) => typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : null
    const sanitizeString = (v: any) => typeof v === 'string' ? v.trim() : v

    const purchaseDate = body.purchaseDate ? new Date(body.purchaseDate) : null
    if (purchaseDate && isNaN(purchaseDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid purchaseDate' },
        { status: 400, headers: corsHeaders }
      )
    }

    const cashOutAmount = toNumber(body.cashOutAmount)
    const discountAmount = toNumber(body.discountAmount)
    const surchargeAmount = toNumber(body.surchargeAmount)
    const taxAmount = toNumber(body.taxAmount)
    const amountExclTax = toNumber(body.amountExclTax)
    const totalAmount = toNumber(body.totalAmount)
    const totalPaidAmount = toNumber(body.totalPaidAmount)

    const numbers = { cashOutAmount, discountAmount, surchargeAmount, taxAmount, amountExclTax, totalAmount, totalPaidAmount }
    for (const [k, v] of Object.entries(numbers)) {
      if (v !== null && (isNaN(v as number) || (v as number) < 0)) {
        return NextResponse.json(
          { error: `Invalid numeric field: ${k}` },
          { status: 400, headers: corsHeaders }
        )
      }
    }

    // Бизнес-проверки (допуск 0.02)
    const T = 0.02
    if (totalAmount !== null && totalPaidAmount !== null && cashOutAmount !== null) {
      if (Math.abs((totalPaidAmount as number - (cashOutAmount as number)) - (totalAmount as number)) > T) {
        return NextResponse.json(
          { error: 'Paid minus Cash Out must equal Total (tolerance 0.02)' },
          { status: 400, headers: corsHeaders }
        )
      }
    }
    if (totalAmount !== null && taxAmount !== null) {
      if ((taxAmount as number) > ((totalAmount as number) / 11 + T)) {
        return NextResponse.json(
          { error: 'GST exceeds Total/11' },
          { status: 400, headers: corsHeaders }
        )
      }
      if (((totalAmount as number) - (taxAmount as number)) < 0) {
        return NextResponse.json(
          { error: 'Tax exceeds Total' },
          { status: 400, headers: corsHeaders }
        )
      }
    }

    // Обновляем запись
    const updated = await (prisma as any).digitized.update({
      where: { id },
      data: {
        purchaseDate,
        vendorName: sanitizeString(body.vendorName),
        vendorAbn: sanitizeString(body.vendorAbn),
        vendorAddress: sanitizeString(body.vendorAddress),
        documentType: sanitizeString(body.documentType),
        receiptNumber: sanitizeString(body.receiptNumber),
        paymentType: sanitizeString(body.paymentType),
        cashOutAmount: cashOutAmount ?? undefined,
        discountAmount: discountAmount ?? undefined,
        surchargeAmount: surchargeAmount ?? undefined,
        taxAmount: taxAmount ?? undefined,
        amountExclTax: amountExclTax ?? undefined,
        totalAmount: totalAmount ?? undefined,
        totalPaidAmount: totalPaidAmount ?? undefined,
        expenseCategory: sanitizeString(body.expenseCategory),
        taxStatus: sanitizeString(body.taxStatus),
        taxType: sanitizeString(body.taxType),
        taxTypeName: sanitizeString(body.taxTypeName),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error updating digitized document:', error)
    return NextResponse.json(
      { error: 'Failed to update digitized document' },
      { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') }
    )
  }
}
