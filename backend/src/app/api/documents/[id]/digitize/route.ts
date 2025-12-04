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
You are an expert in extracting data from Australian retail receipts (e.g., Coles, Woolworths, BUNNINGS, UGG Express, etc.) and generating Xero Accounting API requests to record them as purchase bills (ACCPAY), payments, and bank transactions. Analyze this receipt/invoice image using OCR/vision capabilities to accurately parse text, numbers, dates, and layout. Handle complexities like faded text, abbreviations, and multi-line items. Output TWO main JSON objects: first, an extraction summary with precise calculations; second, the required API request(s) in JSON format for Xero (always POST /Invoices for the bill; conditionally POST /Payments for bill settlement and/or POST /BankTransactions for cashouts or full bank reconciliation).
Output ONLY valid JSON in this exact structure, no additional text or explanations:
{
"extraction": {
"purchaseDate": "YYYY-MM-DD format from receipt date/time (infer year from context if partial, e.g., '12 Jul 25' -> '2025-07-12' based on current date Dec 04, 2025)",
"vendorName": "exact vendor name as printed (e.g., 'UGG EXPRESS', 'BUNNINGS WERRIBEE')",
"vendorAbn": "11-digit ABN only (strip spaces/hyphens/dashes, e.g., '44168645685'; use '00000000000' if absent or unreadable)",
"vendorAddress": "full street/city/postcode if present, or partial location (e.g., 'Werribee'); use '-' if none",
"documentType": "'receipt' or 'invoice' or 'tax invoice' based on header (e.g., 'Receipt / Tax Invoice')",
"receiptNumber": "exact number (e.g., '#3610', 'S6415 R01 P971'); use '-' if absent",
"subTotal": "pre-GST base amount of main items BEFORE any transaction-level discounts/points (number, e.g., 95.45; sum lineItems unitAmount * qty excl. item discounts if separate, but apply item discounts to unitAmount)",
"taxAmount": "exact GST amount as number (e.g., 9.55) from 'GST' or 'Tax' line. CRITICAL CALCULATION: Reflects GST on taxable items AFTER item-level and transaction-level discounts, EXCLUDING cashout/surcharges. For Inclusive: round((totalAmount - discountAmount - surchargeAmount) * 10 / 110, 2). For Exclusive: use stated GST. Validate against ATO 10% rate.",
"discountAmount": "transaction-level discount/points redemption ONLY as POSITIVE number (e.g., 10.00 from 'Flybuys points redeemed'; absolute value). 0.00 if item-level only (handle in lineItems). Detect: 'Disc:', 'Discount', 'Points redeemed (X)' lines post-subtotal.",
"surchargeAmount": "any payment surcharge/fee as positive number (e.g., 0.39 from 'Surcharge'); 0.00 if absent",
"cashOutAmount": "cash withdrawal amount as positive number (e.g., 20.00); 0.00 if absent. DETECTION PRIORITY: 1. Explicit: 'CASH OUT', 'CASHOUT', 'WITHDRAWAL' lines. 2. Implicit: If card/EFT payment + 'Change' >0.00 (e.g., Bunnings $20.00 change with card), and no cash tender shown, infer cashout = change value where totalPaidAmount = totalAmount + cashOutAmount. Exclude standard change from cash tender.",
"totalAmount": "final billed amount incl. tax/discounts/surcharges EXCL. cashout as number (e.g., 105.00 or 7.13)",
"totalPaidAmount": "amount debited to payment method(s) as number (totalAmount + cashOutAmount + surchargeAmount if applicable; e.g., 27.13 for $7.13 total + $20 cashout)",
"paymentType": "primary method (e.g., 'MASTERCARD', 'EFTPOS', 'CREDITCARD'); for split: 'CASH $50.00 + MASTERCARD $55.00'. Infer from tender lines like 'Tyro (Mastercard)', 'Card No: XXX'.",
"gstIncluded": "true if 'GST Included in Total', 'GST Incl', or similar; false if separate GST post-subtotal",
"lineAmountTypes": "'Inclusive' if gstIncluded=true (standard retail, prices incl. GST); 'Exclusive' if GST added after subtotal (e.g., 'Subtotal $95.45 + GST $9.55')",
"lineItems": [
{
"description": "exact item/service name incl. codes/sizes (e.g., 'AS-MINI CLASSIC / CHESTNUT', '90M FIBREGLASS 9926'); merge quantities like '(6 pieces)' into qty, skip annotations",
"quantity": "integer (e.g., 1 or 2 from '2 @'); default 1 if unspecified",
"unitAmount": "AFTER ITEM-LEVEL DISCOUNTS: For Inclusive: discounted incl. GST price per unit (e.g., original $185.99 - $53.38 disc = $132.61 / qty). For Exclusive: discounted excl. GST per unit. Round to 2 decimals.",
"taxType": "'INPUT' for taxable (10% GST, e.g., clothing/tools); 'EXEMPTINPUT' for GST-free (fresh food, exports per ATO); infer from item type if unclear"
}
// ONLY valid purchasable lines; ignore totals, taxes, payments, loyalty notes, barcodes. Limit to 20 items max; aggregate if too many.
],
"sumValidation": {
"calculatedSubTotal": "sum(qty * unitAmount for lineItems) as number (excl. transaction discount/surcharge/cashout)",
"calculatedTax": "if Inclusive: round(calculatedSubTotal * 10 / 100, 2); if Exclusive: sum(line GST) or stated total GST",
"calculatedTotal": "calculatedSubTotal - discountAmount + surchargeAmount + calculatedTax as number",
"matchesReceipt": "true if Math.abs(calculatedTotal - totalAmount) < 0.01, else false",
"adjustments": "brief fixes (e.g., 'Applied 30% item disc to unitAmount: $185.99 -> $132.61; inferred Inclusive from GST calc'; 'Skipped non-item line'; '' if perfect)"
},
"expenseCategory": "infer main (e.g., 'clothing' for UGG, 'hardware' for Bunnings tools, 'office supplies' default)",
"taxStatus": "'taxable' if all INPUT; 'tax-free' if all EXEMPTINPUT; 'mixed' if varies"
},
"xeroApiRequests": [
// ALWAYS: Bill for the purchase (net of discounts/surcharges).
{
"endpoint": "POST /Invoices",
"headers": { "Content-Type": "application/json", "Authorization": "Bearer your-access-token" },
"body": {
"Invoices": [
{
"Type": "ACCPAY",
"Contact": {
"Name": "extraction.vendorName",
"ContactID": "default-supplier-guid-or-null-to-create"
},
"Date": "extraction.purchaseDate",
"DueDate": "extraction.purchaseDate",
"LineAmountTypes": "extraction.lineAmountTypes",
"LineItems": [
// Map each extraction.lineItems directly.
// Example: { "Description": item.description, "Quantity": item.quantity, "UnitAmount": item.unitAmount, "AccountCode": "430" (General Expenses), "TaxType": item.taxType, "TaxAmount": if Exclusive: unitAmount * 0.1 * qty }
// If item-level disc applied, it's already in unitAmount; no separate line.
],
// ENHANCED DISCOUNT LOGIC: Transaction-level only (item-level already netted). Use POSITIVE discountAmount; subtract via negative UnitAmount in line.
// If discountAmount > 0, append negative line AFTER main items (UnitAmount = -discountAmount).
// Tax adjustment: Discounts reduce GST base proportionally. For tax-free discounts (no GST impact), use TaxType: NONE if lineAmountTypes=Exclusive or gstIncluded=false.
{
"Description": "Transaction Discount / Loyalty Points Redemption",
"Quantity": 1,
"UnitAmount": "-extraction.discountAmount",
"AccountCode": "940",
"TaxType": "extraction.lineAmountTypes === 'Inclusive' ? 'INPUT' : 'NONE'"
},
// Surcharge: If >0, append positive line.
// { "Description": "Payment Surcharge Fee", "Quantity": 1, "UnitAmount": extraction.surchargeAmount, "AccountCode": "680", "TaxType": "INPUT" }
// FALLBACK VALIDATION: If sum(LineItems UnitAmount * Qty) mismatches totalAmount >0.01, consolidate to single line: qty=1, unitAmount=extraction.totalAmount, desc='Aggregated Receipt Items (Discounts Applied)', taxType based on taxStatus.
"Status": "AUTHORISED",
"Reference": "extraction.receiptNumber + ' - ' + extraction.purchaseDate"
}
]
}
},
// Conditional: Bill payment if totalAmount > 0 (settles the ACCPAY via bank transfer).
// Amount = totalAmount (excl. cashout; cashout handled separately).
// Placeholder InvoiceID links to prior bill response.
{
"endpoint": "POST /Payments",
"headers": { "Content-Type": "application/json", "Authorization": "Bearer your-access-token" },
"body": {
"Payments": [
{
"Date": "extraction.purchaseDate",
"Amount": "extraction.totalAmount",
"Invoice": { "InvoiceID": "placeholder-invoice-id-from-bill" },
"Account": { "AccountID": "your-bank-account-guid" },
"PaymentType": "extraction.paymentType === 'CASH' ? 'CASH' : 'BANK'"
}
]
}
},
// ENHANCED CASH OUT LOGIC: Separate if cashOutAmount > 0 (non-taxable; reconciles extra bank debit).
// Records as SPEND from bank for cash withdrawal (not part of bill).
// For full reconciliation: In practice, match to single bank statement line of totalPaidAmount by reference.
{
"endpoint": "POST /BankTransactions",
"headers": { "Content-Type": "application/json", "Authorization": "Bearer your-access-token" },
"body": {
"BankTransactions": [
{
"Type": "SPEND",
"Date": "extraction.purchaseDate",
"BankAccount": { "AccountID": "your-bank-account-guid" },
"LineItems": [
{
"Description": "Cash Out / Withdrawal from " + extraction.vendorName + " Receipt",
"Quantity": 1,
"UnitAmount": "extraction.cashOutAmount",
"AccountCode": "800",
"TaxType": "BASEEXCLUDED"
}
],
"LineAmountTypes": "Exclusive",
"Reference": "extraction.receiptNumber + ' Cash Out'"
}
]
}
}
// If split payments, add multiple Payment lines or note in Reference.
]
}
IMPORTANT RULES (MANDATORY - FOLLOW STRICTLY):

