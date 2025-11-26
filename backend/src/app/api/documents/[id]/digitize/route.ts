import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'User ID is required' }, { 
        status: 400,
        headers: corsHeaders,
      })
    }

    // Find the document
    const document = await prisma.document.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!document) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'Document not found' }, { 
        status: 404,
        headers: corsHeaders,
      })
    }

    if (document.status === 'DIGITIZED') {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'Document already digitized' }, { 
        status: 400,
        headers: corsHeaders,
      })
    }

    // Update status to processing
    await prisma.document.update({
      where: { id },
      data: { status: 'PROCESSING' },
    })

    try {
      // Check if file exists
      const fullPath = join(process.cwd(), document.filePath)
      if (!existsSync(fullPath)) {
        throw new Error('File not found on disk')
      }

      // Read file for processing
      const fileBuffer = await readFile(fullPath)
      const base64Data = fileBuffer.toString('base64')

  // Process with Gemini AI (mock implementation)
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'
      console.log('Using Gemini model:', modelName)
      const model = genAI.getGenerativeModel({ model: modelName })
      
const prompt = `
Analyze this receipt/invoice image and extract ALL the following information in JSON format:
{
  "purchaseDate": "YYYY-MM-DD format (Purchase Date)",
  "vendorName": "vendor/business name",
  "vendorAbn": "Australian Business Number if present",
  "vendorAddress": "complete vendor address",
  "documentType": "receipt or invoice",
  "receiptNumber": "receipt or invoice number",
  "paymentType": "cash, card, eftpos, credit, etc",
  "amountExclTax": "amount excluding tax as number",
  "taxAmount": "GST/tax amount as number",
  "cashOutAmount": "cash out amount as number or null",
  "discountAmount": "discount amount as number or null",
  "totalAmount": "total amount including tax as number",
  "expenseCategory": "category like office supplies, meals, transport, etc",
  "taxStatus": "taxable, tax-free, or mixed"
}

IMPORTANT:
- Return only valid JSON without any additional text.
- If a TEXT field cannot be determined, use '-' (single dash), NOT null.
- If a NUMERIC field cannot be determined, use 0.00 (number), NOT null.
- Ensure all amounts are numbers, not strings.
- Use Australian date format YYYY-MM-DD.
- Be precise with expense categorization.
- For vendorAbn: Extract ONLY DIGITS, remove all spaces, hyphens, and special characters. ABN must be 11 consecutive digits (e.g. "12345678901").
- For expenseCategory: Use only common categories like "office supplies", "meals", "transport", "utilities", etc.

CASH OUT RULES:
- CashOutAmount is derived from a dedicated line OR calculated if payment exceeds total.
- Explicit Line: If the receipt contains a dedicated cash-out line (e.g., "CASH OUT", "CASHOUT", "LESS CASH OUT", "CASH WITHDRAWAL"), use that amount.
- Implicit Calculation (for your specific case): If an 'Amount Paid' (or similar total payment line, e.g., $27.13 next to GST) is greater than 'Total Amount' (e.g., $7.13), AND the difference is labelled 'Change', assume this 'Change' is Cash Out, PROVIDED the payment is NOT clearly "Cash Paid". In this specific Bunnings format, the amount $27.13 is the card payment, and the $20.00 'Change' is the Cash Out.
- Final Rule: If a Cash Out amount is found through either method, use it. Otherwise, return CashOutAmount as 0.00.
- PRIORITY 1: Explicit Cash Out Line. If the receipt contains a dedicated line with "CASH OUT", "CASHOUT", "LESS CASH OUT", "CASH WITHDRAWAL", "AUD$ CASH OUT", etc., extract that amount. This is the preferred method.
- PRIORITY 2: Implicit Calculation (Change as Cash Out). If an 'Amount Paid' (or similar payment line like EFT, VISA) is greater than 'Total Amount', AND the difference is labelled 'Change', and no 'Cash Paid' line is present, then calculate CashOutAmount as (Amount Paid - Total). **However, if a line from PRIORITY 1 is found, use that value.**
- If no Cash Out amount is found through either method, return CashOutAmount as 0.00.

DISCOUNT RULES:
- DiscountAmount must be extracted if the receipt contains ANY discount-indicating line, including:
  "DISCOUNT", "LESS", "PROMO", "COUPON",
  "FLYBUYS REDEEMED", "POINTS REDEEMED".
- If such a line exists, extract the amount of the deduction (even if loyalty points were used as monetary value).
- If no discount-indicating lines appear, return DiscountAmount as 0.00.
`;


      console.log(`Starting AI digitization for document ${id}...`)
      console.log(`Document type: ${document.mimeType}, size: ${document.fileSize} bytes`)
      
      // Retry mechanism for handling API overload
      let result
      let lastError
      const maxRetries = 3
      const baseDelay = 2000 // 2 seconds
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Attempt ${attempt}/${maxRetries} to call Gemini API...`)
          
          result = await model.generateContent([
            {
              inlineData: {
                mimeType: document.mimeType,
                data: base64Data,
              },
            },
            { text: prompt },
          ])
          
          console.log(`✅ Gemini API call successful on attempt ${attempt}`)
          break // Success, exit retry loop
          
        } catch (apiError) {
          lastError = apiError
          console.log(`❌ Attempt ${attempt} failed:`, apiError.message)
          
          // Check if it's a retryable error (503 Service Unavailable)
          const isRetryable = apiError.message.includes('503') || 
                             apiError.message.includes('overloaded') ||
                             apiError.message.includes('Service Unavailable')
          
          if (!isRetryable || attempt === maxRetries) {
            console.log(`Non-retryable error or max retries reached. Throwing error.`)
            throw apiError
          }
          
          // Calculate exponential backoff delay
          const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000
          console.log(`⏳ Waiting ${Math.round(delay)}ms before retry...`)
          
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }

      const response = await result.response
      const text = response.text()
      console.log(`AI response received for document ${id}:`, text.substring(0, 200) + '...')
      
      // Parse the JSON response
      let receiptData
      try {
        receiptData = JSON.parse(text.replace(/```json|```/g, '').trim())
      } catch (parseError) {
        console.error('Failed to parse AI response:', text)
        receiptData = {
          vendor: 'Unknown',
          totalAmount: 0,
          documentType: 'receipt',
          error: 'Failed to parse receipt data'
        }
      }

      // Get document data for creating digitized record
      const documentWithRelations = await prisma.document.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (!documentWithRelations) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        )
      }

      // Update document status only
      const updatedDocument = await prisma.document.update({
        where: { id },
        data: {
          status: 'DIGITIZED',
          processedDate: new Date(),
          // Legacy поля для обратной совместимости
          vendor: receiptData.vendorName || receiptData.vendor || null,
          abn: receiptData.vendorAbn || receiptData.abn || null,
          transactionDate: receiptData.purchaseDate ? new Date(receiptData.purchaseDate) : (receiptData.transactionDate ? new Date(receiptData.transactionDate) : null),
          gstAmount: receiptData.taxAmount ? parseFloat(receiptData.taxAmount.toString()) : (receiptData.gstAmount ? parseFloat(receiptData.gstAmount.toString()) : null),
          paymentMethod: receiptData.paymentType || receiptData.paymentMethod || null,
          description: receiptData.expenseCategory || receiptData.description || null,
          receiptData: receiptData,
        },
      })

      console.log(`Document ${id} digitized successfully:`, {
        vendor: receiptData.vendorName || receiptData.vendor,
        totalAmount: receiptData.totalAmount,
        documentType: receiptData.documentType
      })

      // Создаем запись в таблице Digitized
      const digitizedDocument = await prisma.digitized.create({
        data: {
          company: { connect: { id: documentWithRelations.companyId } },
          user: { connect: { id: documentWithRelations.userId } },
          originalDocumentId: documentWithRelations.id,
          fileName: documentWithRelations.fileName,
          originalName: documentWithRelations.originalName,
          filePath: documentWithRelations.filePath,
          fileSize: documentWithRelations.fileSize,
          mimeType: documentWithRelations.mimeType,
          purchaseDate: receiptData.purchaseDate ? new Date(receiptData.purchaseDate) : null,
          vendorName: receiptData.vendorName || null,
          vendorAbn: receiptData.vendorAbn || null,
          vendorAddress: receiptData.vendorAddress || null,
          documentType: typeof receiptData.documentType === 'string' ? receiptData.documentType : null,
          receiptNumber: receiptData.receiptNumber || null,
          paymentType: receiptData.paymentType || null,
          cashOutAmount: receiptData.cashOutAmount !== undefined && receiptData.cashOutAmount !== null ? parseFloat(receiptData.cashOutAmount.toString()) : null,
          discountAmount: receiptData.discountAmount !== undefined && receiptData.discountAmount !== null ? parseFloat(receiptData.discountAmount.toString()) : null,
          amountExclTax: receiptData.amountExclTax !== undefined && receiptData.amountExclTax !== null ? parseFloat(receiptData.amountExclTax.toString()) : null,
          taxAmount: receiptData.taxAmount !== undefined && receiptData.taxAmount !== null ? parseFloat(receiptData.taxAmount.toString()) : null,
          totalAmount: receiptData.totalAmount !== undefined && receiptData.totalAmount !== null ? parseFloat(receiptData.totalAmount.toString()) : null,
          expenseCategory: receiptData.expenseCategory || null,
          taxStatus: typeof receiptData.taxStatus === 'string' ? receiptData.taxStatus : null,
        },
      })

      try {
        const abn = digitizedDocument.vendorAbn?.toString() || ''
        if (/^\d{11}$/.test(abn)) {
          const existing = await prisma.vendor.findUnique({ where: { abn } })
          const needsUpdate = !existing || (existing.requestUpdateDate && ((Date.now() - new Date(existing.requestUpdateDate).getTime()) > 1000 * 60 * 60 * 24 * 180))
          if (needsUpdate) {
            const url = `http://localhost:3645/api/abn-lookup?abn=${abn}`
            const resp = await fetch(url, { method: 'GET' })
            if (resp.ok) {
              const v = await resp.json()
              await prisma.vendor.upsert({
                where: { abn },
                update: {
                  abnStatus: v.AbnStatus || null,
                  abnStatusEffectiveFrom: v.AbnStatusEffectiveFrom ? new Date(v.AbnStatusEffectiveFrom) : null,
                  acn: v.Acn || null,
                  addressDate: v.AddressDate ? new Date(v.AddressDate) : null,
                  addressPostcode: v.AddressPostcode || null,
                  addressState: v.AddressState || null,
                  businessName: Array.isArray(v.BusinessName) ? v.BusinessName : null,
                  entityName: v.EntityName || null,
                  entityTypeCode: v.EntityTypeCode || null,
                  entityTypeName: v.EntityTypeName || null,
                  gst: v.Gst ? new Date(v.Gst) : null,
                  message: v.Message || null,
                  requestUpdateDate: new Date(),
                },
                create: {
                  abn,
                  abnStatus: v.AbnStatus || null,
                  abnStatusEffectiveFrom: v.AbnStatusEffectiveFrom ? new Date(v.AbnStatusEffectiveFrom) : null,
                  acn: v.Acn || null,
                  addressDate: v.AddressDate ? new Date(v.AddressDate) : null,
                  addressPostcode: v.AddressPostcode || null,
                  addressState: v.AddressState || null,
                  businessName: Array.isArray(v.BusinessName) ? v.BusinessName : null,
                  entityName: v.EntityName || null,
                  entityTypeCode: v.EntityTypeCode || null,
                  entityTypeName: v.EntityTypeName || null,
                  gst: v.Gst ? new Date(v.Gst) : null,
                  message: v.Message || null,
                  requestUpdateDate: new Date(),
                },
              })
            }
          }
        }
      } catch {}

      console.log(`Document ${id} transferred to Digitized table with ID: ${digitizedDocument.id}`)

      // Удаляем документ из таблицы Documents
      await prisma.document.delete({
        where: { id },
      })

      console.log(`Document ${id} removed from Documents queue`)

      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({
        success: true,
        digitizedDocument,
        message: 'Document digitization completed successfully',
      }, {
        headers: corsHeaders,
      })
    } catch (processingError) {
      console.error(`Processing error for document ${id}:`, processingError)
      console.log('Proceeding with fallback digitization without AI data')

      // Fallback: create a minimal digitized record from existing document metadata
      const documentWithRelations = await prisma.document.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          company: { select: { id: true, name: true } },
        },
      })

      if (!documentWithRelations) {
        const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
        return NextResponse.json(
          { error: 'Document not found for fallback processing' },
          { status: 404, headers: corsHeaders }
        )
      }

      const updatedDocument = await prisma.document.update({
        where: { id },
        data: {
          status: 'DIGITIZED',
          processedDate: new Date(),
          receiptData: { error: 'AI processing failed; fallback applied' },
        },
      })

      const digitizedDocument = await prisma.digitized.create({
        data: {
          company: { connect: { id: documentWithRelations.companyId } },
          user: { connect: { id: documentWithRelations.userId } },
          originalDocumentId: documentWithRelations.id,
          fileName: documentWithRelations.fileName,
          originalName: documentWithRelations.originalName,
          filePath: documentWithRelations.filePath,
          fileSize: documentWithRelations.fileSize,
          mimeType: documentWithRelations.mimeType,
          documentType: 'receipt',
          taxStatus: 'taxable',
        },
      })

      try {
        const abn = digitizedDocument.vendorAbn?.toString() || ''
        if (/^\d{11}$/.test(abn)) {
          const existing = await prisma.vendor.findUnique({ where: { abn } })
          const needsUpdate = !existing || (existing.requestUpdateDate && ((Date.now() - new Date(existing.requestUpdateDate).getTime()) > 1000 * 60 * 60 * 24 * 180))
          if (needsUpdate) {
            const url = `http://localhost:3645/api/abn-lookup?abn=${abn}`
            const resp = await fetch(url, { method: 'GET' })
            if (resp.ok) {
              const v = await resp.json()
              await prisma.vendor.upsert({
                where: { abn },
                update: {
                  abnStatus: v.AbnStatus || null,
                  abnStatusEffectiveFrom: v.AbnStatusEffectiveFrom ? new Date(v.AbnStatusEffectiveFrom) : null,
                  acn: v.Acn || null,
                  addressDate: v.AddressDate ? new Date(v.AddressDate) : null,
                  addressPostcode: v.AddressPostcode || null,
                  addressState: v.AddressState || null,
                  businessName: Array.isArray(v.BusinessName) ? v.BusinessName : null,
                  entityName: v.EntityName || null,
                  entityTypeCode: v.EntityTypeCode || null,
                  entityTypeName: v.EntityTypeName || null,
                  gst: v.Gst ? new Date(v.Gst) : null,
                  message: v.Message || null,
                  requestUpdateDate: new Date(),
                },
                create: {
                  abn,
                  abnStatus: v.AbnStatus || null,
                  abnStatusEffectiveFrom: v.AbnStatusEffectiveFrom ? new Date(v.AbnStatusEffectiveFrom) : null,
                  acn: v.Acn || null,
                  addressDate: v.AddressDate ? new Date(v.AddressDate) : null,
                  addressPostcode: v.AddressPostcode || null,
                  addressState: v.AddressState || null,
                  businessName: Array.isArray(v.BusinessName) ? v.BusinessName : null,
                  entityName: v.EntityName || null,
                  entityTypeCode: v.EntityTypeCode || null,
                  entityTypeName: v.EntityTypeName || null,
                  gst: v.Gst ? new Date(v.Gst) : null,
                  message: v.Message || null,
                  requestUpdateDate: new Date(),
                },
              })
            }
          }
        }
      } catch {}

      await prisma.document.delete({ where: { id } })

      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({
        success: true,
        digitizedDocument,
        message: 'Digitization completed with fallback (AI unavailable)',
      }, { headers: corsHeaders })
    }
  } catch (error) {
    console.error('Digitize error:', error)
    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    return NextResponse.json(
      { error: 'Failed to digitize document' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}
