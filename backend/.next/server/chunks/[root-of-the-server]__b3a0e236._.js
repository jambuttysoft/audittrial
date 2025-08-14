module.exports = {

"[project]/.next-internal/server/app/api/xero/status/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/src/app/api/xero/status/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "DELETE": ()=>DELETE,
    "GET": ()=>GET,
    "OPTIONS": ()=>OPTIONS
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/prisma'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
async function OPTIONS(request) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User ID is required'
            }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                xeroAccessToken: true,
                xeroTokenExpiry: true,
                xeroTenantId: true,
                xeroTenantName: true,
                xeroConnectedAt: true
            }
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User not found'
            }, {
                status: 404,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
        const isConnected = !!(user.xeroAccessToken && user.xeroTenantId);
        const isTokenExpired = user.xeroTokenExpiry ? new Date() > user.xeroTokenExpiry : true;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            isConnected,
            isTokenExpired,
            tenantName: user.xeroTenantName,
            connectedAt: user.xeroConnectedAt,
            needsReconnection: isConnected && isTokenExpired
        }, {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        console.error('Xero status check error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to check Xero status'
        }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User ID is required'
            }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
        // Clear Xero tokens and tenant info
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                xeroAccessToken: null,
                xeroRefreshToken: null,
                xeroTokenExpiry: null,
                xeroTenantId: null,
                xeroTenantName: null
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Xero disconnected successfully'
        }, {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        console.error('Xero disconnect error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to disconnect Xero'
        }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__b3a0e236._.js.map