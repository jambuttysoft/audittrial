module.exports = {

"[project]/.next-internal/server/app/api/auth/register/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[externals]/crypto [external] (crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[project]/src/app/api/auth/register/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "OPTIONS": ()=>OPTIONS,
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
async function OPTIONS(request) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, name, userType, phone, company, services, isOAuthUser = false, oauthProvider, oauthId } = body;
        // Validate required fields
        if (!email || !name || !userType) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Email, имя и тип пользователя обязательны'
            }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
        // For non-OAuth users, password is required
        if (!isOAuthUser && !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Пароль обязателен'
            }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
        // For OAuth users, provider and ID are required
        if (isOAuthUser && (!oauthProvider || !oauthId)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'OAuth провайдер и ID обязательны для OAuth регистрации'
            }, {
                status: 400
            });
        }
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Пользователь с таким email уже существует'
            }, {
                status: 409,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
        // Hash password for non-OAuth users
        let hashedPassword = null;
        if (!isOAuthUser && password) {
            hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
        }
        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                userType,
                phone,
                company,
                services,
                isOAuthUser,
                oauthProvider,
                oauthId,
                isActive: true,
                isDeleted: false,
                isVisibleToClients: userType === 'BUSINESS',
                acceptsJobOffers: userType === 'BUSINESS'
            },
            select: {
                id: true,
                email: true,
                name: true,
                userType: true,
                phone: true,
                company: true,
                services: true,
                isOAuthUser: true,
                oauthProvider: true,
                isVisibleToClients: true,
                acceptsJobOffers: true,
                isActive: true,
                createdAt: true
            }
        });
        // Automatically create a company if user is BUSINESS type or company name is provided
        let createdCompany = null;
        if (userType === 'BUSINESS' || company) {
            const companyName = company || `${name}'s Company`;
            try {
                createdCompany = await prisma.company.create({
                    data: {
                        name: companyName,
                        description: services || undefined,
                        email: email,
                        phone: phone || undefined,
                        userId: newUser.id,
                        isActive: true
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        email: true,
                        phone: true,
                        isActive: true,
                        createdAt: true
                    }
                });
            } catch (companyError) {
                console.error('Company creation error:', companyError);
            // Don't fail the registration if company creation fails
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Пользователь успешно зарегистрирован',
            user: newUser,
            company: createdCompany
        }, {
            status: 201,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Внутренняя ошибка сервера'
        }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__3ed79173._.js.map