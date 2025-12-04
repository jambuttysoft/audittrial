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
      
/* const prompt = `
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
  "surchargeAmount": "card/payment surcharge amount as number or 0.00", 
  "totalAmount": "total amount including tax as number",
  "totalPaidAmount": "final amount charged/tendered including cash out",
  "expenseCategory": "category like office supplies, meals, transport, etc",
  "taxStatus": "taxable, tax-free, or mixed",
  "taxType": "one of OUTPUT, INPUT, EXEMPTEXPENSES, EXEMPTOUTPUT, BASEXCLUDED, GSTONIMPORTS",
  "taxTypeName": "label like 'GST on Income', 'GST on Expenses', 'GST Free Expenses', 'GST Free Income', 'BAS Excluded', 'GST on Imports'"
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

TOTAL PAID AMOUNT RULES:
- This field represents the final transaction amount charged to the payment method (e.g., the amount that appears on a bank statement).
- Formula: Generally, TotalPaidAmount = TotalAmount + CashOutAmount.
- Look for lines labeled "EFT", "TOTAL EFT", "VISA", "MASTERCARD", "CARD TOTAL" or "AMOUNT TENDERED".
- In the specific case where Cash Out exists: Ensure TotalPaidAmount includes BOTH the purchase total AND the cash out (e.g., Purchase $105.87 + Cash Out $50.00 = TotalPaidAmount $155.87).
- If no cash out exists, TotalPaidAmount usually equals TotalAmount.

SURCHARGE RULES:
- SurchargeAmount must be extracted if the receipt contains any line indicating an extra fee for payment processing, such as:
  "CARD SURCHARGE", "PAYMENT SURCHARGE", "FEE", or "% FEE".
- If such a line exists, extract the exact amount (e.g., $0.39 in this case).
- The SurchargeAmount must be included in the TotalAmount calculation.
- If no surcharge-indicating lines appear, return SurchargeAmount as 0.00.

GST TAX TYPE DETERMINATION:
- Determine the GST tax type and return two fields: "taxType" and "taxTypeName".
- "taxType" MUST be exactly one of: OUTPUT, INPUT, EXEMPTEXPENSES, EXEMPTOUTPUT, BASEXCLUDED, GSTONIMPORTS.
- "taxTypeName" MUST be one of: "GST on Income", "GST on Expenses", "GST Free Expenses", "GST Free Income", "BAS Excluded", "GST on Imports".
- Selection rules:
  - OUTPUT / "GST on Income": Use for sales/income documents (outgoing invoices to customers). Keywords: "tax invoice issued", "sale", "customer payment". If the document represents revenue.
  - INPUT / "GST on Expenses": Use for purchase/expense receipts/invoices (vendor bills). If the document represents a business expense.
  - EXEMPTEXPENSES / "GST Free Expenses": Expense with taxAmount == 0 and text mentions "GST free", "exempt", or category known GST-free.
  - EXEMPTOUTPUT / "GST Free Income": Income with taxAmount == 0 and text mentions "GST free" or "no GST".
  - BASEXCLUDED / "BAS Excluded": Items outside BAS (e.g., bank fees, fines, non-reportable). If clearly non-BAS.
  - GSTONIMPORTS / "GST on Imports": Imports/customs where GST applies to imports (keywords: "import", "customs", "duty").
- If multiple candidates appear, choose the most specific single value. Do NOT return arrays.
`; */

