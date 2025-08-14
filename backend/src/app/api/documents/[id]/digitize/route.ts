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
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      
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
          "totalAmount": "total amount including tax as number",
          "expenseCategory": "category like office supplies, meals, transport, etc",
          "taxStatus": "taxable, tax-free, or mixed"
        }
        
        IMPORTANT: 
        - Return only valid JSON without any additional text
        - If a field cannot be determined, use null
        - Ensure all amounts are numbers, not strings
        - Use Australian date format YYYY-MM-DD
        - Be precise with expense categorization
        - For vendorAbn: Extract ONLY DIGITS, remove all spaces, hyphens, and special characters. ABN should be 11 consecutive digits only (e.g., "12345678901" not "12 345 678 901" or "12-345-678-901")
      `

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
          companyId: documentWithRelations.companyId,
          userId: documentWithRelations.userId,
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
          documentType: receiptData.documentType || 'receipt',
          receiptNumber: receiptData.receiptNumber || null,
          paymentType: receiptData.paymentType || null,
          amountExclTax: receiptData.amountExclTax ? parseFloat(receiptData.amountExclTax.toString()) : null,
          taxAmount: receiptData.taxAmount ? parseFloat(receiptData.taxAmount.toString()) : null,
          totalAmount: receiptData.totalAmount ? parseFloat(receiptData.totalAmount.toString()) : null,
          expenseCategory: receiptData.expenseCategory || null,
          taxStatus: receiptData.taxStatus || 'taxable',
        },
      })

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
      console.error('Error details:', {
        message: processingError.message,
        status: processingError.status,
        statusText: processingError.statusText,
        stack: processingError.stack
      })
      
      // Determine error type and appropriate response
      let errorMessage = 'Failed to process document'
      let shouldRetryLater = false
      
      if (processingError.message.includes('503') || processingError.message.includes('overloaded')) {
        errorMessage = 'AI service is temporarily overloaded. Please try again in a few minutes.'
        shouldRetryLater = true
        console.log('💡 Recommendation: Gemini API is overloaded, user should retry later')
      } else if (processingError.message.includes('403') || processingError.message.includes('PERMISSION_DENIED')) {
        errorMessage = 'AI service authentication failed. Please contact support.'
        console.log('💡 Recommendation: Check Gemini API key configuration')
      } else if (processingError.message.includes('400')) {
        errorMessage = 'Document format not supported or corrupted.'
        console.log('💡 Recommendation: Check document format and size')
      } else {
        console.log('💡 Recommendation: Unknown error, check logs for details')
      }
      
      // Update status to error
      await prisma.document.update({
        where: { id },
        data: { 
          status: 'ERROR',
          processedDate: new Date()
        },
      })
      
      console.log(`Document ${id} status updated to ERROR`)

      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json(
        { 
          error: errorMessage,
          retryable: shouldRetryLater,
          details: processingError.message
        },
        { 
          status: shouldRetryLater ? 503 : 500,
          headers: corsHeaders,
        }
      )
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
  } finally {
    await prisma.$disconnect()
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}