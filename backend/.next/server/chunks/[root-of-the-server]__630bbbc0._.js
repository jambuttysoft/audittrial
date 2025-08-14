module.exports = {

"[project]/.next-internal/server/app/api/documents/[id]/digitize/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[project]/src/app/api/documents/[id]/digitize/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "OPTIONS": ()=>OPTIONS,
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
// Initialize Gemini AI
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY || '');
async function POST(request, { params }) {
    try {
        const body = await request.json();
        const { userId } = body;
        const { id } = await params;
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User ID is required'
            }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            });
        }
        // Get document from database
        const document = await prisma.document.findFirst({
            where: {
                id: id,
                userId: userId
            }
        });
        if (!document) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Document not found'
            }, {
                status: 404,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            });
        }
        // Check if document is an image
        if (!document.mimeType.startsWith('image/')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Document must be an image'
            }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            });
        }
        // Update status to processing
        await prisma.document.update({
            where: {
                id: id
            },
            data: {
                status: 'PROCESSING'
            }
        });
        try {
            // Read the image file
            const imagePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), document.filePath);
            const imageBuffer = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');
            // Initialize Gemini model
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash'
            });
            const prompt = `
Analyze this image and determine if it's a receipt or invoice. If it's NOT a receipt/invoice, return exactly: {"error": "Not a receipt"}

If it IS a receipt/invoice, extract the following information and return it as a JSON object with this exact structure:

{
  "receipt_id": "receipt number if available",
  "date": "YYYY-MM-DD format",
  "supplier": {
    "name": "business name",
    "abn": "ABN if available"
  },
  "total_amount": 0.00,
  "currency": "AUD or detected currency",
  "gst_summary": {
    "gst_inclusive": 0.00,
    "gst_amount": 0.00,
    "gst_free": 0.00,
    "zero_rated": 0.00
  },
  "line_items": [
    {
      "description": "item name",
      "quantity": 1,
      "unit_price": 0.00,
      "tax_type": "GST Inclusive/GST Free/Zero Rated",
      "gst_rate": 0.10,
      "gst_amount": 0.00,
      "total": 0.00
    }
  ],
  "payment": {
    "method": ["Card", "Cash"],
    "split": [
      { "type": "Card", "amount": 0.00 },
      { "type": "Cash", "amount": 0.00 }
    ]
  },
  "is_refund": false,
  "location": "state or location if available",
  "note": "any additional notes"
}

Return ONLY the JSON object, no additional text or formatting.
`;
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: document.mimeType
                    }
                }
            ]);
            const response = await result.response;
            let text = response.text();
            // Clean up markdown formatting if present
            if (text.includes('```json')) {
                // Remove markdown code blocks
                text = text.replace(/```json\s*/g, '').replace(/\s*```/g, '');
            }
            // Additional cleanup - remove any extra whitespace and hidden characters
            text = text.trim();
            // Parse the JSON response
            let receiptData;
            try {
                receiptData = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Failed to parse Gemini response:', text.substring(0, 200));
                throw new Error(`Invalid JSON response from Gemini: ${parseError}`);
            }
            // Check if it's an error response (not a receipt)
            if ('error' in receiptData) {
                await prisma.document.update({
                    where: {
                        id: id
                    },
                    data: {
                        status: 'DELETED'
                    }
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: 'Файл не является чеком и был перемещен в удаленные файлы',
                    status: 'DELETED'
                }, {
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Origin': 'http://localhost:3000'
                    }
                });
            }
            // Update document with digitized data
            const updatedDocument = await prisma.document.update({
                where: {
                    id: id
                },
                data: {
                    status: 'DIGITIZED',
                    processedDate: new Date(),
                    transactionDate: receiptData.date ? new Date(receiptData.date) : null,
                    vendor: receiptData.supplier.name,
                    abn: receiptData.supplier.abn,
                    totalAmount: receiptData.total_amount,
                    gstAmount: receiptData.gst_summary?.gst_amount,
                    description: receiptData.note,
                    paymentMethod: receiptData.payment?.method.join(', '),
                    documentType: 'RECEIPT',
                    receiptData: receiptData
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                document: updatedDocument,
                receiptData: receiptData
            }, {
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            });
        } catch (error) {
            console.error('Error processing with Gemini:', error);
            // Update status to error
            await prisma.document.update({
                where: {
                    id: id
                },
                data: {
                    status: 'ERROR'
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to process document with AI'
            }, {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            });
        }
    } catch (error) {
        console.error('Error in digitize endpoint:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        });
    }
}
async function OPTIONS() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__630bbbc0._.js.map