LINEAMOUNTTYPES DETECTION: Scan for phrases: 'GST Included', 'Incl. GST' -> Inclusive (unitAmount incl. tax, Xero auto-applies 10% reverse). 'GST (10%)' after subtotal -> Exclusive (add TaxAmount = unitAmount * 0.1). Default Inclusive for retail.
LINE ITEMS VALIDATION: Only tangible goods/services; skip taxes, totals, payments, loyalty notes, barcodes. Parse codes (e.g., '931149605579') into desc. Handle bundles (e.g., '2 @ $7.13' -> qty=2, unit=3.565 if even). If unpriced, estimate from total / qty.
ABN RECOGNITION: Look for 'ABN:' optionally followed by 11 digits in format XX XXX XXX XXX (or variations with spaces/hyphens), or standalone 11 consecutive digits (XXXXXXXXXXX) positioned where ABN typically appears (e.g., after vendor name/address). Regex to match patterns like /ABN[:\s](\d{2}\s\d{3}\s*\d{3}\s*\d{2})|(\d{11})/ -> concatenate digits only (strip all spaces/hyphens/dashes). Validate exactly 11 digits; if possible, perform ABN checksum validation via code (e.g., weighted sum modulo 11). Use '00000000000' if invalid, unreadable, or absent.
DATE PARSING: Formats: 'Thu 02/10/2025', 'Sat, 12 Jul 25 1:34pm' -> standardize. Use current year if ambiguous (e.g., 'Jul 25' = 2025).
DISCOUNT PRIORITY (ENHANCED):
Item-level (e.g., 'Disc: 53.38 (30%)'): Apply directly to lineItem unitAmount (original - disc = net). Recalc tax on net: Inclusive tax = net * 10/110. No separate line.
Transaction-level (e.g., 'Flybuys points redeemed (2,000) $10.00'): Set discountAmount = 10.00 (positive); in Xero, use UnitAmount = -10.00. GST adjustment: Negative INPUT reduces input tax credit proportionally. CRITICAL: If no tax applies to discount (e.g., tax-free item or Exclusive without GST on disc), set TaxType='NONE' for the discount line to avoid negative tax.
Total savings/loyalty earned: Ignore for extraction (not discounts; earned is future credit).

