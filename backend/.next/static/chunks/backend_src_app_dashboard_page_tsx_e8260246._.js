(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/backend/src/app/dashboard/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>DashboardPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/node_modules/next/navigation.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/ui/button'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/card'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/badge'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/tabs'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/building.js [app-client] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileIcon$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript) <export default as FileIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-client] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/link.js [app-client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/unlink.js [app-client] (ecmascript) <export default as Unlink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/backend/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
(()=>{
    const e = new Error("Cannot find module '@/components/ui/table'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/CompanyFileManager'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/toaster'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/hooks/use-toast'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/input'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/label'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/textarea'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/dialog'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ui/tooltip'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function DashboardPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { toast } = useToast();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [documents, setDocuments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [companies, setCompanies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCompany, setSelectedCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isEditingCompany, setIsEditingCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editedCompany, setEditedCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previousDigitizedCount, setPreviousDigitizedCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedDocumentForJson, setSelectedDocumentForJson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedDocumentForImage, setSelectedDocumentForImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isJsonModalOpen, setIsJsonModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isImageModalOpen, setIsImageModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedDocumentForAbn, setSelectedDocumentForAbn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAbnModalOpen, setIsAbnModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [abnData, setAbnData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoadingAbn, setIsLoadingAbn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Xero integration state
    const [xeroStatus, setXeroStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        connected: false
    });
    const [isLoadingXero, setIsLoadingXero] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [xeroTestResult, setXeroTestResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isTestingXero, setIsTestingXero] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showXeroAccountsModal, setShowXeroAccountsModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            // Check user authorization
            const userData = localStorage.getItem('user');
            if (!userData) {
                router.push('/auth');
                return;
            }
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                loadDashboardData(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                router.push('/auth');
            }
        }
    }["DashboardPage.useEffect"], []);
    // Handle company parameter from URL
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            const companyId = searchParams.get('company');
            if (companyId && companies.length > 0) {
                const company = companies.find({
                    "DashboardPage.useEffect.company": (c)=>c.id === companyId
                }["DashboardPage.useEffect.company"]);
                if (company) {
                    setSelectedCompany(company);
                    loadCompanyDocuments(company.id);
                }
            } else if (companies.length > 0 && !selectedCompany) {
                // Select first company by default
                setSelectedCompany(companies[0]);
                loadCompanyDocuments(companies[0].id);
            }
        }
    }["DashboardPage.useEffect"], [
        searchParams,
        companies
    ]);
    // Auto-refresh documents every 5 seconds to track digitization status
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            if (!(selectedCompany === null || selectedCompany === void 0 ? void 0 : selectedCompany.id)) return;
            const interval = setInterval({
                "DashboardPage.useEffect.interval": ()=>{
                    const processingDocs = documents.filter({
                        "DashboardPage.useEffect.interval.processingDocs": (doc)=>doc.status === 'PROCESSING'
                    }["DashboardPage.useEffect.interval.processingDocs"]);
                    if (processingDocs.length > 0) {
                        loadCompanyDocuments(selectedCompany.id);
                    }
                }
            }["DashboardPage.useEffect.interval"], 5000);
            return ({
                "DashboardPage.useEffect": ()=>clearInterval(interval)
            })["DashboardPage.useEffect"];
        }
    }["DashboardPage.useEffect"], [
        selectedCompany === null || selectedCompany === void 0 ? void 0 : selectedCompany.id,
        documents
    ]);
    const loadDashboardData = async (userData)=>{
        try {
            // Load companies
            await loadCompanies(userData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally{
            setIsLoading(false);
        }
    };
    const loadCompanies = async (userData)=>{
        try {
            const response = await fetch("http://localhost:3001/api/companies?userId=".concat(userData.id));
            if (response.ok) {
                const companiesData = await response.json();
                setCompanies(companiesData);
            } else {
                console.error('Failed to load companies');
            }
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    };
    const loadCompanyDocuments = async (companyId)=>{
        if (!(user === null || user === void 0 ? void 0 : user.id)) return;
        try {
            const response = await fetch("http://localhost:3001/api/companies/".concat(companyId, "/files?userId=").concat(user.id));
            if (response.ok) {
                const documentsData = await response.json();
                const newDigitizedCount = documentsData.filter((doc)=>doc.status === 'DIGITIZED').length;
                // Check if the number of digitized documents has increased
                if (previousDigitizedCount > 0 && newDigitizedCount > previousDigitizedCount) {
                    const newlyDigitized = newDigitizedCount - previousDigitizedCount;
                    toast({
                        title: 'Digitization completed!',
                        description: "".concat(newlyDigitized, " ").concat(newlyDigitized === 1 ? 'document digitized' : 'documents digitized', ". Table updated.")
                    });
                }
                setDocuments(documentsData);
                setPreviousDigitizedCount(newDigitizedCount);
            } else {
                console.error('Failed to load company documents');
                setDocuments([]);
            }
        } catch (error) {
            console.error('Error loading company documents:', error);
            setDocuments([]);
        }
    };
    const handleCompanyUpdate = async ()=>{
        if (!editedCompany || !(user === null || user === void 0 ? void 0 : user.id)) return;
        try {
            const response = await fetch("http://localhost:3001/api/companies/".concat(editedCompany.id, "?userId=").concat(user.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: editedCompany.name,
                    description: editedCompany.description,
                    email: editedCompany.email,
                    phone: editedCompany.phone,
                    address: editedCompany.address,
                    website: editedCompany.website,
                    abn: editedCompany.abn,
                    industry: editedCompany.industry
                })
            });
            if (response.ok) {
                const updatedCompany = await response.json();
                setSelectedCompany(updatedCompany);
                setCompanies(companies.map((c)=>c.id === updatedCompany.id ? updatedCompany : c));
                setIsEditingCompany(false);
                setEditedCompany(null);
            } else {
                console.error('Failed to update company');
            }
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };
    const checkAbnDetails = async (abn)=>{
        setIsLoadingAbn(true);
        setAbnData(null);
        try {
            const response = await fetch("http://localhost:3001/api/abn-lookup?abn=".concat(abn));
            if (response.ok) {
                const data = await response.json();
                setAbnData(data);
            } else {
                const errorData = await response.json();
                toast({
                    title: 'ABN Check Error',
                    description: errorData.error || 'Failed to get ABN data',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Error checking ABN:', error);
            toast({
                title: 'Network Error',
                description: 'Failed to connect to ABN verification service',
                variant: 'destructive'
            });
        } finally{
            setIsLoadingAbn(false);
        }
    };
    const getStatusBadge = (status)=>{
        const statusConfig = {
            'QUEUE': {
                label: 'In Queue',
                variant: 'secondary'
            },
            'PROCESSING': {
                label: 'Processing',
                variant: 'default'
            },
            'DIGITIZED': {
                label: 'Digitized',
                variant: 'default'
            },
            'ERROR': {
                label: 'Error',
                variant: 'destructive'
            },
            'DELETED': {
                label: 'Deleted',
                variant: 'outline'
            }
        };
        const config = statusConfig[status] || {
            label: status,
            variant: 'secondary'
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
            variant: config.variant,
            children: config.label
        }, void 0, false, {
            fileName: "[project]/backend/src/app/dashboard/page.tsx",
            lineNumber: 317,
            columnNumber: 12
        }, this);
    };
    const formatFileSize = (bytes)=>{
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = [
            'Bytes',
            'KB',
            'MB',
            'GB'
        ];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const formatDate = (dateString)=>{
        return new Date(dateString).toLocaleDateString('en-AU');
    };
    // Xero integration functions
    const checkXeroStatus = async ()=>{
        if (!(user === null || user === void 0 ? void 0 : user.id)) return;
        try {
            const response = await fetch("http://localhost:3001/api/xero/status?userId=".concat(user.id));
            if (response.ok) {
                const status = await response.json();
                setXeroStatus(status);
            }
        } catch (error) {
            console.error('Error checking Xero status:', error);
        }
    };
    const handleXeroConnect = async ()=>{
        if (!(user === null || user === void 0 ? void 0 : user.id)) return;
        setIsLoadingXero(true);
        try {
            const response = await fetch("http://localhost:3001/api/xero/auth?userId=".concat(user.id));
            if (response.ok) {
                const { consentUrl } = await response.json();
                window.open(consentUrl, '_blank', 'width=600,height=700');
                // Poll for connection status
                const pollInterval = setInterval(async ()=>{
                    await checkXeroStatus();
                    if (xeroStatus.connected) {
                        clearInterval(pollInterval);
                        toast({
                            title: 'Xero Connected!',
                            description: "Successfully connected to ".concat(xeroStatus.tenantName)
                        });
                    }
                }, 2000);
                // Stop polling after 2 minutes
                setTimeout(()=>clearInterval(pollInterval), 120000);
            }
        } catch (error) {
            console.error('Error connecting to Xero:', error);
            toast({
                title: 'Connection Failed',
                description: 'Failed to connect to Xero. Please try again.',
                variant: 'destructive'
            });
        } finally{
            setIsLoadingXero(false);
        }
    };
    const handleXeroDisconnect = async ()=>{
        if (!(user === null || user === void 0 ? void 0 : user.id)) return;
        setIsLoadingXero(true);
        try {
            const response = await fetch("http://localhost:3001/api/xero/status?userId=".concat(user.id), {
                method: 'DELETE'
            });
            if (response.ok) {
                setXeroStatus({
                    connected: false
                });
                setXeroTestResult(null);
                toast({
                    title: 'Xero Disconnected',
                    description: 'Successfully disconnected from Xero'
                });
            }
        } catch (error) {
            console.error('Error disconnecting from Xero:', error);
            toast({
                title: 'Disconnection Failed',
                description: 'Failed to disconnect from Xero. Please try again.',
                variant: 'destructive'
            });
        } finally{
            setIsLoadingXero(false);
        }
    };
    const handleXeroTest = async ()=>{
        if (!(user === null || user === void 0 ? void 0 : user.id)) return;
        setIsTestingXero(true);
        setXeroTestResult(null);
        try {
            const response = await fetch("http://localhost:3001/api/xero/test?userId=".concat(user.id));
            const result = await response.json();
            if (response.ok) {
                setXeroTestResult(result);
                toast({
                    title: 'Xero Test Successful!',
                    description: "Retrieved ".concat(result.accountsCount, " accounts from ").concat(result.tenantName)
                });
            } else {
                const errorMessage = result.error || 'Failed to fetch accounts from Xero';
                // If token expired or unauthorized, update Xero status to disconnected
                if (response.status === 401 || errorMessage.includes('expired') || errorMessage.includes('Unauthorized')) {
                    setXeroStatus({
                        connected: false
                    });
                    setXeroTestResult(null);
                    toast({
                        title: 'Xero Connection Lost',
                        description: 'Your Xero connection has expired. Please reconnect to continue.',
                        variant: 'destructive'
                    });
                    return; // Stop further attempts
                }
                setXeroTestResult({
                    error: errorMessage
                });
                toast({
                    title: 'Xero Test Failed',
                    description: errorMessage,
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Error testing Xero connection:', error);
            setXeroTestResult({
                error: 'Network error occurred'
            });
            toast({
                title: 'Test Failed',
                description: 'Failed to test Xero connection. Please try again.',
                variant: 'destructive'
            });
        } finally{
            setIsTestingXero(false);
        }
    };
    // Fetch Xero accounts using SDK
    const handleGetXeroAccounts = async ()=>{
        if (!(user === null || user === void 0 ? void 0 : user.id)) return;
        setIsTestingXero(true);
        setXeroTestResult(null);
        try {
            const response = await fetch("http://localhost:3001/api/xero/test?userId=".concat(user.id));
            const result = await response.json();
            if (response.ok) {
                setXeroTestResult(result);
                setShowXeroAccountsModal(true);
                toast({
                    title: 'Accounts Retrieved!',
                    description: "Retrieved ".concat(result.accountsCount, " accounts from ").concat(result.tenantName)
                });
            } else {
                const errorMessage = result.error || 'Failed to fetch accounts from Xero';
                // If token expired or unauthorized, update Xero status to disconnected
                if (response.status === 401 || errorMessage.includes('expired') || errorMessage.includes('Unauthorized')) {
                    setXeroStatus({
                        connected: false
                    });
                    setXeroTestResult(null);
                    toast({
                        title: 'Xero Connection Lost',
                        description: 'Your Xero connection has expired. Please reconnect to continue.',
                        variant: 'destructive'
                    });
                    return;
                }
                toast({
                    title: 'Failed to Get Accounts',
                    description: errorMessage,
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Error fetching Xero accounts:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch Xero accounts. Please try again.',
                variant: 'destructive'
            });
        } finally{
            setIsTestingXero(false);
        }
    };
    // Check Xero status on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            if (user === null || user === void 0 ? void 0 : user.id) {
                checkXeroStatus();
            }
        }
    }["DashboardPage.useEffect"], [
        user === null || user === void 0 ? void 0 : user.id
    ]);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-lg",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 523,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/backend/src/app/dashboard/page.tsx",
            lineNumber: 522,
            columnNumber: 7
        }, this);
    }
    if (!selectedCompany) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 space-y-4 p-4 md:p-8 pt-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center min-h-[400px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                            className: "h-12 w-12 text-muted-foreground mx-auto mb-4"
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 533,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-medium",
                            children: "No Company Selected"
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 534,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "Select a company from the sidebar to view data"
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 535,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                    lineNumber: 532,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 531,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/backend/src/app/dashboard/page.tsx",
            lineNumber: 530,
            columnNumber: 7
        }, this);
    }
    const totalDocuments = documents.length;
    const digitizedDocuments = documents.filter((doc)=>doc.status === 'DIGITIZED').length;
    const queueDocuments = documents.filter((doc)=>doc.status === 'QUEUE').length;
    const processingDocuments = documents.filter((doc)=>doc.status === 'PROCESSING').length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 space-y-4 p-4 md:p-8 pt-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between space-y-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-bold tracking-tight",
                            children: selectedCompany.name
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 551,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: selectedCompany.description
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 552,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                    lineNumber: 550,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 549,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardHeader, {
                                className: "flex flex-row items-center justify-between space-y-0 pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardTitle, {
                                        className: "text-sm font-medium",
                                        children: "Total Documents"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 560,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        className: "h-4 w-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 561,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 559,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold",
                                        children: totalDocuments
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 564,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Documents uploaded"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 565,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 563,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                        lineNumber: 558,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardHeader, {
                                className: "flex flex-row items-center justify-between space-y-0 pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardTitle, {
                                        className: "text-sm font-medium",
                                        children: "Digitized"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 573,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        className: "h-4 w-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 574,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 572,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold",
                                        children: digitizedDocuments
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 577,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Processed documents"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 578,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 576,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                        lineNumber: 571,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardHeader, {
                                className: "flex flex-row items-center justify-between space-y-0 pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardTitle, {
                                        className: "text-sm font-medium",
                                        children: "In Queue"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 586,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        className: "h-4 w-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 587,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 585,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold",
                                        children: queueDocuments
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 590,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Awaiting processing"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 591,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 589,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                        lineNumber: 584,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardHeader, {
                                className: "flex flex-row items-center justify-between space-y-0 pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardTitle, {
                                        className: "text-sm font-medium",
                                        children: "Processing"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 599,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        className: "h-4 w-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 600,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 598,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold",
                                        children: processingDocuments
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 603,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "In progress"
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 604,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 602,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                        lineNumber: 597,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 557,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tabs, {
                defaultValue: "documents",
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsList, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsTrigger, {
                                value: "documents",
                                children: "Documents"
                            }, void 0, false, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 614,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsTrigger, {
                                value: "digitized",
                                children: "Digitized"
                            }, void 0, false, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 615,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsTrigger, {
                                value: "profile",
                                children: "Profile"
                            }, void 0, false, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 616,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                        lineNumber: 613,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsContent, {
                        value: "documents",
                        className: "space-y-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompanyFileManager, {
                            company: selectedCompany,
                            userId: (user === null || user === void 0 ? void 0 : user.id) || '',
                            onDocumentsChange: ()=>loadCompanyDocuments(selectedCompany.id)
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 620,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                        lineNumber: 619,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsContent, {
                        value: "digitized",
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardHeader, {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardTitle, {
                                                children: "Digitized Documents"
                                            }, void 0, false, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 630,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardDescription, {
                                                children: "Documents that have been successfully processed"
                                            }, void 0, false, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 631,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 629,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Table, {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHeader, {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableRow, {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Purchase Date"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 639,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Vendor Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 640,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Vendor ABN"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 641,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Vendor Address"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 642,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Document Type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 643,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Receipt/Invoice Number"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 644,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Payment Type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 645,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Amount Excl. Tax"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 646,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Tax Amount (GST)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 647,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Total Amount"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 648,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Expense Category"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 649,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Tax Status"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 650,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Actions"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 651,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 638,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 637,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableBody, {
                                                    children: documents.filter((doc)=>doc.status === 'DIGITIZED').map((doc)=>{
                                                        const receiptData = doc.receiptData || {};
                                                        const totalAmount = typeof doc.totalAmount === 'number' ? doc.totalAmount : typeof doc.totalAmount === 'string' ? parseFloat(doc.totalAmount) : 0;
                                                        const gstAmount = typeof doc.gstAmount === 'number' ? doc.gstAmount : typeof doc.gstAmount === 'string' ? parseFloat(doc.gstAmount) : 0;
                                                        const subtotal = doc.totalAmount && doc.gstAmount ? totalAmount - gstAmount : null;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableRow, {
                                                            className: "cursor-pointer hover:bg-muted/50",
                                                            onClick: ()=>{
                                                                setSelectedDocumentForJson(doc);
                                                                setIsJsonModalOpen(true);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: doc.transactionDate ? formatDate(doc.transactionDate) : '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 670,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    className: "font-medium",
                                                                    children: doc.vendor || receiptData.vendor || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 671,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: doc.abn || receiptData.abn || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 672,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: receiptData.address || receiptData.vendorAddress || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 673,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: doc.documentType || receiptData.documentType || 'Receipt'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 674,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: receiptData.invoiceNumber || receiptData.receiptNumber || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 675,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: doc.paymentMethod || receiptData.paymentMethod || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 676,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: subtotal ? "$".concat(subtotal.toFixed(2)) : '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 677,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: doc.gstAmount && typeof doc.gstAmount === 'number' ? "$".concat(doc.gstAmount.toFixed(2)) : doc.gstAmount && typeof doc.gstAmount === 'string' ? "$".concat(parseFloat(doc.gstAmount).toFixed(2)) : '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 678,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: doc.totalAmount && typeof doc.totalAmount === 'number' ? "$".concat(doc.totalAmount.toFixed(2)) : doc.totalAmount && typeof doc.totalAmount === 'string' ? "$".concat(parseFloat(doc.totalAmount).toFixed(2)) : '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 679,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: receiptData.category || receiptData.expenseCategory || '-'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 680,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                        variant: doc.gstAmount ? 'default' : 'secondary',
                                                                        children: doc.gstAmount ? 'Included' : 'No GST'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 682,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 681,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center space-x-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                                                variant: "ghost",
                                                                                size: "sm",
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    setSelectedDocumentForImage(doc);
                                                                                    setIsImageModalOpen(true);
                                                                                },
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                    className: "h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                    lineNumber: 697,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                lineNumber: 688,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TooltipProvider, {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TooltipTrigger, {
                                                                                            asChild: true,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                                                                variant: "ghost",
                                                                                                size: "sm",
                                                                                                onClick: (e)=>{
                                                                                                    var _doc_receiptData;
                                                                                                    e.stopPropagation();
                                                                                                    const abn = doc.abn || ((_doc_receiptData = doc.receiptData) === null || _doc_receiptData === void 0 ? void 0 : _doc_receiptData.abn);
                                                                                                    if (abn) {
                                                                                                        setSelectedDocumentForAbn(doc);
                                                                                                        setIsAbnModalOpen(true);
                                                                                                        checkAbnDetails(abn);
                                                                                                    } else {
                                                                                                        toast({
                                                                                                            title: 'ABN not found',
                                                                                                            description: 'The document does not contain an ABN for verification',
                                                                                                            variant: 'destructive'
                                                                                                        });
                                                                                                    }
                                                                                                },
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                                                    className: "h-4 w-4"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                                    lineNumber: 721,
                                                                                                    columnNumber: 35
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                                lineNumber: 702,
                                                                                                columnNumber: 33
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                            lineNumber: 701,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TooltipContent, {
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                children: "Check Vendor"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                                lineNumber: 725,
                                                                                                columnNumber: 33
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                            lineNumber: 724,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                    lineNumber: 700,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                lineNumber: 699,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TooltipProvider, {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TooltipTrigger, {
                                                                                            asChild: true,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                                                                variant: "ghost",
                                                                                                size: "sm",
                                                                                                onClick: (e)=>{
                                                                                                    e.stopPropagation();
                                                                                                    // Here will be the logic for creating Xero Journal Record
                                                                                                    toast({
                                                                                                        title: 'Xero Journal Record',
                                                                                                        description: 'Xero Journal Record creation feature will be implemented'
                                                                                                    });
                                                                                                },
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                                                                                    className: "h-4 w-4"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                                    lineNumber: 744,
                                                                                                    columnNumber: 35
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                                lineNumber: 732,
                                                                                                columnNumber: 33
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                            lineNumber: 731,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TooltipContent, {
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                children: "Create Xero Journal Record"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                                lineNumber: 748,
                                                                                                columnNumber: 33
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                            lineNumber: 747,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                    lineNumber: 730,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                                lineNumber: 729,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 687,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 686,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, doc.id, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 662,
                                                            columnNumber: 23
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 636,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 635,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 628,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardHeader, {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardTitle, {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                                    className: "h-5 w-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 768,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "Xero Integration"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 767,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardDescription, {
                                                            children: "Connect your Xero account to sync financial data"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 771,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 766,
                                                    columnNumber: 17
                                                }, this),
                                                xeroStatus.connected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            className: "h-4 w-4 text-green-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 777,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-green-600",
                                                            children: "Connected"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 778,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 776,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                            className: "h-4 w-4 text-orange-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 782,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-orange-500",
                                                            children: "Not Connected"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 783,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 781,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 765,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 764,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                                        className: "space-y-4",
                                        children: xeroStatus.connected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Tenant Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 793,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm",
                                                                    children: xeroStatus.tenantName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 794,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 792,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Tenant ID"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 797,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-mono",
                                                                    children: xeroStatus.tenantId
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 798,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 796,
                                                            columnNumber: 21
                                                        }, this),
                                                        xeroStatus.tokenExpiry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "md:col-span-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Token Expires"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 802,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm",
                                                                    children: formatDate(xeroStatus.tokenExpiry)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 803,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 801,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 791,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 flex-wrap",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                            onClick: handleXeroDisconnect,
                                                            disabled: isLoadingXero || isTestingXero,
                                                            variant: "outline",
                                                            size: "sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"], {
                                                                    className: "h-4 w-4 mr-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 815,
                                                                    columnNumber: 23
                                                                }, this),
                                                                isLoadingXero ? 'Disconnecting...' : 'Disconnect'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 809,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                            onClick: handleXeroConnect,
                                                            disabled: isLoadingXero || isTestingXero,
                                                            variant: "outline",
                                                            size: "sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                                    className: "h-4 w-4 mr-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 824,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Reconnect"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 818,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                            onClick: handleXeroTest,
                                                            disabled: isLoadingXero || isTestingXero,
                                                            variant: "default",
                                                            size: "sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                    className: "h-4 w-4 mr-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 833,
                                                                    columnNumber: 23
                                                                }, this),
                                                                isTestingXero ? 'Testing...' : 'Test Connection'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 827,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                            onClick: handleGetXeroAccounts,
                                                            disabled: isLoadingXero || isTestingXero,
                                                            variant: "outline",
                                                            size: "sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                    className: "h-4 w-4 mr-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 842,
                                                                    columnNumber: 23
                                                                }, this),
                                                                isTestingXero ? 'Loading...' : 'Get Accounts'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 836,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 808,
                                                    columnNumber: 19
                                                }, this),
                                                xeroTestResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 p-4 rounded-lg border",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-medium mb-2",
                                                            children: "Test Results"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 851,
                                                            columnNumber: 23
                                                        }, this),
                                                        xeroTestResult.error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-red-600 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Error:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 854,
                                                                    columnNumber: 27
                                                                }, this),
                                                                " ",
                                                                xeroTestResult.error
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 853,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-green-600",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "✓ Connection Successful!"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 859,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 858,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Tenant:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                            lineNumber: 862,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        xeroTestResult.tenantName
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 861,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Accounts Retrieved:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                            lineNumber: 865,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        " ",
                                                                        xeroTestResult.accountsCount
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 864,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                                    onClick: ()=>setShowXeroAccountsModal(true),
                                                                    variant: "outline",
                                                                    size: "sm",
                                                                    className: "mt-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                            className: "h-4 w-4 mr-2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                            lineNumber: 873,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        "View All Accounts"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 867,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 857,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 850,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 790,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Connect your Xero account to automatically sync invoices, expenses, and other financial data."
                                                }, void 0, false, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 883,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                    onClick: handleXeroConnect,
                                                    disabled: isLoadingXero,
                                                    className: "w-full sm:w-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                            className: "h-4 w-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 891,
                                                            columnNumber: 21
                                                        }, this),
                                                        isLoadingXero ? 'Connecting...' : 'Connect to Xero'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 886,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 882,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 788,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 763,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                        lineNumber: 627,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabsContent, {
                        value: "profile",
                        className: "space-y-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardHeader, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardTitle, {
                                                        children: "Company Profile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 905,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardDescription, {
                                                        children: [
                                                            "Information about ",
                                                            selectedCompany.name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 906,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 904,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                onClick: ()=>{
                                                    setIsEditingCompany(!isEditingCompany);
                                                    setEditedCompany(selectedCompany);
                                                },
                                                variant: "outline",
                                                size: "sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                        className: "h-4 w-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 918,
                                                        columnNumber: 19
                                                    }, this),
                                                    isEditingCompany ? 'Cancel' : 'Edit'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 910,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 903,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 902,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {
                                    className: "space-y-6",
                                    children: isEditingCompany ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                htmlFor: "name",
                                                                children: "Company Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 928,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                                id: "name",
                                                                value: (editedCompany === null || editedCompany === void 0 ? void 0 : editedCompany.name) || '',
                                                                onChange: (e)=>setEditedCompany((prev)=>prev ? {
                                                                            ...prev,
                                                                            name: e.target.value
                                                                        } : null)
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 929,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 927,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                htmlFor: "industry",
                                                                children: "Industry"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 936,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                                id: "industry",
                                                                value: (editedCompany === null || editedCompany === void 0 ? void 0 : editedCompany.industry) || '',
                                                                onChange: (e)=>setEditedCompany((prev)=>prev ? {
                                                                            ...prev,
                                                                            industry: e.target.value
                                                                        } : null)
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 937,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 935,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 926,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                        htmlFor: "description",
                                                        children: "Description"
                                                    }, void 0, false, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 946,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Textarea, {
                                                        id: "description",
                                                        value: (editedCompany === null || editedCompany === void 0 ? void 0 : editedCompany.description) || '',
                                                        onChange: (e)=>setEditedCompany((prev)=>prev ? {
                                                                    ...prev,
                                                                    description: e.target.value
                                                                } : null)
                                                    }, void 0, false, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 947,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 945,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                htmlFor: "email",
                                                                children: "Email"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 956,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                                id: "email",
                                                                type: "email",
                                                                value: (editedCompany === null || editedCompany === void 0 ? void 0 : editedCompany.email) || '',
                                                                onChange: (e)=>setEditedCompany((prev)=>prev ? {
                                                                            ...prev,
                                                                            email: e.target.value
                                                                        } : null)
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 957,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 955,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                htmlFor: "phone",
                                                                children: "Phone"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 965,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                                id: "phone",
                                                                value: (editedCompany === null || editedCompany === void 0 ? void 0 : editedCompany.phone) || '',
                                                                onChange: (e)=>setEditedCompany((prev)=>prev ? {
                                                                            ...prev,
                                                                            phone: e.target.value
                                                                        } : null)
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 966,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 964,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 954,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                htmlFor: "website",
                                                                children: "Website"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 976,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                                id: "website",
                                                                value: (editedCompany === null || editedCompany === void 0 ? void 0 : editedCompany.website) || '',
                                                                onChange: (e)=>setEditedCompany((prev)=>prev ? {
                                                                            ...prev,
                                                                            website: e.target.value
                                                                        } : null)
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 977,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 975,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                                htmlFor: "abn",
                                                                children: "ABN"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 984,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                                id: "abn",
                                                                value: (editedCompany === null || editedCompany === void 0 ? void 0 : editedCompany.abn) || '',
                                                                onChange: (e)=>setEditedCompany((prev)=>prev ? {
                                                                            ...prev,
                                                                            abn: e.target.value
                                                                        } : null)
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 985,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 983,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 974,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Label, {
                                                        htmlFor: "address",
                                                        children: "Address"
                                                    }, void 0, false, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 994,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Textarea, {
                                                        id: "address",
                                                        value: (editedCompany === null || editedCompany === void 0 ? void 0 : editedCompany.address) || '',
                                                        onChange: (e)=>setEditedCompany((prev)=>prev ? {
                                                                    ...prev,
                                                                    address: e.target.value
                                                                } : null)
                                                    }, void 0, false, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 995,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 993,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                        onClick: handleCompanyUpdate,
                                                        children: "Save Changes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 1003,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Button, {
                                                        variant: "outline",
                                                        onClick: ()=>{
                                                            setIsEditingCompany(false);
                                                            setEditedCompany(null);
                                                        },
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 1006,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 1002,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 925,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-sm font-medium text-muted-foreground mb-1",
                                                                        children: "Company Name"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1022,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm",
                                                                        children: selectedCompany.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1023,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1021,
                                                                columnNumber: 23
                                                            }, this),
                                                            selectedCompany.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-sm font-medium text-muted-foreground mb-1",
                                                                        children: "Description"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1028,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm",
                                                                        children: selectedCompany.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1029,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1027,
                                                                columnNumber: 25
                                                            }, this),
                                                            selectedCompany.industry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-sm font-medium text-muted-foreground mb-1",
                                                                        children: "Industry"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1035,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm",
                                                                        children: selectedCompany.industry
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1036,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1034,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 1020,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: [
                                                            selectedCompany.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center space-x-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                        className: "h-4 w-4 text-muted-foreground"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1044,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm",
                                                                        children: selectedCompany.email
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1045,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1043,
                                                                columnNumber: 25
                                                            }, this),
                                                            selectedCompany.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center space-x-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                        className: "h-4 w-4 text-muted-foreground"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1051,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm",
                                                                        children: selectedCompany.phone
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1052,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1050,
                                                                columnNumber: 25
                                                            }, this),
                                                            selectedCompany.website && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center space-x-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                                        className: "h-4 w-4 text-muted-foreground"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1058,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: selectedCompany.website,
                                                                        target: "_blank",
                                                                        rel: "noopener noreferrer",
                                                                        className: "text-sm text-blue-600 hover:underline",
                                                                        children: selectedCompany.website
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1059,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1057,
                                                                columnNumber: 25
                                                            }, this),
                                                            selectedCompany.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start space-x-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                        className: "h-4 w-4 text-muted-foreground mt-0.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1067,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm",
                                                                        children: selectedCompany.address
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1068,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1066,
                                                                columnNumber: 25
                                                            }, this),
                                                            selectedCompany.abn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-sm font-medium text-muted-foreground mb-1",
                                                                        children: "ABN"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1074,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm",
                                                                        children: selectedCompany.abn
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1075,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1073,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 1041,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 1019,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t pt-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-2xl font-bold",
                                                                    children: selectedCompany.documentsCount
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1084,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-muted-foreground",
                                                                    children: "Documents"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1085,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1083,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-2xl font-bold",
                                                                    children: digitizedDocuments
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1088,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-muted-foreground",
                                                                    children: "Digitized"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1089,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1087,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-2xl font-bold",
                                                                    children: formatDate(selectedCompany.createdAt)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1092,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-muted-foreground",
                                                                    children: "Created Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1093,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1091,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-2xl font-bold",
                                                                    children: formatDate(selectedCompany.updatedAt)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1096,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-muted-foreground",
                                                                    children: "Last Updated"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1097,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1095,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1082,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 1081,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 1018,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 923,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 901,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                        lineNumber: 900,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 612,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dialog, {
                open: isJsonModalOpen,
                onOpenChange: setIsJsonModalOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogContent, {
                    className: "max-w-4xl max-h-[80vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogHeader, {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogTitle, {
                                children: [
                                    "Digitization Data - ",
                                    selectedDocumentForJson === null || selectedDocumentForJson === void 0 ? void 0 : selectedDocumentForJson.originalName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1112,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 1111,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: selectedDocumentForJson && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-muted p-4 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: "text-sm whitespace-pre-wrap overflow-x-auto",
                                    children: JSON.stringify({
                                        id: selectedDocumentForJson.id,
                                        fileName: selectedDocumentForJson.fileName,
                                        originalName: selectedDocumentForJson.originalName,
                                        status: selectedDocumentForJson.status,
                                        uploadDate: selectedDocumentForJson.uploadDate,
                                        processedDate: selectedDocumentForJson.processedDate,
                                        transactionDate: selectedDocumentForJson.transactionDate,
                                        vendor: selectedDocumentForJson.vendor,
                                        abn: selectedDocumentForJson.abn,
                                        totalAmount: selectedDocumentForJson.totalAmount,
                                        gstAmount: selectedDocumentForJson.gstAmount,
                                        description: selectedDocumentForJson.description,
                                        paymentMethod: selectedDocumentForJson.paymentMethod,
                                        transactionStatus: selectedDocumentForJson.transactionStatus,
                                        documentType: selectedDocumentForJson.documentType,
                                        receiptData: selectedDocumentForJson.receiptData
                                    }, null, 2)
                                }, void 0, false, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 1117,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1116,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 1114,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                    lineNumber: 1110,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 1109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dialog, {
                open: isImageModalOpen,
                onOpenChange: setIsImageModalOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogContent, {
                    className: "max-w-4xl max-h-[90vh]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogHeader, {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogTitle, {
                                children: [
                                    "Document Preview - ",
                                    selectedDocumentForImage === null || selectedDocumentForImage === void 0 ? void 0 : selectedDocumentForImage.originalName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1147,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 1146,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center items-center",
                            children: [
                                selectedDocumentForImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "http://localhost:3001/api/files/".concat(selectedDocumentForImage.id, "/view?userId=").concat(user === null || user === void 0 ? void 0 : user.id),
                                    alt: selectedDocumentForImage.originalName,
                                    className: "max-w-full max-h-[70vh] object-contain rounded",
                                    onError: (e)=>{
                                        e.currentTarget.style.display = 'none';
                                        const errorDiv = e.currentTarget.nextElementSibling;
                                        if (errorDiv) errorDiv.style.display = 'flex';
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 1151,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden w-full h-64 flex items-center justify-center bg-muted rounded",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileIcon$3e$__["FileIcon"], {
                                                className: "h-12 w-12 text-muted-foreground mx-auto mb-2"
                                            }, void 0, false, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 1164,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground",
                                                children: "Failed to load image"
                                            }, void 0, false, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 1165,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 1163,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 1162,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 1149,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                    lineNumber: 1145,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 1144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dialog, {
                open: isAbnModalOpen,
                onOpenChange: setIsAbnModalOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogContent, {
                    className: "max-w-4xl max-h-[80vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogHeader, {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogTitle, {
                                children: [
                                    "Vendor Check - ",
                                    (selectedDocumentForAbn === null || selectedDocumentForAbn === void 0 ? void 0 : selectedDocumentForAbn.vendor) || 'Unknown vendor'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1175,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 1174,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: isLoadingAbn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center p-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 1181,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Checking ABN..."
                                        }, void 0, false, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 1182,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 1180,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1179,
                                columnNumber: 15
                            }, this) : abnData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-muted p-4 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold mb-4",
                                            children: "Vendor Information"
                                        }, void 0, false, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 1188,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "ABN:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1191,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: abnData.Abn
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1192,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1190,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Status:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1195,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                variant: abnData.AbnStatus === 'Active' ? 'default' : 'destructive',
                                                                children: abnData.AbnStatus === 'Active' ? 'Active' : 'Inactive'
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1197,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1196,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1194,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Activation Date:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1203,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: abnData.AbnStatusEffectiveFrom || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1204,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1202,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Entity Name:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1207,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: abnData.EntityName || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1208,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1206,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Entity Type:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1211,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: abnData.EntityTypeName || abnData.EntityTypeCode || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1212,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1210,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "ACN:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1215,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: abnData.Acn || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1216,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1214,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "GST Registration:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1219,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: abnData.Gst ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                variant: "default",
                                                                children: [
                                                                    "Registered from ",
                                                                    abnData.Gst
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1222,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                variant: "secondary",
                                                                children: "Not registered"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1224,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1220,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1218,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Address:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1229,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: abnData.AddressState && abnData.AddressPostcode ? "".concat(abnData.AddressState, " ").concat(abnData.AddressPostcode) : '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1230,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1228,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2 border-b",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Address Update Date:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1238,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2",
                                                            children: abnData.AddressDate || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1239,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1237,
                                                    columnNumber: 21
                                                }, this),
                                                abnData.BusinessName && abnData.BusinessName.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4 py-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Business Names:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1243,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "col-span-2",
                                                            children: abnData.BusinessName.map((name, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                    variant: "outline",
                                                                    className: "mr-2 mb-2",
                                                                    children: name
                                                                }, index, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1246,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1244,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1242,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 1189,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 1187,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1186,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center p-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground",
                                    children: "ABN data not loaded"
                                }, void 0, false, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 1258,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1257,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 1177,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                    lineNumber: 1173,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 1172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dialog, {
                open: showXeroAccountsModal,
                onOpenChange: setShowXeroAccountsModal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogContent, {
                    className: "max-w-4xl max-h-[80vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogHeader, {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogTitle, {
                                children: [
                                    "Xero Accounts - ",
                                    xeroTestResult === null || xeroTestResult === void 0 ? void 0 : xeroTestResult.tenantName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1269,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 1268,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: (xeroTestResult === null || xeroTestResult === void 0 ? void 0 : xeroTestResult.accounts) && xeroTestResult.accounts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-muted-foreground",
                                        children: [
                                            "Total accounts: ",
                                            xeroTestResult.accountsCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 1274,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Table, {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHeader, {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableRow, {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Account ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1281,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Code"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1282,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1283,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1284,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Class"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1285,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Status"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1286,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Tax Type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1287,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableHead, {
                                                                children: "Bank Account Type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                lineNumber: 1288,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                        lineNumber: 1280,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1279,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableBody, {
                                                    children: xeroTestResult.accounts.map((account, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableRow, {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    className: "font-mono text-xs",
                                                                    children: account.accountID || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1294,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    className: "font-medium",
                                                                    children: account.code || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1297,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: account.name || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1300,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                        variant: "outline",
                                                                        children: account.type || 'N/A'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1302,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1301,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: account._class || account.class || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1306,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                        variant: account.status === 'ACTIVE' ? 'default' : 'secondary',
                                                                        children: account.status || 'N/A'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                        lineNumber: 1310,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1309,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: account.taxType || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1316,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableCell, {
                                                                    children: account.bankAccountType || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                                    lineNumber: 1317,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, account.accountID || index, true, {
                                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                            lineNumber: 1293,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                    lineNumber: 1291,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                            lineNumber: 1278,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 1277,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Sample JSON Structure:"
                                            }, void 0, false, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 1324,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                className: "mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto",
                                                children: JSON.stringify(xeroTestResult.accounts[0], null, 2)
                                            }, void 0, false, {
                                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                                lineNumber: 1325,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                        lineNumber: 1323,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1273,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center p-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground",
                                    children: "No accounts data available"
                                }, void 0, false, {
                                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                    lineNumber: 1332,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                                lineNumber: 1331,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/backend/src/app/dashboard/page.tsx",
                            lineNumber: 1271,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/backend/src/app/dashboard/page.tsx",
                    lineNumber: 1267,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 1266,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Toaster, {}, void 0, false, {
                fileName: "[project]/backend/src/app/dashboard/page.tsx",
                lineNumber: 1341,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/backend/src/app/dashboard/page.tsx",
        lineNumber: 548,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "7UBT+QEGXs5FnmIiDfWV/lbL+H8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        useToast
    ];
});
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=backend_src_app_dashboard_page_tsx_e8260246._.js.map