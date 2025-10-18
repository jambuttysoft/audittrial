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

    await prisma.digitized.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Document deleted successfully' },
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