CASH OUT PRIORITY (ENHANCED):
Explicit: Direct lines with values.
Implicit: Card payment + positive 'Change' / 'Rounding Change' (e.g., $20.00) where no cash tender > total (indicates cashback). Validate: if totalPaidAmount not stated, infer = totalAmount + cashOutAmount. For cash tender scenarios (e.g., tender $30 for $7.13 total -> change $22.87 standard, not cashout).
Impact: Excl. from bill total/tax; separate SPEND. totalPaidAmount includes it for bank debit. No GST on cashout (fund transfer).

TAX AMOUNT CALCULATION (ENHANCED): Always validate/override stated GST if mismatch: taxAmount = round((subTotal - discountAmount) * (extraction.lineAmountTypes === 'Inclusive' ? 10/110 : 0.1), 2). Flag in adjustments if adjusted (e.g., 'Overrode stated GST 0.65 to calc 0.65'). Mixed taxStatus: Apportion per line. Discounts without tax: If discount on exempt items, ensure taxAmount excludes it entirely (no negative GST).
SUM VALIDATION: If mismatch, prioritize receipt totalAmount; adjust unitAmounts proportionally (e.g., scale lineItems by factor = totalAmount / calculatedTotal). Log in adjustments.
SPLIT PAYMENTS: Parse multiple tender lines (e.g., 'Cash $50 + Card $55'); set paymentType as string summary; create multiple /Payments entries if >1 method.
EDGE CASES: Zero total (e.g., full credit): Still create bill with $0 lines. Unreadable numbers: Use OCR confidence, default 0.00 + note. Multi-receipt image: Output array of extractions/xeroRequests if >1 detected.
XERO COMPLIANCE: AccountCodes: Use standards (430 Expenses, 940 Discounts, 680 Fees, 800 Drawings). TaxTypes per ATO/Xero: INPUT=10% GST on expenses. Bodies must be valid JSON; placeholders for IDs. Discount lines: Always positive extraction, negative UnitAmount in API; TaxType=NONE if discount is tax-free (no GST reduction needed).
ACCURACY: Cross-validate all numbers (e.g., 95.45 * 1.1 = 105.00?). If image low-res, note in adjustments.
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