const prompt = `
You are an expert in extracting data from Australian retail receipts (e.g., Coles, Woolworths, UGG Express, Dry Cleaners) and generating Xero Accounting API requests to record them as purchase bills (ACCPAY), payments, and bank transactions. Analyze this receipt/invoice image using OCR/vision and output TWO main JSON objects: first, an extraction summary; second, the required API request(s) in JSON format for Xero (POST /Invoices for the bill, plus optional POST /Payments and/or POST /BankTransactions if cashout or other features present).

Output ONLY valid JSON like this structure, no additional text:
{
  "extraction": {
    "purchaseDate": "YYYY-MM-DD (from receipt date)",
    "vendorName": "exact vendor name (e.g., 'Dry Cleaners Master')",
    "vendorAbn": "11-digit ABN only (digits, no spaces/hyphens, or '-' if absent)",
    "vendorAddress": "full address or '-'",
    "documentType": "receipt or invoice",
    "receiptNumber": "receipt/invoice number or '-'",
    "subTotal": "subtotal excl. tax/discount as number (pre-GST base)",
    "taxAmount": "GST amount as number (e.g., 4.09)",
    "discountAmount": "transaction discount as negative number (e.g., -53.38 from 'Disc:' line) or 0.00",
    "surchargeAmount": "surcharge fee as number (e.g., 0.39) or 0.00",
    "cashOutAmount": "cash out/withdrawal as number (e.g., 50.00) or 0.00",
    "totalAmount": "final total incl. tax/discount/surcharge as number (e.g., 45.00)",
    "totalPaidAmount": "amount charged to payment method (total + cashout if present) as number",
    "paymentType": "CASH, BANK, CREDITCARD, EFTPOS, VISA, etc. (from tender lines; support split like 'CASH $50 + MASTERCARD $55')",
    "gstIncluded": "true if 'GST Included in Total' or similar present, else false",
    "lineAmountTypes": "Inclusive (if GST included in prices/total) or Exclusive (if separate GST after subtotal, e.g., 'Subtotal (GST,10%) $95.45' + 'GST $9.55')",
    "lineItems": [
      {
        "description": "exact item name (e.g., 'Key Cutting - Plain - Retail Products')",
        "quantity": "number (e.g., 6 from '(6 pieces)') or 1 if not specified",
        "unitAmount": "price per rules: if Inclusive, incl. tax amount per unit (e.g., total / qty); if Exclusive, pre-tax per unit",
        "taxType": "INPUT (taxable, 10% GST) or EXEMPTINPUT (GST-free fresh food) based on ATO rules"
      }
      // Extract ONLY valid product/service lines. Skip/merge annotations like '(6 pieces)' into previous item's quantity. Do not create separate lines for quantities/units.
    ],
    "sumValidation": {
      "calculatedSubTotal": "sum of (qty * unitAmount) for lineItems excl. discount/surcharge as number",
      "calculatedTotal": "calculatedSubTotal + discountAmount + surchargeAmount + (taxAmount if Exclusive) as number",
      "matchesReceipt": "true if |calculatedTotal - totalAmount| < 0.01, else false",
      "adjustments": "brief note on fixes (e.g., 'Consolidated to single line' or 'Skipped invalid qty line') or ''"
    },
    "expenseCategory": "groceries, office supplies, meals, transport, clothing, services, etc. (main category)",
    "taxStatus": "taxable, tax-free, or mixed (if line items vary)"
  },
  "xeroApiRequests": [
    // ALWAYS include the main bill request. Add others conditionally.
    {
      "endpoint": "POST /Invoices",
      "headers": { "Content-Type": "application/json" },  // Assume auth/tenant handled externally
      "body": {
        "Invoices": [
          {
            "Type": "ACCPAY",
            "Contact": {
              "ContactID": "use-your-default-supplier-guid-or-create-via-API"  // Placeholder; assume vendor GUID
            },
            "Date": "YYYY-MM-DD from extraction",
            "DueDate": "same as Date for retail",
            "LineAmountTypes": "from extraction.lineAmountTypes",  // Exclusive if separate GST line, else Inclusive
            "LineItems": [
              // Map from extraction.lineItems ONLY if sumValidation.matchesReceipt=true; else adjust: e.g., if single item mismatch, set qty=1, unitAmount=adjusted total/subTotal
              // { "Description": desc, "Quantity": qty, "UnitAmount": amount (adjusted for lineAmountTypes), "AccountCode": "430" (groceries/services, adjust per category), "TaxType": from extraction }
              // If discountAmount < 0 and not already in lineItems, add { "Description": "Discount", "Quantity": 1, "UnitAmount": discountAmount (pre-tax if Exclusive), "AccountCode": "940" (Discount Received), "TaxType": extraction.gstIncluded ? "INPUT" : "NONE" }
              // Surcharge line: if surchargeAmount > 0, add { "Description": "Payment Surcharge", "Quantity": 1, "UnitAmount": surchargeAmount, "AccountCode": "680" (Bank Fees), "TaxType": "BASEXCLUDED" }
              // FINAL VALIDATION: After mapping, recompute sum; if mismatch >0.01, override to single lineItem with qty=1, unitAmount=total/subTotal, description='Receipt Total Items'.
            ],
            "Status": "AUTHORISED",
            "Reference": "Receipt # + number + date"
          }
        ]
      }
    }
    // Conditional: If cashOutAmount > 0, add payment for bill + bank transaction for cashout
    // {
    //   "endpoint": "POST /Payments",
    //   "body": { "Payments": [ { "Date": date, "Amount": extraction.totalAmount, "Invoice": { "InvoiceID": "placeholder-from-bill-response" }, "Account": { "AccountID": "your-bank-guid" }, "PaymentType": paymentType } ] }  // Split if multiple payments detected
    // },
    // {
    //   "endpoint": "POST /BankTransactions",
    //   "body": { "BankTransactions": [ { "Type": "SPEND", "Date": date, "BankAccount": { "AccountID": "your-bank-guid" }, "LineItems": [ { "Description": "Cash Out from Receipt", "Quantity": 1, "UnitAmount": cashOutAmount, "AccountCode": "800" (Drawings), "TaxType": "BASEXCLUDED" } ], "LineAmountTypes": "Exclusive" } ] }
    // }
    // Conditional: If discount or surcharge present, ensure lines in bill above; no extra endpoint needed.
  ]
}

IMPORTANT RULES:
- LINEAMOUNTTYPES DETECTION: Scan for structure. If 'Subtotal (GST, x%) $XX.XX' followed by 'GST $YY.YY' then 'Total $ZZ.ZZ' (XX + YY = ZZ), set "Exclusive" and subTotal=XX.XX, taxAmount=YY.YY; unitAmounts = pre-tax portions. Else, if 'GST Included' or prices incl. (no separate GST), "Inclusive" and subTotal=total - tax if shown.
- LINE ITEMS VALIDATION & EXTRACTION: Extract ONLY product/service descriptions with prices. Incorporate quantity annotations (e.g., '(6 pieces)', 'Qty: 6') into the main item's "quantity" field (default 1). Do NOT create separate lines for quantities, units, or fragments like 'pieces'. If a recognized "line" is non-descriptive (e.g., just 'pieces', numbers, or subtotal labels), skip it or merge to prior item. For single-item receipts (subTotal == one price), use qty=1, unitAmount=subTotal (pre-tax) or total (incl.), unless explicit qty present—then unitAmount = total / qty (adjust for tax type). After extraction, compute calculatedSubTotal = sum(qty * unitAmount for main items); if |calculatedSubTotal - subTotal| > 0.01, adjust: set qty=1 for that item, unitAmount=subTotal / num_items or total if single.
- SUM VALIDATION: Always perform after lineItems extraction: calculatedSubTotal = sum(qty * unitAmount excl. discount/surcharge); calculatedTotal = calculatedSubTotal + discount + surcharge + (tax if Exclusive). Set matchesReceipt=true only if |calculatedTotal - totalAmount| < 0.01. If false, note adjustments (e.g., 'Overrode qty line to merge'). For discounts: Verify discountAmount = total pre-discount - post-discount; if unclear, set 0.00.
- VARIANT HANDLING: Base is always a simple receipt as ACCPAY bill. Add /Payments if paymentType != CASH (for bill payment; split if e.g., CASH + CARD). Add /BankTransactions ONLY if cashOutAmount > 0 (as SPEND from bank to drawings). Discounts/surcharges: Embed as LineItems (negative for discount, positive for surcharge; adjust for lineAmountTypes). Combinations: Handle all present.
- CASH OUT: PRIORITY 1: Explicit lines ('CASH OUT', 'CASHOUT', 'CASH WITHDRAWAL'). PRIORITY 2: If totalPaidAmount > totalAmount and labeled 'CHANGE' or similar (not pure cash tender). Else 0.00. totalPaidAmount = totalAmount + cashOutAmount.
- DISCOUNT: Extract ONLY from transaction-specific lines ('Disc:', 'Discount $XX.XX', '20% off'). Ignore cumulative 'Total Savings' or loyalty points unless directly deducted here. Always negative; add as bill line with TaxType 'INPUT' (GST on Expenses) if gstIncluded=true, else 'NONE'. If per-item, include as negative lineItem. Validate: Ensure post-discount total matches receipt.
- SURCHARGE: From lines ('CARD SURCHARGE', 'FEE', '% FEE'). Positive; add as bill line if >0. Validate addition to total.
- TAX: For Australia, use INPUT/EXEMPTINPUT in lines; overall taxStatus 'mixed' if varies. taxAmount from explicit GST line. Detect gstIncluded from 'GST Included in Total'. Validate: For Exclusive, taxAmount ≈ subTotal * 0.1; for Inclusive, taxAmount ≈ total * 0.1 / 1.1.
- JSON VALIDITY: All numbers as floats (e.g., 7.50 for 45/6). Dates YYYY-MM-DD. If unclear, use defaults (e.g., qty=1, taxType='INPUT'). For unreadable text, approximate (e.g., '[garbled] Key Cutting').
- API PLACEHOLDERS: Use descriptive placeholders for GUIDs (e.g., 'your-bank-guid'); assume single bill/transaction unless split payments.
- PRECISION: Match receipt totals exactly: for Exclusive, sum LineItems = subTotal, Xero adds tax; for Inclusive, sum LineItems = total (Xero extracts tax). If validation fails, force single consolidated lineItem.
- ABN RECOGNITION: Aggressively scan for ABN: Look in headers/footers for 'ABN:', 'ABN ', 'ABN No.', patterns like 'xx xxx xxx xxx' (11 digits total), or after vendor name. Validate: Must be exactly 11 digits (first digit 1-9, weighted check if possible but prioritize extraction). OCR common errors: Fix 'O' to '0', 'I' to '1', 'S' to '5', spaces/hyphens removed. If multiple, pick the one near vendor name. If none, '-'.
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
      console.log('Parsed receiptData:', receiptData)
      const ext = (receiptData && typeof receiptData === 'object' && receiptData.extraction) ? receiptData.extraction : receiptData

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
          vendor: ext.vendorName || ext.vendor || null,
          abn: ext.vendorAbn || ext.abn || null,
          transactionDate: ext.purchaseDate ? new Date(ext.purchaseDate) : (ext.transactionDate ? new Date(ext.transactionDate) : null),
          gstAmount: ext.taxAmount ? parseFloat(ext.taxAmount.toString()) : (ext.gstAmount ? parseFloat(ext.gstAmount.toString()) : null),
          paymentMethod: ext.paymentType || ext.paymentMethod || null,
          description: ext.expenseCategory || ext.description || null,
          receiptData: receiptData,
        },
      })

      console.log(`Document ${id} digitized successfully:`, {
        vendor: receiptData.vendorName || receiptData.vendor,
        totalAmount: receiptData.totalAmount,
        documentType: receiptData.documentType
      })

      // Создаем запись в таблице Digitized
      const digitizedData = {
        company: { connect: { id: documentWithRelations.companyId } },
        user: { connect: { id: documentWithRelations.userId } },
        originalDocumentId: documentWithRelations.id,
        fileName: documentWithRelations.fileName,
        originalName: documentWithRelations.originalName,
        filePath: documentWithRelations.filePath,
        fileSize: documentWithRelations.fileSize,
        mimeType: documentWithRelations.mimeType,
        purchaseDate: ext && ext.purchaseDate ? new Date(ext.purchaseDate) : null,
        vendorName: ext && ext.vendorName ? ext.vendorName : null,
        vendorAbn: ext && ext.vendorAbn ? ext.vendorAbn : null,
        vendorAddress: ext && ext.vendorAddress ? ext.vendorAddress : null,
        documentType: ext && typeof ext.documentType === 'string' ? ext.documentType : null,
        receiptNumber: ext && ext.receiptNumber ? ext.receiptNumber : null,
        paymentType: ext && ext.paymentType ? ext.paymentType : null,
        cashOutAmount: ext && ext.cashOutAmount !== undefined && ext.cashOutAmount !== null ? parseFloat(ext.cashOutAmount.toString()) : null,
        discountAmount: ext && ext.discountAmount !== undefined && ext.discountAmount !== null ? parseFloat(ext.discountAmount.toString()) : null,
        subTotal: ext && ext.subTotal !== undefined && ext.subTotal !== null ? parseFloat(ext.subTotal.toString()) : null,
        amountExclTax: ext && ext.amountExclTax !== undefined && ext.amountExclTax !== null ? parseFloat(ext.amountExclTax.toString()) : (ext && ext.subTotal !== undefined && ext.subTotal !== null ? parseFloat(ext.subTotal.toString()) : null),
        taxAmount: ext && ext.taxAmount !== undefined && ext.taxAmount !== null ? parseFloat(ext.taxAmount.toString()) : null,
        totalAmount: ext && ext.totalAmount !== undefined && ext.totalAmount !== null ? parseFloat(ext.totalAmount.toString()) : null,
        totalPaidAmount: ext && ext.totalPaidAmount !== undefined && ext.totalPaidAmount !== null ? parseFloat(ext.totalPaidAmount.toString()) : null,
        surchargeAmount: ext && ext.surchargeAmount !== undefined && ext.surchargeAmount !== null ? parseFloat(ext.surchargeAmount.toString()) : null,
        expenseCategory: ext && ext.expenseCategory ? ext.expenseCategory : null,
        taxStatus: ext && typeof ext.taxStatus === 'string' ? ext.taxStatus : null,
        taxType: ext && typeof ext.taxType === 'string' ? ext.taxType : null,
        taxTypeName: ext && typeof ext.taxTypeName === 'string' ? ext.taxTypeName : null,
        lineItems: ext && Array.isArray(ext.lineItems) ? ext.lineItems : null,
        xeroApiRequests: receiptData && Array.isArray(receiptData.xeroApiRequests) ? receiptData.xeroApiRequests : null,
      }
      console.log('Digitized payload to save:', digitizedData)
      let digitizedDocument
      try {
        digitizedDocument = await (prisma as any).digitized.create({ data: digitizedData })
        console.log('Digitized created with ID:', digitizedDocument.id)
      } catch (e: any) {
        console.error('Error saving digitized record:', e?.message || e)
        if (String(e?.message || '').includes('Unknown argument `surchargeAmount`')) {
          const fallbackDataNoSurcharge = { ...digitizedData }
          delete (fallbackDataNoSurcharge as any).surchargeAmount
          console.log('Retrying save without surchargeAmount')
          digitizedDocument = await (prisma as any).digitized.create({ data: fallbackDataNoSurcharge })
          console.log('Digitized created (no surcharge) with ID:', digitizedDocument.id)
        } else {
          throw e
        }
      }
      try {
        const abn = digitizedDocument.vendorAbn?.toString() || ''
        if (/^\d{11}$/.test(abn)) {
          const existing = await (prisma as any).vendor.findUnique({ where: { abn } })
          const needsUpdate = !existing || (existing.requestUpdateDate && ((Date.now() - new Date(existing.requestUpdateDate).getTime()) > 1000 * 60 * 60 * 24 * 180))
          if (needsUpdate) {
            const url = `http://localhost:3645/api/abn-lookup?abn=${abn}`
            const resp = await fetch(url, { method: 'GET' })
            if (resp.ok) {
              const v = await resp.json()
              await (prisma as any).vendor.upsert({
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

      const fallbackData = {
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
      }
      console.log('Fallback digitized payload:', fallbackData)
      const digitizedDocument = await (prisma as any).digitized.create({ data: fallbackData })

      try {
        const abn = digitizedDocument.vendorAbn?.toString() || ''
        if (/^\d{11}$/.test(abn)) {
          const existing = await (prisma as any).vendor.findUnique({ where: { abn } })
          const needsUpdate = !existing || (existing.requestUpdateDate && ((Date.now() - new Date(existing.requestUpdateDate).getTime()) > 1000 * 60 * 60 * 24 * 180))
          if (needsUpdate) {
            const url = `http://localhost:3645/api/abn-lookup?abn=${abn}`
            const resp = await fetch(url, { method: 'GET' })
            if (resp.ok) {
              const v = await resp.json()
              await (prisma as any).vendor.upsert({
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
