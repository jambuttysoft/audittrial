import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// GET - получить все оцифрованные документы для компании
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const userId = searchParams.get('userId');

    if (!companyId || !userId) {
      return NextResponse.json(
        { error: 'Company ID and User ID are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const digitizedDocuments = await prisma.Digitized.findMany({
      where: {
        companyId,
        userId,
      },
      orderBy: {
        digitizedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      digitized: digitizedDocuments
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching digitized documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digitized documents' },
      { status: 500, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
      );
    }

    // Создаем запись в таблице Digitized
    const digitizedDocument = await prisma.Digitized.create({
      data: {
        companyId,
        userId,
        originalDocumentId,
        fileName,
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
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error creating digitized document:', error);
    return NextResponse.json(
      { error: 'Failed to create digitized document' },
      { status: 500, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
      );
    }

    // Проверяем, что документ принадлежит пользователю
    const digitizedDocument = await prisma.Digitized.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!digitizedDocument) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404, headers: corsHeaders }
      );
    }

    await prisma.Digitized.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting digitized document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500, headers: corsHeaders }
    );
  }
}