'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import * as XLSX from 'xlsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Building, 
  Users,
  TrendingUp,
  Download,
  ImageIcon,
  FileIcon,
  Eye,
  Trash2,
  Upload,
  Edit,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUp,
  X,
  Search,
  Link,
  Unlink,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Plus,
  LogOut,
  User,
  Loader2
} from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import UserMenu from '@/components/UserMenu'
import { useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Component for truncated text with tooltip
function TruncatedCell({ text, maxWidth = '150px' }: { text: string; maxWidth?: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="truncate cursor-help" 
            style={{ maxWidth }}
          >
            {text}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs break-words">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface UserData {
  id: string
  email: string
  name: string
  userType: 'INDIVIDUAL' | 'BUSINESS'
  phone?: string
  address?: string
  company?: string
  services?: string
  isVisibleToClients: boolean
  acceptsJobOffers: boolean
  isActive: boolean
  createdAt: string
}

interface Company {
  id: string
  name: string
  description?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  abn?: string
  industry?: string
  isActive: boolean
  documentsCount: number
  createdAt: string
  updatedAt: string
  xeroTenantId?: string
  xeroTenantName?: string
  xeroBankAccountId?: string
  xeroBankAccountName?: string
}

interface DocumentData {
  id: string
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  filePath?: string
  status: 'QUEUE' | 'PROCESSING' | 'DIGITIZED' | 'ERROR' | 'DELETED'
  uploadDate: string
  processedDate?: string
  transactionDate?: string
  vendor?: string
  abn?: string
  totalAmount?: number
  gstAmount?: number
  description?: string
  paymentMethod?: string
  transactionStatus?: string
  documentType?: string
  receiptData?: any
  user?: {
    id: string
    name: string
    email: string
  }
  company?: {
    id: string
    name: string
  }
}

interface DigitizedData {
  id: string
  originalDocumentId: string
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  filePath?: string
  purchaseDate?: string
  vendorName?: string
  vendorAbn?: string
  vendorAddress?: string
  documentType?: string
  receiptNumber?: string
  paymentType?: string
  cashOutAmount?: number
  discountAmount?: number
  amountExclTax?: number
  totalAmount?: number
  totalPaidAmount?: number
  surchargeAmount?: number
  taxAmount?: number
  expenseCategory?: string
  taxStatus?: string
  extractedData?: any
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
  }
  company?: {
    id: string
    name: string
  }
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const formatAbn2Input = (digits: string) => {
    const d = digits.replace(/[^\d]/g, '').slice(0, 11)
    const a = d.slice(0, 2)
    const b = d.slice(2, 5)
    const c = d.slice(5, 8)
    const e = d.slice(8, 11)
    return [a, b, c, e].filter(Boolean).join(' ')
  }
  const getCurrentQuarterRange = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    const qStartMonth = Math.floor(m / 3) * 3
    const start = new Date(y, qStartMonth, 1)
    const end = new Date(y, qStartMonth + 3, 0)
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
    const startStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`
    const endStr = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`
    return { startStr, endStr }
  }
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [digitizedDocuments, setDigitizedDocuments] = useState<DigitizedData[]>([])
  const [reviewDocuments, setReviewDocuments] = useState<DigitizedData[]>([])
  const [readyDocuments, setReadyDocuments] = useState<DigitizedData[]>([])
  const [readyVisibleCount, setReadyVisibleCount] = useState(0)
  const [dateRangeStart, setDateRangeStart] = useState<string>(() => getCurrentQuarterRange().startStr)
  const [dateRangeEnd, setDateRangeEnd] = useState<string>(() => getCurrentQuarterRange().endStr)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [vendorInfo, setVendorInfo] = useState<Record<string, { status: string; name: string; gst?: string }>>({})
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [editedCompany, setEditedCompany] = useState<Company | null>(null)
  const [previousDigitizedCount, setPreviousDigitizedCount] = useState(0)
  const [selectedDocumentForJson, setSelectedDocumentForJson] = useState<DocumentData | null>(null)
  const [selectedDocumentForImage, setSelectedDocumentForImage] = useState<DocumentData | null>(null)
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedDocumentForAbn, setSelectedDocumentForAbn] = useState<DocumentData | null>(null)
  const [isAbnModalOpen, setIsAbnModalOpen] = useState(false)
  const [abnData, setAbnData] = useState<any>(null)
  const [isLoadingAbn, setIsLoadingAbn] = useState(false)
  const [digitizingDocuments, setDigitizingDocuments] = useState<Set<string>>(new Set())
  const [isBulkDigitizing, setIsBulkDigitizing] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [bulkDigitizeStart, setBulkDigitizeStart] = useState<number | null>(null)
  const [bulkDigitizeElapsed, setBulkDigitizeElapsed] = useState(0)
  const [bulkDigitizeProcessed, setBulkDigitizeProcessed] = useState(0)
  const [bulkDigitizeTotal, setBulkDigitizeTotal] = useState(0)
  const [bulkDigitizeSuccess, setBulkDigitizeSuccess] = useState(0)
  const [bulkDigitizeError, setBulkDigitizeError] = useState(0)
  
  // Xero integration state
  const [xeroStatus, setXeroStatus] = useState<{
    connected: boolean
    tenantName?: string
    tenantId?: string
    tokenExpiry?: string
  }>({ connected: false })
  const [isLoadingXero, setIsLoadingXero] = useState(false)
  const [xeroTestResult, setXeroTestResult] = useState<any>(null)
  const [isTestingXero, setIsTestingXero] = useState(false)
  const [showXeroAccountsModal, setShowXeroAccountsModal] = useState(false)
  const [xeroAccounts, setXeroAccounts] = useState<any[]>([])
  const [xeroOrganisations, setXeroOrganisations] = useState<{ tenantId: string; tenantName: string }[]>([])
  const [xeroExportMode, setXeroExportMode] = useState<'bill' | 'spend'>('bill')
  const [xeroBankAccounts, setXeroBankAccounts] = useState<{ accountID: string; code?: string; name?: string }[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState<any[]>([])
  const [reportedDocuments, setReportedDocuments] = useState<any[]>([])
  const [exportFilterFile, setExportFilterFile] = useState('')
  const [exportFilterFrom, setExportFilterFrom] = useState('')
  const [exportFilterTo, setExportFilterTo] = useState('')
  const [exportHistoryVisibleCount, setExportHistoryVisibleCount] = useState(0)
  const [exportHistoryStats, setExportHistoryStats] = useState<{ total: number; success: number; failed: number; rowsExported: number }>({ total: 0, success: 0, failed: 0, rowsExported: 0 })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] = useState<DigitizedData | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  
  // Company management states
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false)
  const [newCompanyData, setNewCompanyData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    abn: '',
    industry: ''
  })
  const [isCreatingCompany, setIsCreatingCompany] = useState(false)
  
  // File upload states
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  
  // Image zoom states
  const [imageZoom, setImageZoom] = useState(1)
  
  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const [isDeleteDigitizedModalOpen, setIsDeleteDigitizedModalOpen] = useState(false)
  const [digitizedDocumentToDelete, setDigitizedDocumentToDelete] = useState<string | null>(null)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isBulkDigitizing && bulkDigitizeStart) {
      const interval = setInterval(() => {
        setBulkDigitizeElapsed(Math.floor((Date.now() - bulkDigitizeStart) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setBulkDigitizeElapsed(0)
    }
  }, [isBulkDigitizing, bulkDigitizeStart])

  const formatMMSS = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const ss = (s % 60).toString().padStart(2, '0')
    return `${m}:${ss}`
  }

  // Restore last progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bulkDigitizeProgress')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.status === 'active' && data.start) {
          setIsBulkDigitizing(true)
          setBulkDigitizeStart(data.start)
          setBulkDigitizeTotal(data.total || 0)
          setBulkDigitizeProcessed(data.processed || 0)
          setBulkDigitizeSuccess(data.success || 0)
          setBulkDigitizeError(data.error || 0)
        } else if (data.status === 'completed') {
          setIsBulkDigitizing(false)
          setBulkDigitizeStart(null)
          setBulkDigitizeTotal(data.total || 0)
          setBulkDigitizeProcessed(data.processed || 0)
          setBulkDigitizeSuccess(data.success || 0)
          setBulkDigitizeError(data.error || 0)
        }
      }
    } catch {}
  }, [])


  const loadCompanies = useCallback(async (userData: UserData) => {
    try {
      const response = await fetch(`/api/companies?userId=${userData.id}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const companiesData = await response.json()
        console.log('Companies API response:', companiesData)
        if (companiesData.success && companiesData.companies) {
          setCompanies(companiesData.companies)
        } else {
          console.error('Invalid companies data format:', companiesData)
          setCompanies([])
        }
      } else {
        console.error('Failed to load companies')
        setCompanies([])
      }
    } catch (error) {
      console.error('Error loading companies:', error)
    }
  }, [])

  const loadDashboardData = useCallback(async (userData: UserData) => {
    try {
      await loadCompanies(userData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [loadCompanies])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth')
      return
    }
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadDashboardData(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/auth')
    }
  }, [router, loadDashboardData])

  // Handle company parameter from URL and auto-refresh data
  const loadCompanyDocuments = useCallback(async (companyId: string) => {
    if (!user?.id || !companyId) {
      console.log('Missing user ID or company ID for loading documents')
      return
    }
    console.log('Loading documents for company:', companyId, 'user:', user.id)
    try {
      const response = await fetch(`/api/companies/${companyId}/files?userId=${user.id}`, {
        credentials: 'include'
      })
      console.log('Documents API response status:', response.status)
      if (response.ok) {
        const documentsResponse = await response.json()
        console.log('Documents API response:', documentsResponse)
        const documentsData = documentsResponse.success && documentsResponse.documents ? documentsResponse.documents : []
        const newDigitizedCount = documentsData.filter((doc: DocumentData) => doc.status === 'DIGITIZED').length
        if (previousDigitizedCount > 0 && newDigitizedCount > previousDigitizedCount) {
          const newlyDigitized = newDigitizedCount - previousDigitizedCount
          toast({
            title: 'Digitization completed!',
            description: `${newlyDigitized} ${newlyDigitized === 1 ? 'document digitized' : 'documents digitized'}. Table updated.`,
          })
        }
        setDocuments(documentsData)
        setPreviousDigitizedCount(newDigitizedCount)
      } else {
        const errorData = await response.text()
        console.error('Failed to load company documents:', response.status, errorData)
        toast({
          title: 'Error',
          description: `Failed to load company documents (${response.status}). Please try again.`,
          variant: 'destructive',
        })
        setDocuments([])
      }
    } catch (error) {
      console.error('Error loading company documents:', error)
      toast({
        title: 'Error',
        description: 'Network error loading company documents. Please check your connection.',
        variant: 'destructive',
      })
      setDocuments([])
    }
  }, [user?.id, previousDigitizedCount, toast])

  const loadDigitizedDocuments = useCallback(async (companyId: string) => {
    if (!user?.id || !companyId) {
      console.log('Missing user ID or company ID for loading digitized documents')
      return
    }
    try {
      const response = await fetch(`/api/digitized?userId=${user.id}&companyId=${companyId}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const digitizedResponse = await response.json()
        console.log('Digitized documents API response:', digitizedResponse)
        const digitizedData = digitizedResponse.success && digitizedResponse.digitized ? digitizedResponse.digitized : []
        setDigitizedDocuments(digitizedData)
      } else {
        console.error('Failed to load digitized documents')
        setDigitizedDocuments([])
      }
    } catch (error) {
      console.error('Error loading digitized documents:', error)
      setDigitizedDocuments([])
    }
  }, [user?.id])

  const loadReviewDocuments = useCallback(async (companyId: string) => {
    if (!user?.id || !companyId) {
      return
    }
    try {
      const response = await fetch(`/api/review?userId=${user.id}&companyId=${companyId}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const reviewResponse = await response.json()
        const reviewData = reviewResponse.success && reviewResponse.review ? reviewResponse.review : []
        setReviewDocuments(reviewData)
      } else {
        setReviewDocuments([])
      }
    } catch {
      setReviewDocuments([])
    }
  }, [user?.id])

  const loadReadyDocuments = useCallback(async (companyId: string) => {
    if (!user?.id || !companyId) return
    try {
      const response = await fetch(`/api/ready?userId=${user.id}&companyId=${companyId}`, { credentials: 'include' })
      if (response.ok) {
        const res = await response.json()
        setReadyDocuments(res.success ? res.ready ?? [] : [])
      } else setReadyDocuments([])
    } catch { setReadyDocuments([]) }
  }, [user?.id])

  const handleCompanyChange = useCallback(async (company: Company) => {
    try {
      if (selectedCompany?.id === company.id) return
      try {
        if (user?.id) {
          const r = await fetch(`/api/billing/status?userId=${user.id}`, { credentials: 'include' })
          const data = await r.json()
          if (data?.locked) {
            toast({ title: 'Billing overdue', description: 'Please pay your invoice to switch companies', variant: 'destructive' })
            return
          }
        }
      } catch {}
      setSelectedCompany(company)
      try {
        const url = new URL(window.location.href)
        url.searchParams.set('company', String(company.id))
        window.history.replaceState(null, '', url.toString())
      } catch {}
      try { localStorage.setItem('lastCompanyId', String(company.id)) } catch {}
      await Promise.all([
        loadCompanyDocuments(company.id),
        loadDigitizedDocuments(company.id),
        loadReviewDocuments(company.id),
        loadReadyDocuments(company.id)
      ])
    } catch (error) {
      console.error('Error changing company:', error)
    }
  }, [selectedCompany?.id, user?.id, toast, loadCompanyDocuments, loadDigitizedDocuments, loadReviewDocuments, loadReadyDocuments])

  useEffect(() => {
    if (selectedCompany) return
    const companyId = searchParams.get('company')
    const lastCompanyId = (() => { try { return localStorage.getItem('lastCompanyId') || '' } catch { return '' } })()
    if (companies.length === 0) return
    if (companyId) {
      const company = companies.find(c => String(c.id) === companyId)
      if (company) {
        setSelectedCompany(company)
        Promise.all([
          loadCompanyDocuments(company.id),
          loadDigitizedDocuments(company.id),
          loadReviewDocuments(company.id),
          loadReadyDocuments(company.id)
        ])
      }
    } else if (lastCompanyId) {
      const company = companies.find(c => String(c.id) === lastCompanyId) || companies[0]
      setSelectedCompany(company)
      Promise.all([
        loadCompanyDocuments(company.id),
        loadDigitizedDocuments(company.id),
        loadReviewDocuments(company.id),
        loadReadyDocuments(company.id)
      ])
    } else {
      const company = companies[0]
      setSelectedCompany(company)
      Promise.all([
        loadCompanyDocuments(company.id),
        loadDigitizedDocuments(company.id),
        loadReviewDocuments(company.id),
        loadReadyDocuments(company.id)
      ])
    }
  }, [searchParams, companies, selectedCompany, loadCompanyDocuments, loadDigitizedDocuments, loadReviewDocuments, loadReadyDocuments])

  

  useEffect(() => {
    const onPopstate = () => {
      try {
        const url = new URL(window.location.href)
        const companyId = url.searchParams.get('company')
        if (!companyId || companies.length === 0) return
        if (selectedCompany?.id && String(selectedCompany.id) === companyId) return
        const company = companies.find(c => String(c.id) === companyId)
        if (company) handleCompanyChange(company)
      } catch {}
    }
    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  }, [companies, selectedCompany?.id, handleCompanyChange])


  // Auto-refresh documents every 5 seconds to track digitization status
  useEffect(() => {
    if (!selectedCompany?.id) return
    const interval = setInterval(() => {
      const processingDocs = documents.filter(doc => doc.status === 'PROCESSING')
      if (processingDocs.length > 0) {
        loadCompanyDocuments(selectedCompany.id)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [selectedCompany?.id, documents, loadCompanyDocuments])

  // Auto-refresh dashboard data every 30 seconds
  useEffect(() => {
    if (!user?.id) return
    const interval = setInterval(() => {
      if (user) {
        loadCompanies(user)
      }
      if (selectedCompany?.id) {
        loadCompanyDocuments(selectedCompany.id)
        loadDigitizedDocuments(selectedCompany.id)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [user, selectedCompany?.id, loadCompanies, loadCompanyDocuments, loadDigitizedDocuments])

  

  

  

  

  const handleBulkDeleteSelected = async (rows: any[]) => {
    if (!selectedCompany?.id || !user?.id) {
      toast({ title: 'Error', description: 'Please select a company and sign in', variant: 'destructive' })
      return
    }
    try {
      const ids = rows.map((r) => r.original.id).filter(Boolean)
      const results = await Promise.all(ids.map(async (id) => {
        const resp = await fetch(`/api/digitized?id=${id}&userId=${user.id}` , { method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
        return resp.ok
      }))
      const successCount = results.filter(Boolean).length
      await loadDigitizedDocuments(selectedCompany.id)
      await loadReviewDocuments(selectedCompany.id)
      toast({ title: 'Completed', description: `${successCount}/${ids.length} document(s) moved to review` })
    } catch (e) {
      console.error('Bulk delete failed', e)
      toast({ title: 'Delete failed', description: 'Failed to move selected documents', variant: 'destructive' })
    }
  }

  const validateReceipt = (data: any) => {
    const errors: string[] = []
    const TOLERANCE = 0.02

    const totalPaid = typeof data.totalPaidAmount === 'number' ? data.totalPaidAmount : 0
    const cashOut = typeof data.cashOutAmount === 'number' ? data.cashOutAmount : 0
    const surcharge = typeof data.surchargeAmount === 'number' ? data.surchargeAmount : 0
    const totalAmt = typeof data.totalAmount === 'number' ? data.totalAmount : 0
    const tax = typeof data.taxAmount === 'number' ? data.taxAmount : 0

    // 1. Payment Check
    const calculatedTotal = totalPaid - cashOut
    if (Math.abs(calculatedTotal - totalAmt) > TOLERANCE) {
      errors.push('Error 1: The payment amount does not match the receipt total (Paid - CashOut ≠ Total)')
    }

    // 2. GST Plausibility
    const maxPossibleTax = totalAmt / 11
    if (tax > (maxPossibleTax + TOLERANCE)) {
      errors.push('Error 2: GST is too high for this amount (Tax > Total / 11)')
    }

    // 3. Net Amount Consistency
    const calculatedNetAmount = totalAmt - tax
    if (calculatedNetAmount < 0) {
      errors.push('Error 3: The tax exceeds the total amount (Total - Tax < 0)')
    }

    return errors
  }

  const validateSelected = async (rows: any[]) => {
    const toNumber = (v: any) => typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : 0
    const errs: Record<string, string[]> = {}
    const validIds: string[] = []
    rows.forEach((row: any) => {
      const payload = {
        id: row.original.id,
        taxAmount: toNumber(row.getValue('taxAmount')),
        totalAmount: toNumber(row.getValue('totalAmount')),
        totalPaidAmount: toNumber(row.getValue('totalPaidAmount')),
        cashOutAmount: toNumber(row.getValue('cashOutAmount')),
        surchargeAmount: toNumber(row.getValue('surchargeAmount')),
      }
      console.log('Validate payload:', payload)
      const e = validateReceipt(payload)
      const abn = row.original.vendorAbn || ''
      const gst = vendorInfo[abn]?.gst
      const TOLERANCE = 0.02
      if (!gst && payload.taxAmount > TOLERANCE) {
        e.push(`${row.original.vendorName} The selected record has a tax applied, but the company is not a GST payer.`)
      }
      if (e.length > 0) errs[payload.id] = e
      else validIds.push(payload.id)
    })
    if (Object.keys(errs).length > 0) {
      console.group('Validation errors')
      Object.entries(errs).forEach(([id, messages]) => {
        console.log(`Row ${id}:`) 
        messages.forEach((m) => console.log(' -', m))
      })
      console.groupEnd()
    }
    setValidationErrors(errs)
    if (Object.keys(errs).length > 0) {
      const entries = Object.entries(errs)
      toast({
        title: 'Validate',
        description: (
          <div>
            <div>{`Errors in ${entries.length} rows`}</div>
            <ul className="mt-2 list-disc pl-4">
              {entries.slice(0, 10).map(([id, messages]) => (
                <li key={id}>
                  <span className="font-medium"></span> {messages.join('; ')}
                </li>
              ))}
            </ul>
          </div>
        ),
        variant: 'destructive'
      })
    }
    if (validIds.length > 0 && selectedCompany && user) {
      await Promise.all(validIds.map(async (id) => {
        await fetch('/api/ready', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, userId: user.id }) })
      }))
      await Promise.all([
        loadReadyDocuments(selectedCompany.id),
        loadDigitizedDocuments(selectedCompany.id),
      ])
      toast({ title: 'Validate', description: `${validIds.length} moved to Ready for Report` })
    }
  }

  const openEditModal = (doc: DigitizedData) => {
    const imageId = doc.originalDocumentId || (doc as any).id
    setSelectedDocumentForEdit({ ...doc, originalDocumentId: imageId })
    const toDateInput = (v: any) => {
      if (!v) return ''
      const d = typeof v === 'string' ? new Date(v) : v
      if (!d || isNaN(d.getTime())) return ''
      return d.toISOString().slice(0, 10)
    }
    setEditForm({
      purchaseDate: toDateInput(doc.purchaseDate),
      vendorName: doc.vendorName || '',
      vendorAbn: doc.vendorAbn || '',
      vendorAddress: doc.vendorAddress || '',
      documentType: doc.documentType || '',
      receiptNumber: doc.receiptNumber || '',
      paymentType: doc.paymentType || '',
      cashOutAmount: typeof doc.cashOutAmount === 'number' ? doc.cashOutAmount : 0,
      discountAmount: typeof doc.discountAmount === 'number' ? doc.discountAmount : 0,
      surchargeAmount: typeof doc.surchargeAmount === 'number' ? doc.surchargeAmount : 0,
      taxAmount: typeof doc.taxAmount === 'number' ? doc.taxAmount : 0,
      amountExclTax: typeof doc.amountExclTax === 'number' ? doc.amountExclTax : 0,
      totalAmount: typeof doc.totalAmount === 'number' ? doc.totalAmount : 0,
      totalPaidAmount: typeof doc.totalPaidAmount === 'number' ? doc.totalPaidAmount : 0,
      expenseCategory: doc.expenseCategory || '',
      taxStatus: doc.taxStatus || ''
    })
    setEditErrors({})
    setIsEditModalOpen(true)
  }

  const validateEditForm = (form: any) => {
    const errs: Record<string, string> = {}
    const toNumber = (v: any) => typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : 0
    const T = 0.02
    if (!form.purchaseDate) errs.purchaseDate = 'Date is required'
    const tax = toNumber(form.taxAmount)
    const total = toNumber(form.totalAmount)
    const paid = toNumber(form.totalPaidAmount)
    const cashOut = toNumber(form.cashOutAmount)
    if (Number.isNaN(tax) || tax < 0) errs.taxAmount = 'Invalid tax amount'
    if (Number.isNaN(total) || total < 0) errs.totalAmount = 'Invalid total amount'
    if (Number.isNaN(paid) || paid < 0) errs.totalPaidAmount = 'Invalid paid amount'
    if (Number.isNaN(cashOut) || cashOut < 0) errs.cashOutAmount = 'Invalid cash out'
    if (form.vendorAbn && !/^\d{11}$/.test(form.vendorAbn)) errs.vendorAbn = 'ABN must be 11 digits'
    if (Math.abs((paid - cashOut) - total) > T) errs.totalAmount = 'Paid minus Cash Out must equal Total'
    if (tax > (total / 11 + T)) errs.taxAmount = 'GST exceeds Total/11'
    if ((total - tax) < 0) errs.taxAmount = 'Tax exceeds Total'

    const abn = form.vendorAbn
    if (abn && /^\d{11}$/.test(abn)) {
      const info = vendorInfo[abn]
      if (info) {
        if (info.status && info.status !== 'Active') {
          errs.vendorAbn = 'Vendor ABN is not Active'
        }
        if (!info.gst && tax > 0.02) {
          errs.taxAmount = 'Vendor not GST registered; taxAmount must be 0'
        }
      }
    }
    return errs
  }

  const fetchVendorInfoForAbn = async (abn: string) => {
    try {
      if (!/^\d{11}$/.test(abn)) return
      if (!vendorInfo[abn]) {
        const r = await fetch(`/api/vendors?abn=${abn}`, { credentials: 'include' })
        if (r.ok) {
          const data = await r.json()
          const name = data.EntityName || (Array.isArray(data.BusinessName) ? (data.BusinessName[0] || '') : '')
          setVendorInfo(prev => ({ ...prev, [abn]: { status: data.AbnStatus || '', name, gst: data.Gst || '' } }))
          const addr = [data.AddressState || '', data.AddressPostcode || ''].join(' ').trim()
          setEditForm((prev: any) => prev ? { 
            ...prev, 
            vendorName: prev.vendorName || name,
            vendorAddress: prev.vendorAddress || addr
          } : prev)
        }
      }
    } catch {}
  }

  const handleEditSave = async () => {
    if (!editForm || !selectedDocumentForEdit) return
    try {
      const abn = editForm.vendorAbn
      if (abn) await fetchVendorInfoForAbn(abn)
    } catch {}
    const errs = validateEditForm(editForm)
    setEditErrors(errs)
    if (Object.keys(errs).length > 0) {
      const entries = Object.entries(errs)
      toast({
        title: 'Edit Source Document',
        description: (
          <div>
            <div>{`Validation errors: ${entries.length}`}</div>
            <ul className="mt-2 list-disc pl-4">
              {entries.map(([field, message]) => (
                <li key={field}>
                  <span className="font-medium">{field}:</span> {message}
                </li>
              ))}
            </ul>
          </div>
        ),
        variant: 'destructive'
      })
      return
    }
    try {
      if (!user?.id) {
        toast({ title: 'Not signed in', description: 'Please sign in to save changes.', variant: 'destructive' })
        return
      }
      const res = await fetch(`/api/digitized?id=${selectedDocumentForEdit.id}&userId=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (!res.ok) {
        const text = await res.text()
        toast({ title: 'Save Failed', description: text || 'Failed to update document', variant: 'destructive' })
        return
      }
      toast({ title: 'Edit Document', description: 'Changes saved successfully' })
      if (selectedCompany?.id) {
        await loadDigitizedDocuments(selectedCompany.id)
      }
      setIsEditModalOpen(false)
      setSelectedDocumentForEdit(null)
      setEditForm(null)
      setEditErrors({})
    } catch (e: any) {
      toast({ title: 'Save Error', description: e?.message || 'Unexpected error', variant: 'destructive' })
    }
  }

  const handleEditCancel = () => {
    setIsEditModalOpen(false)
    setSelectedDocumentForEdit(null)
    setEditForm(null)
    setEditErrors({})
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
    setIsDragging(false)
  }

  const formatTimestamp = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const yyyy = d.getFullYear()
    const mm = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    const HH = pad(d.getHours())
    const MM = pad(d.getMinutes())
    const SS = pad(d.getSeconds())
    return `${yyyy}${mm}${dd}_${HH}${MM}${SS}`
  }

  const sanitizeFileComponent = (s: string) => s.replace(/[^a-zA-Z0-9_-]+/g, '_')

  const exportReadyRowsToExcel = async (rows: any[]) => {
    if (!rows.length) return
    const items = rows.map((r) => r.original)
    const errsAll: Record<string, string[]> = {}
    items.forEach((doc: any) => {
      const payload = {
        id: doc.id,
        taxAmount: typeof doc.taxAmount === 'number' ? doc.taxAmount : 0,
        totalAmount: typeof doc.totalAmount === 'number' ? doc.totalAmount : 0,
        totalPaidAmount: typeof doc.totalPaidAmount === 'number' ? doc.totalPaidAmount : 0,
        cashOutAmount: typeof doc.cashOutAmount === 'number' ? doc.cashOutAmount : 0,
        surchargeAmount: typeof doc.surchargeAmount === 'number' ? doc.surchargeAmount : 0,
      }
      const e = validateReceipt(payload)
      const abn = doc.vendorAbn || ''
      const gst = vendorInfo[abn]?.gst
      const T = 0.02
      if (!gst && payload.taxAmount > T) e.push('Present GST amount but company Not registrad GST')
      if (e.length > 0) errsAll[payload.id] = e
    })
    if (Object.keys(errsAll).length > 0) {
      setValidationErrors(errsAll)
      toast({ title: 'Export validation', description: 'Fix validation errors before export', variant: 'destructive' })
      return
    }
    try {
      setIsExporting(true)
      const now = new Date()
      const companyPart = sanitizeFileComponent(selectedCompany?.name || 'company')
      const fileName = `report_${companyPart}_${formatTimestamp(now)}.xlsx`
      const data = items.map((d: any) => ({
        purchaseDate: d.purchaseDate || '',
        vendorName: d.vendorName || '',
        vendorAbn: d.vendorAbn || '',
        vendorAddress: d.vendorAddress || '',
        documentType: d.documentType || '',
        receiptNumber: d.receiptNumber || '',
        paymentType: d.paymentType || '',
        cashOutAmount: typeof d.cashOutAmount === 'number' ? d.cashOutAmount : 0,
        discountAmount: typeof d.discountAmount === 'number' ? d.discountAmount : 0,
        surchargeAmount: typeof d.surchargeAmount === 'number' ? d.surchargeAmount : 0,
        amountExclTax: typeof d.amountExclTax === 'number' ? d.amountExclTax : 0,
        taxAmount: typeof d.taxAmount === 'number' ? d.taxAmount : 0,
        totalAmount: typeof d.totalAmount === 'number' ? d.totalAmount : 0,
        totalPaidAmount: typeof d.totalPaidAmount === 'number' ? d.totalPaidAmount : 0,
        expenseCategory: d.expenseCategory || '',
        taxStatus: d.taxStatus || '',
        originalName: d.originalName || '',
        fileName: d.fileName || '',
      }))
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Report')
      XLSX.writeFile(wb, fileName)
      const ids = items.map((d: any) => d.id)
      if (user?.id && selectedCompany?.id) {
        const res = await fetch('/api/reported', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, userId: user.id, companyId: selectedCompany.id, fileName, exportedAt: now.toISOString(), status: 'SUCCESS' })
        })
        if (!res.ok) {
          toast({ title: 'Move to reported failed', description: 'Server error', variant: 'destructive' })
        } else {
          await loadReadyDocuments(selectedCompany.id)
          await loadExportHistory(selectedCompany.id)
          toast({ title: 'Export', description: `Exported ${items.length} rows` })
        }
      }
    } catch (e: any) {
      toast({ title: 'Export error', description: e?.message || 'Unexpected error', variant: 'destructive' })
    } finally {
      setIsExporting(false)
    }
  }

  const loadExportHistory = useCallback(async (companyId: string) => {
    if (!user?.id) return
    try {
      const r = await fetch(`/api/export-history?companyId=${companyId}&userId=${user.id}`)
      if (r.ok) {
        const j = await r.json()
        setExportHistory(j.history || [])
        if (j.stats) {
          setExportHistoryStats(j.stats)
        } else {
          const hist = j.history || []
          setExportHistoryStats({
            total: hist.length,
            success: hist.filter((i: any) => i.status === 'SUCCESS').length,
            failed: hist.filter((i: any) => i.status !== 'SUCCESS').length,
            rowsExported: hist.reduce((acc: number, i: any) => acc + (i.totalRows || 0), 0),
          })
        }
      }
    } catch {}
  }, [user?.id])

  const fetchExportHistory = async () => {
    if (!selectedCompany?.id || !user?.id) return
    const params = new URLSearchParams({ companyId: selectedCompany.id, userId: user.id })
    if (exportFilterFile) params.set('file', exportFilterFile)
    if (exportFilterFrom) params.set('from', exportFilterFrom)
    if (exportFilterTo) params.set('to', exportFilterTo)
    try {
      const r = await fetch(`/api/export-history?${params.toString()}`)
      if (r.ok) {
        const j = await r.json()
        setExportHistory(j.history || [])
        if (j.stats) {
          setExportHistoryStats(j.stats)
        } else {
          const hist = j.history || []
          setExportHistoryStats({
            total: hist.length,
            success: hist.filter((i: any) => i.status === 'SUCCESS').length,
            failed: hist.filter((i: any) => i.status !== 'SUCCESS').length,
            rowsExported: hist.reduce((acc: number, i: any) => acc + (i.totalRows || 0), 0),
          })
        }
      }
    } catch {}
  }

  const downloadExportFile = (fileName: string) => {
    if (!selectedCompany?.id || !user?.id) return
    const url = `/api/export-files/${selectedCompany.id}/${encodeURIComponent(fileName)}?userId=${user.id}`
    window.open(url, '_blank')
  }

  useEffect(() => {
    if (selectedCompany?.id) loadExportHistory(selectedCompany.id)
  }, [selectedCompany?.id, loadExportHistory])

  useEffect(() => {
    const abns = new Set<string>()
    digitizedDocuments.forEach(d => { if (d.vendorAbn) abns.add(d.vendorAbn) })
    reviewDocuments.forEach(d => { if (d.vendorAbn) abns.add(d.vendorAbn) })
    readyDocuments.forEach(d => { if (d.vendorAbn) abns.add(d.vendorAbn) })
    const toFetch = Array.from(abns).filter(a => /^\d{11}$/.test(a) && !vendorInfo[a])
    if (toFetch.length === 0) return
    Promise.all(toFetch.map(async (abn) => {
      try {
        const r = await fetch(`/api/vendors?abn=${abn}`, { credentials: 'include' })
        if (!r.ok) return
        const data = await r.json()
        const name = data.EntityName || (Array.isArray(data.BusinessName) ? (data.BusinessName[0] || '') : '')
        setVendorInfo(prev => ({ ...prev, [abn]: { status: data.AbnStatus || '', name, gst: data.Gst || '' } }))
      } catch {}
    }))
  }, [digitizedDocuments, reviewDocuments, readyDocuments, vendorInfo])

  const handleCompanyUpdate = async () => {
    if (!editedCompany || !user?.id) return

    try {
      const response = await fetch(`/api/companies/${editedCompany.id}?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editedCompany.name,
          description: editedCompany.description,
          email: editedCompany.email,
          phone: editedCompany.phone,
          address: editedCompany.address,
          website: editedCompany.website,
          abn: editedCompany.abn,
          industry: editedCompany.industry,
        }),
      })

      if (response.ok) {
        const updatedCompany = await response.json()
        setSelectedCompany(updatedCompany)
        setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c))
        setIsEditingCompany(false)
        setEditedCompany(null)
      } else {
        console.error('Failed to update company')
      }
    } catch (error) {
      console.error('Error updating company:', error)
    }
  }

  // Company management functions from sidebar
  const handleCompanySelect = (company: Company) => {
    // Use the optimized company change handler
    handleCompanyChange(company)
  }

  const handleAddCompany = () => {
    setIsAddCompanyModalOpen(true)
  }

  const formatAbnInput = (digits: string) => {
    const d = digits.replace(/[^\d]/g, '').slice(0, 11)
    const a = d.slice(0, 2)
    const b = d.slice(2, 5)
    const c = d.slice(5, 8)
    const e = d.slice(8, 11)
    return [a, b, c, e].filter(Boolean).join(' ')
  }

  const handleCompanyPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/[^\d]/g, '')
    if (digits.startsWith('61')) digits = digits.slice(2)
    if (digits.startsWith('0')) digits = digits.slice(1)
    let formatted = '+61'
    if (digits.length > 0) {
      formatted += ' '
      const first = digits[0]
      if (first === '4') {
        const a = digits.slice(0, 1)
        const b = digits.slice(1, 4)
        const c = digits.slice(4, 7)
        const d = digits.slice(7, 10)
        formatted += a + (b ? ' ' + b : '') + (c ? ' ' + c : '') + (d ? ' ' + d : '')
      } else {
        const a = digits.slice(0, 1)
        const b = digits.slice(1, 5)
        const c = digits.slice(5, 9)
        formatted += a + (b ? ' ' + b : '') + (c ? ' ' + c : '')
      }
    }
    setNewCompanyData({ ...newCompanyData, phone: formatted.trim() })
  }

  const handleCompanyAbnBlur = async (abn: string) => {
    const clean = abn.replace(/[^\d]/g, '')
    if (!/^\d{11}$/.test(clean)) return
    try {
      const r = await fetch(`/api/vendors?abn=${clean}`, { credentials: 'include' })
      if (!r.ok) return
      const data = await r.json()
      const name = data.EntityName || (Array.isArray(data.BusinessName) ? (data.BusinessName[0] || '') : '')
      const addr = [data.AddressState || '', data.AddressPostcode || ''].join(' ').trim()
      setNewCompanyData(prev => ({
        ...prev,
        name: prev.name || name,
        address: prev.address || addr,
        abn: formatAbnInput(clean)
      }))
    } catch {}
  }

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompanyData.name.trim() || !user?.id) return

    setIsCreatingCompany(true)
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newCompanyData,
          abn: newCompanyData.abn.replace(/[^\d]/g, ''),
          userId: user.id
        }),
      })

      if (response.ok) {
        const payload = await response.json()
        const newCompany = payload?.company || payload
        if (!newCompany || !newCompany.id) {
          toast({ title: 'Error', description: 'Invalid response while creating company', variant: 'destructive' })
          return
        }
        try { localStorage.setItem('lastCompanyId', String(newCompany.id)) } catch {}
        window.location.href = `/dashboard?company=${newCompany.id}`
        return
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to create company',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error creating company:', error)
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsCreatingCompany(false)
    }
  }

  const handleCloseModal = () => {
    setIsAddCompanyModalOpen(false)
    setNewCompanyData({
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      abn: '',
      industry: ''
    })
  }

  const handleLogout = () => {
    try {
      if (selectedCompany?.id) localStorage.setItem('lastCompanyId', String(selectedCompany.id))
    } catch {}
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  // File upload functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileUpload(files)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const dt = e.dataTransfer
    let files: File[] = []
    if (dt.items && dt.items.length) {
      for (let i = 0; i < dt.items.length; i++) {
        const item = dt.items[i]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }
    } else {
      files = Array.from(dt.files || [])
    }
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please upload images, PDFs, or text documents.`
    }
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return `File size must be less than 10MB. Current size: ${formatFileSize(file.size)}`
    }
    
    return null
  }

  // Document actions
  const digitizeDocument = async (documentId: string) => {
    if (!user?.id) return
    
    // Add document to digitizing set
    setDigitizingDocuments(prev => new Set(prev).add(documentId))
    
    try {
      console.log(`Starting digitization for document ${documentId}...`)
      
      const response = await fetch(`/api/documents/${documentId}/digitize?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log(`Digitization response status: ${response.status}`)
      
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: 'Unknown error occurred' }
        }
        
        console.error(`Digitization failed with status ${response.status}:`, errorData)
        
        // Handle different error types
        if (response.status === 503 && errorData.retryable) {
          toast({
            title: 'Service Temporarily Unavailable',
            description: errorData.error || 'AI service is overloaded. Please try again in a few minutes.',
            variant: 'destructive'
          })
        } else if (response.status === 403) {
          toast({
            title: 'Authentication Error',
            description: 'AI service authentication failed. Please contact support.',
            variant: 'destructive'
          })
        } else if (response.status === 400) {
          toast({
            title: 'Document Error',
            description: 'Document format not supported or corrupted.',
            variant: 'destructive'
          })
        } else {
          toast({
            title: 'Error',
            description: errorData.error || `Failed to digitize document: ${response.status} ${response.statusText}`,
            variant: 'destructive'
          })
        }
        
        throw new Error(errorData.error || `Failed to digitize document: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Digitization result:', result)

      toast({
        title: 'Success',
        description: 'Document digitization completed successfully',
      })

      // Refresh documents and digitized documents to show updated status
      if (selectedCompany && user) {
        await Promise.all([
          loadCompanyDocuments(selectedCompany.id),
          loadDigitizedDocuments(selectedCompany.id)
        ])
      }
    } catch (error) {
      console.error('Error digitizing document:', error)
      // Error toast is already shown above, no need to show another one
    } finally {
      // Remove document from digitizing set
      setDigitizingDocuments(prev => {
        const newSet = new Set(prev)
        newSet.delete(documentId)
        return newSet
      })
    }
  }

  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!documentToDelete) return
    
    try {
      const response = await fetch(`/api/documents/${documentToDelete}?userId=${user?.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      })

      // Refresh documents and dashboard data
      if (selectedCompany && user) {
        await loadCompanyDocuments(selectedCompany.id)
        await loadDashboardData(user)
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive'
      })
    } finally {
      setIsDeleteModalOpen(false)
      setDocumentToDelete(null)
    }
  }

  const handleBulkDigitizeDocuments = async (rows: any[]) => {
    if (!selectedCompany?.id || !user?.id) {
      toast({ title: 'Error', description: 'Please select a company and sign in', variant: 'destructive' })
      return
    }
    setIsBulkDigitizing(true)
    try {
      const docs = rows.map((r) => r.original).filter((d: any) => d.status === 'QUEUE' || d.status === 'ERROR')
      const startTs = Date.now()
      setBulkDigitizeStart(startTs)
      setBulkDigitizeProcessed(0)
      setBulkDigitizeTotal(docs.length)
      setBulkDigitizeSuccess(0)
      setBulkDigitizeError(0)
      localStorage.setItem('bulkDigitizeProgress', JSON.stringify({ status: 'active', start: startTs, total: docs.length, processed: 0, success: 0, error: 0 }))
      if (docs.length === 0) {
        toast({ title: 'Digitize', description: 'No eligible documents selected', variant: 'destructive' })
        setIsBulkDigitizing(false)
      } else {
        const promises = docs.map((d: any) =>
          digitizeDocument(d.id)
            .then(() => {
              setBulkDigitizeProcessed((p) => {
                const next = p + 1
                const s = bulkDigitizeSuccess + 1
                setBulkDigitizeSuccess(s)
                localStorage.setItem('bulkDigitizeProgress', JSON.stringify({ status: 'active', start: startTs, total: docs.length, processed: next, success: s, error: bulkDigitizeError }))
                return next
              })
            })
            .catch(() => {
              setBulkDigitizeProcessed((p) => {
                const next = p + 1
                const e = bulkDigitizeError + 1
                setBulkDigitizeError(e)
                localStorage.setItem('bulkDigitizeProgress', JSON.stringify({ status: 'active', start: startTs, total: docs.length, processed: next, success: bulkDigitizeSuccess, error: e }))
                return next
              })
            })
        )
        await Promise.allSettled(promises)
        await Promise.all([
          loadCompanyDocuments(selectedCompany.id),
          loadDigitizedDocuments(selectedCompany.id),
        ])
        toast({ title: 'Digitize', description: `${docs.length} document(s) queued for digitization` })
      }
    } catch (e) {
      console.error('Bulk digitize failed', e)
      toast({ title: 'Digitize failed', description: 'Failed to perform bulk digitization', variant: 'destructive' })
    } finally {
      setIsBulkDigitizing(false)
      setBulkDigitizeStart(null)
      localStorage.setItem('bulkDigitizeProgress', JSON.stringify({ status: 'completed', start: null, total: bulkDigitizeTotal, processed: bulkDigitizeProcessed, success: bulkDigitizeSuccess, error: bulkDigitizeError }))
    }
  }

  const handleBulkDeleteDocuments = async (rows: any[]) => {
    if (!selectedCompany?.id || !user?.id) {
      toast({ title: 'Error', description: 'Please select a company and sign in', variant: 'destructive' })
      return
    }
    if (!confirm('Delete Selected Docs')) return
    setIsBulkDeleting(true)
    try {
      const ids = rows.map((r) => r.original.id).filter(Boolean)
      const results = await Promise.all(ids.map(async (id) => {
        const resp = await fetch(`/api/documents/${id}?userId=${user.id}`, { method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
        return resp.ok
      }))
      const successCount = results.filter(Boolean).length
      await loadCompanyDocuments(selectedCompany.id)
      await loadDashboardData(user)
      toast({ title: 'Delete', description: `${successCount}/${ids.length} document(s) deleted` })
    } catch (e) {
      console.error('Bulk delete documents failed', e)
      toast({ title: 'Delete failed', description: 'Failed to delete selected documents', variant: 'destructive' })
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setDocumentToDelete(null)
  }

  const handleDeleteDigitizedClick = (digitizedId: string) => {
    setDigitizedDocumentToDelete(digitizedId)
    setIsDeleteDigitizedModalOpen(true)
  }

  const confirmDeleteDigitized = async () => {
    if (!digitizedDocumentToDelete) return
    
    try {
      const response = await fetch(`/api/digitized?id=${digitizedDocumentToDelete}&userId=${user?.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete digitized document')
      }

      toast({
        title: 'Success',
        description: 'Digitized document moved to review (original retained)',
      })

      // Refresh digitized documents
      if (selectedCompany && user) {
        await loadDigitizedDocuments(selectedCompany.id)
        await loadReviewDocuments(selectedCompany.id)
      }
    } catch (error) {
      console.error('Error deleting digitized document:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete digitized document',
        variant: 'destructive'
      })
    } finally {
      setIsDeleteDigitizedModalOpen(false)
      setDigitizedDocumentToDelete(null)
    }
  }

  const cancelDeleteDigitized = () => {
    setIsDeleteDigitizedModalOpen(false)
    setDigitizedDocumentToDelete(null)
  }

  const handleFileUpload = async (files: File[]) => {
    if (!selectedCompany?.id || !user?.id) {
      toast({
        title: 'Error',
        description: 'Please select a company first',
        variant: 'destructive'
      })
      return
    }

    // Validate files
    for (const file of files) {
      const error = validateFile(file)
      if (error) {
        toast({
          title: 'File validation error',
          description: error,
          variant: 'destructive'
        })
        return
      }
    }

    setIsUploading(true)
    try {
      const uploadOne = async (file: File, index: number) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('companyId', selectedCompany.id)
        formData.append('userId', user.id)
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `Failed to upload ${file.name}`)
        }
        await response.json()
      }
      await Promise.all(files.map((file, idx) => uploadOne(file, idx)))
      {
        const t = toast({
          title: 'Success',
          description: `${files.length} file(s) uploaded successfully`,
        })
        setTimeout(() => t.dismiss(), 2000)
      }
      loadCompanyDocuments(selectedCompany.id)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const checkAbnDetails = async (abn: string) => {
    setIsLoadingAbn(true)
    setAbnData(null)
    
    try {
      const response = await fetch(`/api/vendors?abn=${abn}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setAbnData(data)
      } else {
        const errorData = await response.json()
        toast({
          title: 'ABN Check Error',
          description: errorData.error || 'Failed to get ABN data',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error checking ABN:', error)
      toast({
        title: 'Network Error',
        description: 'Failed to connect to ABN verification service',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingAbn(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'QUEUE': { label: 'In Queue', variant: 'secondary' as const },
      'PROCESSING': { label: 'Processing', variant: 'default' as const },
      'DIGITIZED': { label: 'Digitized', variant: 'default' as const },
      'ERROR': { label: 'Error', variant: 'destructive' as const },
      'DELETED': { label: 'Deleted', variant: 'outline' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatAbn = (abn?: string) => {
    if (!abn) return '-'
    const digits = abn.replace(/\D/g, '')
    if (digits.length !== 11) return abn
    return `${digits.slice(0,2)} ${digits.slice(2,5)} ${digits.slice(5,8)} ${digits.slice(8,11)}`
  }

  const formatGstPretty = (dateString?: string) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return ''
    const day = String(d.getDate()).padStart(2, '0')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
  }

  // Xero integration functions
  const checkXeroStatus = useCallback(async () => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/xero/status?userId=${user.id}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const status = await response.json()
        setXeroStatus(status)
      }
    } catch (error) {
      console.error('Error checking Xero status:', error)
    }
  }, [user?.id])

  const loadXeroOrganisations = useCallback(async () => {
    if (!user?.id) return
    try {
      const r = await fetch(`/api/xero/organisations?userId=${user.id}`, { credentials: 'include' })
      const j = await r.json()
      if (r.ok) {
        const tenants = (j.tenants || []) as { tenantId: string; tenantName: string }[]
        setXeroOrganisations(tenants)
      } else {
        const msg = j.error || 'Failed to load Xero organisations'
        toast({ title: 'Xero Error', description: msg, variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Network Error', description: 'Unable to fetch organisations', variant: 'destructive' })
    }
  }, [user?.id, toast])

  const loadXeroBankAccounts = useCallback(async () => {
    if (!user?.id || !selectedCompany?.id) return
    try {
      const r = await fetch(`/api/xero/bank-accounts?userId=${user.id}&companyId=${selectedCompany.id}`, { credentials: 'include' })
      const j = await r.json()
      if (r.ok) {
        setXeroBankAccounts(j.accounts || [])
      } else {
        const msg = j.error || 'Failed to load bank accounts'
        toast({ title: 'Xero Error', description: msg, variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Network Error', description: 'Unable to fetch bank accounts', variant: 'destructive' })
    }
  }, [user?.id, selectedCompany?.id, toast])

  const handleSelectXeroBankAccount = useCallback(async (accountId: string) => {
    if (!user?.id || !selectedCompany?.id) return
    const accountName = xeroBankAccounts.find(a => a.accountID === accountId)?.name || ''
    try {
      const r = await fetch(`/api/xero/select-bank-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: user.id, companyId: selectedCompany.id, accountId, accountName }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j?.success) {
        throw new Error(j?.error || 'Failed to save bank account')
      }
      if (selectedCompany) {
        const updated = { ...selectedCompany, xeroBankAccountId: accountId, xeroBankAccountName: accountName }
        setSelectedCompany(updated)
        setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c))
      }
      toast({ title: 'Bank Account Selected', description: accountName || accountId })
    } catch (e: any) {
      toast({ title: 'Xero Error', description: e?.message || 'Failed to select bank account', variant: 'destructive' })
    }
  }, [user?.id, selectedCompany, xeroBankAccounts, toast])

  const handleXeroConnect = async () => {
    if (!user?.id) return
    
    setIsLoadingXero(true)
    try {
      const response = await fetch(`/api/xero/auth?userId=${user.id}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const { consentUrl } = await response.json()
        const popup = window.open(consentUrl, '_blank', 'width=600,height=700')
        const onMessage = async (event: MessageEvent) => {
          const data: any = event?.data
          if (!data || data.type !== 'xero-auth') return
          if (data.status === 'success') {
            await checkXeroStatus()
            toast({ title: 'Xero Connected!', description: 'Authorization completed' })
          } else {
            toast({ title: 'Xero Authorization Error', description: String(data.message || 'Authorization failed'), variant: 'destructive' })
          }
          try { popup && !popup.closed && popup.close() } catch {}
          try { clearInterval(pollInterval) } catch {}
          window.removeEventListener('message', onMessage)
        }
        window.addEventListener('message', onMessage)
        
        // Poll for connection status
        const pollInterval = setInterval(async () => {
          await checkXeroStatus()
          if (xeroStatus.connected) {
            clearInterval(pollInterval)
            toast({
              title: 'Xero Connected!',
              description: `Successfully connected to ${xeroStatus.tenantName}`,
            })
            window.removeEventListener('message', onMessage)
            try { popup && !popup.closed && popup.close() } catch {}
          }
        }, 2000)
        
        // Stop polling after 2 minutes
        setTimeout(() => { clearInterval(pollInterval); window.removeEventListener('message', onMessage) }, 120000)
      }
    } catch (error) {
      console.error('Error connecting to Xero:', error)
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Xero. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingXero(false)
    }
  }

  const handleXeroDisconnect = async () => {
    if (!user?.id) return
    
    setIsLoadingXero(true)
    try {
      const response = await fetch(`/api/xero/status?userId=${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (response.ok) {
        setXeroStatus({ connected: false })
        setXeroTestResult(null)
        toast({
          title: 'Xero Disconnected',
          description: 'Successfully disconnected from Xero',
        })
      }
    } catch (error) {
      console.error('Error disconnecting from Xero:', error)
      toast({
        title: 'Disconnection Failed',
        description: 'Failed to disconnect from Xero. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingXero(false)
    }
  }

  const handleXeroTest = async () => {
    if (!user?.id) return
    
    setIsTestingXero(true)
    setXeroTestResult(null)
    try {
      const response = await fetch(`/api/xero/test?userId=${user.id}`, {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (response.ok) {
        setXeroTestResult(result)
        toast({
          title: 'Xero Test Successful!',
          description: `Retrieved ${result.accountsCount} accounts from ${result.tenantName}`,
        })
      } else {
        const errorMessage = result.error || 'Failed to fetch accounts from Xero'
        
        // If token expired or unauthorized, update Xero status to disconnected
        if (response.status === 401 || errorMessage.includes('expired') || errorMessage.includes('Unauthorized')) {
          setXeroStatus({ connected: false })
          setXeroTestResult(null)
          toast({
            title: 'Xero Connection Lost',
            description: 'Your Xero connection has expired. Please reconnect to continue.',
            variant: 'destructive'
          })
          return // Stop further attempts
        }
        
        setXeroTestResult({ error: errorMessage })
        toast({
          title: 'Xero Test Failed',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error testing Xero connection:', error)
      setXeroTestResult({ error: 'Network error occurred' })
      toast({
        title: 'Test Failed',
        description: 'Failed to test Xero connection. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsTestingXero(false)
    }
  }

  const exportReadyRowsToXero = async (rows: any[]) => {
    if (!user?.id || !selectedCompany?.id) {
      toast({ title: 'Missing context', description: 'Select a company and sign in', variant: 'destructive' })
      return
    }
    setIsExporting(true)
    try {
      const ids = rows.map((r) => r.original.originalDocumentId).filter(Boolean)
      const payload: any = { userId: user.id, companyId: selectedCompany.id, documentIds: ids, mode: xeroExportMode }
      if (dateRangeStart && dateRangeEnd) {
        payload.dateRangeStart = dateRangeStart
        payload.dateRangeEnd = dateRangeEnd
      }
      const res = await fetch('/api/xero/export/ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const j = await res.json()
      if (!res.ok || !j?.success) {
        throw new Error(j?.error || 'Export failed')
      }
      const s = j.summary || {}
      const ok = (s.successes || []).length
      const bad = (s.failures || []).length
      toast({ title: 'Export Completed', description: `Success: ${ok}, Failed: ${bad}` })
      if (selectedCompany?.id) {
        await loadReadyDocuments(selectedCompany.id)
        await loadExportHistory(selectedCompany.id)
      }
    } catch (e: any) {
      toast({ title: 'Xero Export Error', description: e?.message || 'Unknown error', variant: 'destructive' })
    } finally {
      setIsExporting(false)
    }
  }

  const handleSelectXeroTenant = async (tenantId: string) => {
    if (!user?.id) return
    try {
      const tenantName = xeroOrganisations.find(t => t.tenantId === tenantId)?.tenantName || ''
      const r = await fetch(`/api/xero/select-tenant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: user.id, companyId: selectedCompany?.id, tenantId, tenantName }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j?.success) {
        throw new Error(j?.error || 'Failed to save selection')
      }
      setXeroStatus(prev => ({ ...prev, tenantId, tenantName }))
      if (selectedCompany) {
        setSelectedCompany({ ...selectedCompany, xeroTenantId: tenantId, xeroTenantName: tenantName })
        setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...c, xeroTenantId: tenantId, xeroTenantName: tenantName } : c))
      }
      toast({ title: 'Organisation Selected', description: tenantName || tenantId })
    } catch (e: any) {
      toast({ title: 'Xero Error', description: e?.message || 'Failed to select organisation', variant: 'destructive' })
    }
  }

  // Fetch Xero accounts using SDK
  const handleGetXeroAccounts = async () => {
    if (!user?.id) return
    
    setIsTestingXero(true)
    setXeroTestResult(null)
    try {
      const response = await fetch(`/api/xero/test?userId=${user.id}`, {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (response.ok) {
        setXeroTestResult(result)
        setShowXeroAccountsModal(true)
        toast({
          title: 'Accounts Retrieved!',
          description: `Retrieved ${result.accountsCount} accounts from ${result.tenantName}`,
        })
      } else {
        const errorMessage = result.error || 'Failed to fetch accounts from Xero'
        
        // If token expired or unauthorized, update Xero status to disconnected
        if (response.status === 401 || errorMessage.includes('expired') || errorMessage.includes('Unauthorized')) {
          setXeroStatus({ connected: false })
          setXeroTestResult(null)
          toast({
            title: 'Xero Connection Lost',
            description: 'Your Xero connection has expired. Please reconnect to continue.',
            variant: 'destructive'
          })
          return
        }
        
        toast({
          title: 'Failed to Get Accounts',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching Xero accounts:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch Xero accounts. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsTestingXero(false)
    }
  }

  // Check Xero status on component mount
  useEffect(() => {
    if (user?.id) {
      checkXeroStatus()
    }
  }, [user?.id, checkXeroStatus])

  useEffect(() => {
    if (xeroStatus.connected) {
      loadXeroOrganisations()
      loadXeroBankAccounts()
    } else {
      setXeroOrganisations([])
      setXeroBankAccounts([])
    }
  }, [xeroStatus.connected, loadXeroOrganisations, loadXeroBankAccounts])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!selectedCompany) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Company Found</h3>
            <p className="text-muted-foreground">You need to create a company to start managing documents</p>
            <CreateCompanyDialog onCompanyCreated={loadDashboardData} />
          </div>
        </div>
      </div>
    )
  }

  const totalDocuments = documents.length
  const digitizedCount = digitizedDocuments.length
  const queueDocuments = documents.filter(doc => doc.status === 'QUEUE').length
  const processingDocuments = documents.filter(doc => doc.status === 'PROCESSING').length
  const readyCount = readyDocuments.length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-4">
          {/* Company Navigation Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-left">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">{selectedCompany.name}</h2>
                  <p className="text-muted-foreground text-sm">{selectedCompany.description}</p>
                </div>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {companies.map((company) => (
                <DropdownMenuItem
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className={selectedCompany.id === company.id ? "bg-accent" : ""}
                >
                  <Building className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">{company.name}</div>
                    {company.description && (
                      <div className="text-xs text-muted-foreground">{company.description}</div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAddCompany}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Company
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* User Profile Dropdown */}
        <UserMenu user={{ name: user?.name, email: user?.email }} onLogout={handleLogout} />
      </div>
      
      {/* Main content */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">
            <span>Documents</span>
            <Badge className="ml-2">{totalDocuments}</Badge>
          </TabsTrigger>
          <TabsTrigger value="digitized">
            <span>Digitized</span>
            <Badge className="ml-2">{digitizedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ready">
            <span>Validated for Tax Report</span>
            <Badge className="ml-2">{readyCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="export-history">
            <span>Export History</span>
            <Badge className="ml-2">{exportHistoryVisibleCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="review">Deleted</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          {/* Documents Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Documents</CardTitle>
                  <CardDescription>
                    View and manage all uploaded documents
                  </CardDescription>
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Choose Files'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mb-4 border-2 border-dashed rounded-md p-4 text-center text-sm ${isDragOver ? 'border-primary bg-muted/50' : 'text-muted-foreground'}`}
              >
                Drag & drop files here or click Choose Files
              </div>
              {(() => {
                const columns: ColumnDef<DocumentData>[] = [
                  {
                    accessorKey: 'fileName',
                    header: 'File Name',
                    cell: ({ row }) => {
                      const doc = row.original as DocumentData
                      return (
                        <div className="flex items-center space-x-3">
                          {doc.mimeType.startsWith('image/') ? (
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={`/api/files/${doc.id}/view?userId=${user?.id}`}
                                alt={doc.originalName}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                              <FileIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium truncate block">{doc.originalName}</span>
                            <span className="text-xs text-muted-foreground">{doc.mimeType}</span>
                          </div>
                        </div>
                      )
                    }
                  },
                  { accessorKey: 'fileSize', header: 'Size', cell: ({ row }) => formatFileSize((row.original as DocumentData).fileSize) },
                  { accessorKey: 'uploadDate', header: 'Upload Date', cell: ({ row }) => formatDate((row.original as DocumentData).uploadDate) },
                  { accessorKey: 'status', header: 'Status', cell: ({ row }) => {
                    const doc = row.original as DocumentData
                    const variant = doc.status === 'DIGITIZED' ? 'default' : doc.status === 'PROCESSING' ? 'secondary' : doc.status === 'ERROR' ? 'destructive' : 'outline'
                    return (<Badge variant={variant as any}>{doc.status}</Badge>)
                  } },
                  {
                    id: 'actions',
                    header: 'Actions',
                    cell: ({ row }) => {
                      const doc = row.original as DocumentData
                      return (
                        <div className="flex items-center space-x-2">
                          {doc.mimeType.startsWith('image/') && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (!user?.id) {
                                      toast({ title: 'Not signed in', description: 'Please sign in to view images.', variant: 'destructive' })
                                      return
                                    }
                                    setSelectedDocumentForImage(doc)
                                    setIsImageModalOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Source Document</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {doc.status === 'DIGITIZED' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDocumentForJson(doc)
                                    setIsJsonModalOpen(true)
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Data</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {(doc.status === 'QUEUE' || doc.status === 'ERROR') && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => digitizeDocument(doc.id)}
                                >
                                  {digitizingDocuments.has(doc.id) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{digitizingDocuments.has(doc.id) ? 'Digitizing...' : 'Digitize Document'}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(doc.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Source Document</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )
                    }
                  },
                ]
                const defaultVisible = ['fileName', 'fileSize', 'uploadDate', 'status', 'actions']
                const key = user?.id ? `documents_columns_visibility:${user.id}` : undefined
                return (
                  <TooltipProvider>
                    <DataTable 
                      columns={columns} 
                      data={documents} 
                      defaultVisibleColumnIds={defaultVisible} 
                      storageKey={key}
                      bulkActions={(rows, clearSelection) => (
                        <>
                          <Button size="sm" onClick={() => handleBulkDigitizeDocuments(rows).then(() => clearSelection())}>
                            {isBulkDigitizing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Digitize'}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleBulkDeleteDocuments(rows).then(() => clearSelection())}>
                            {isBulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                          </Button>
                          {isBulkDigitizing && (
                            <div className="flex items-center gap-2 ml-2 text-xs text-muted-foreground">
                              <Badge variant="secondary">{formatMMSS(bulkDigitizeElapsed)}</Badge>
                              <Badge variant="outline">{bulkDigitizeProcessed}/{bulkDigitizeTotal}</Badge>
                              <Badge variant="outline">{bulkDigitizeTotal > 0 ? `${Math.round((bulkDigitizeProcessed / bulkDigitizeTotal) * 100)}%` : '0%'}</Badge>
                              <Badge variant="secondary">ETA {bulkDigitizeProcessed > 0 ? formatMMSS(Math.max(0, Math.round((bulkDigitizeTotal - bulkDigitizeProcessed) * (bulkDigitizeElapsed / bulkDigitizeProcessed)))) : '--:--'}</Badge>
                              <Badge variant="outline">{bulkDigitizeSuccess} ✓ / {bulkDigitizeError} ✗</Badge>
                            </div>
                          )}
                        </>
                      )}
                    />
                  </TooltipProvider>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        

        <TabsContent value="ready" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Validated for Tax Report</CardTitle>
                  <CardDescription>
                     {readyVisibleCount} Source Documents Validated for Tax Reporting
                  </CardDescription>
                </div>
                
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <Label htmlFor="range-start">From</Label>
                    <Input id="range-start" type="date" value={dateRangeStart} onChange={(e) => setDateRangeStart(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="range-end">To</Label>
                    <Input id="range-end" type="date" value={dateRangeEnd} onChange={(e) => setDateRangeEnd(e.target.value)} />
                  </div>
                </div>
                {(() => {
                  const hasRange = !!dateRangeStart && !!dateRangeEnd
                  const parseLocalDate = (s?: string) => {
                    if (!s) return null
                    const d = new Date(s)
                    return isNaN(d.getTime()) ? null : d
                  }
                  let outside = 0
                  if (hasRange && readyDocuments.length > 0) {
                    const [y1, m1, d1] = dateRangeStart.split('-').map((v) => parseInt(v, 10))
                    const [y2, m2, d2] = dateRangeEnd.split('-').map((v) => parseInt(v, 10))
                    if (!isNaN(y1) && !isNaN(m1) && !isNaN(d1) && !isNaN(y2) && !isNaN(m2) && !isNaN(d2)) {
                      const start = new Date(y1, m1 - 1, d1, 0, 0, 0, 0).getTime()
                      const end = new Date(y2, m2 - 1, d2, 23, 59, 59, 999).getTime()
                      outside = readyDocuments.reduce((acc, doc) => {
                        const pd = parseLocalDate(doc.purchaseDate)
                        if (!pd) return acc + 1
                        const t = pd.getTime()
                        return t < start || t > end ? acc + 1 : acc
                      }, 0)
                    }
                  }
                  return outside > 0 ? (
                    <div className="mt-2 text-sm italic text-orange-600">*Please note that ({outside}) records did not fall within the period you selected.</div>
                  ) : null
                })()}
              </div>
              {(() => {
                const hasRange = !!dateRangeStart && !!dateRangeEnd
                const parseLocalDate = (s?: string) => {
                  if (!s) return null
                  const d = new Date(s)
                  return isNaN(d.getTime()) ? null : d
                }
                let dataForTable = readyDocuments
                if (hasRange && readyDocuments.length > 0) {
                  const [y1, m1, d1] = dateRangeStart.split('-').map((v) => parseInt(v, 10))
                  const [y2, m2, d2] = dateRangeEnd.split('-').map((v) => parseInt(v, 10))
                  if (!isNaN(y1) && !isNaN(m1) && !isNaN(d1) && !isNaN(y2) && !isNaN(m2) && !isNaN(d2)) {
                    const start = new Date(y1, m1 - 1, d1, 0, 0, 0, 0).getTime()
                    const end = new Date(y2, m2 - 1, d2, 23, 59, 59, 999).getTime()
                    dataForTable = readyDocuments.filter((doc) => {
                      const pd = parseLocalDate(doc.purchaseDate)
                      if (!pd) return false
                      const t = pd.getTime()
                      return t >= start && t <= end
                    })
                  }
                }
                const columns: ColumnDef<DigitizedData>[] = [
                  { accessorKey: 'purchaseDate', header: 'Purchase Date', cell: ({ row }) => <TruncatedCell text={row.original.purchaseDate ? formatDate(row.original.purchaseDate) : '-'} /> },
                  { accessorKey: 'vendorName', header: 'Vendor Name', cell: ({ row }) => {
                    const doc = row.original
                    const abn = doc.vendorAbn || ''
                    const name = vendorInfo[abn]?.name || doc.vendorName || '-'
                    const onClick = () => {
                      if (!user?.id) {
                        toast({ title: 'Not signed in', description: 'Please sign in to view images.', variant: 'destructive' })
                        return
                      }
                      const imageId = doc.originalDocumentId || (doc as any).id
                      const docForModal = { ...doc, id: imageId, status: 'DIGITIZED' as const, uploadDate: doc.createdAt, transactionDate: doc.purchaseDate, vendor: doc.vendorName, abn: doc.vendorAbn, gstAmount: doc.taxAmount, paymentMethod: doc.paymentType, receiptData: (doc as any).extractedData }
                      setSelectedDocumentForImage(docForModal)
                      setIsImageModalOpen(true)
                    }
                    return <span className="cursor-pointer" onClick={onClick}>{name}</span>
                  } },
                  { accessorKey: 'vendorAbn', header: 'Vendor ABN', size: 220, meta: { headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' }, cell: ({ row }) => {
                    const doc = row.original
                    const abn = doc.vendorAbn || ''
                    const status = vendorInfo[abn]?.status
                    const cls = status === 'Active' ? 'text-green-600 font-medium' : status ? 'text-red-600 font-medium' : ''
                    const onClick = () => {
                      if (abn) {
                        const imageId = doc.originalDocumentId || (doc as any).id
                        const docForModal = { ...doc, id: imageId, status: 'DIGITIZED' as const, uploadDate: doc.createdAt, transactionDate: doc.purchaseDate, vendor: doc.vendorName, abn: doc.vendorAbn, gstAmount: doc.taxAmount, paymentMethod: doc.paymentType, receiptData: (doc as any).extractedData }
                        setSelectedDocumentForAbn(docForModal)
                        setIsAbnModalOpen(true)
                        checkAbnDetails(abn)
                      } else {
                        toast({ title: 'ABN not found', description: 'The document does not contain an ABN for verification', variant: 'destructive' })
                      }
                    }
                    return <span className={cls + ' cursor-pointer underline'} onClick={onClick}>{formatAbn(abn) || '-'}</span>
                  } },
                  { accessorKey: 'cashOutAmount', header: 'Cash Out', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.cashOutAmount === 'number' ? row.original.cashOutAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'discountAmount', header: 'Discount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.discountAmount === 'number' ? row.original.discountAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'surchargeAmount', header: 'Card Surcharge', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.surchargeAmount === 'number' ? row.original.surchargeAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'taxAmount', header: 'Tax Amount (GST)', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.taxAmount === 'number' ? row.original.taxAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'totalAmount', header: 'Total Amount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.totalAmount === 'number' ? row.original.totalAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'totalPaidAmount', header: 'Total Transaction', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.totalPaidAmount === 'number' ? row.original.totalPaidAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'gstStatus', header: 'GST Status', cell: ({ row }) => {
                    const doc = row.original
                    const abn = doc.vendorAbn || ''
                    const gst = vendorInfo[abn]?.gst
                    const isRegistered = !!gst
                    const text = isRegistered ? 'Registered' : 'Not Registered'
                    const cls = isRegistered ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                    const tip = isRegistered ? `Registered from ${formatGstPretty(gst)}` : ''
                    const onClick = () => {
                      if (abn) {
                        const imageId = doc.originalDocumentId || (doc as any).id
                        const docForModal = { ...doc, id: imageId, status: 'DIGITIZED' as const, uploadDate: doc.createdAt, transactionDate: doc.purchaseDate, vendor: doc.vendorName, abn: doc.vendorAbn, gstAmount: doc.taxAmount, paymentMethod: doc.paymentType, receiptData: (doc as any).extractedData }
                        setSelectedDocumentForAbn(docForModal)
                        setIsAbnModalOpen(true)
                        checkAbnDetails(abn)
                      } else {
                        toast({ title: 'ABN not found', description: 'The document does not contain an ABN for verification', variant: 'destructive' })
                      }
                    }
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cls + ' cursor-pointer underline'} onClick={onClick}>{text}</span>
                          </TooltipTrigger>
                          {isRegistered && (
                            <TooltipContent>
                              <p>{tip}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )
                  } },
                ]
                const defaultVisible = [
                  'purchaseDate', 'vendorName', 'vendorAbn',
                  'cashOutAmount', 'discountAmount', 'surchargeAmount',
                  'taxAmount', 'totalAmount', 'totalPaidAmount', 'gstStatus'
                ]
                const key = user?.id ? `ready_columns_visibility:${user.id}` : undefined
                return (
                <DataTable 
                  columns={columns} 
                  data={dataForTable} 
                  defaultVisibleColumnIds={defaultVisible} 
                  storageKey={key}
                  onRowCountChange={setReadyVisibleCount}
                  bulkActions={(rows, clearSelection) => (
                    <>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">Xero export mode</Label>
                      <Select value={xeroExportMode} onValueChange={(v) => setXeroExportMode(v as 'bill' | 'spend')}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bill">Bills (ACCPAY)</SelectItem>
                          <SelectItem value="spend">Spend Money</SelectItem>
                        </SelectContent>
                      </Select>
                      {xeroExportMode === 'spend' && xeroStatus.connected && selectedCompany?.id ? (
                        <>
                          <Label className="text-xs text-muted-foreground">Bank account</Label>
                          <Select value={selectedCompany?.xeroBankAccountId || undefined} onValueChange={handleSelectXeroBankAccount}>
                            <SelectTrigger className="w-[240px]">
                              <SelectValue placeholder="Choose bank account" />
                            </SelectTrigger>
                            <SelectContent>
                              {xeroBankAccounts.map(a => (
                                <SelectItem key={a.accountID} value={a.accountID}>{a.name || a.accountID}{a.code ? ` (${a.code})` : ''}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      ) : null}
                    </div>
                      <Button size="sm" onClick={() => { if (!rows.length) { toast({ title: 'Nothing selected', description: 'Please select at least one row', variant: 'destructive' }) ; return } ; exportReadyRowsToExcel(rows).then(() => clearSelection()) }}>
                        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Export to Excel'}
                      </Button>
                      <Button size="sm" variant="default" onClick={() => { if (!rows.length) { toast({ title: 'Nothing selected', description: 'Please select at least one row', variant: 'destructive' }); return } ; exportReadyRowsToXero(rows).then(() => clearSelection()) }}>
                        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Export to Xero'}
                      </Button>
                    </>
                  )}
                />
                )
              })()}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Xero Integration
                  </CardTitle>
                  <CardDescription>
                    Connect your Xero account to sync financial data
                  </CardDescription>
                </div>
                {xeroStatus.connected ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-orange-500">Not Connected</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {xeroStatus.connected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tenant Name</Label>
                      <p className="text-sm">{xeroStatus.tenantName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tenant ID</Label>
                      <p className="text-sm font-mono">{xeroStatus.tenantId}</p>
                    </div>
                    {xeroStatus.tokenExpiry && (
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Token Expires</Label>
                        <p className="text-sm">{formatDate(xeroStatus.tokenExpiry)}</p>
                      </div>
                    )}
                  </div>

                  {xeroOrganisations.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Select Organisation</Label>
                      <Select defaultValue={selectedCompany?.xeroTenantId || xeroStatus.tenantId} onValueChange={handleSelectXeroTenant}>
                        <SelectTrigger className="w-full md:w-[360px]">
                          <SelectValue placeholder="Choose organisation" />
                        </SelectTrigger>
                        <SelectContent>
                          {xeroOrganisations.map((t) => (
                            <SelectItem key={t.tenantId} value={t.tenantId}>{t.tenantName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleXeroDisconnect} variant="outline" size="sm">
                      <Unlink className="h-4 w-4 mr-2" />
                      {isLoadingXero ? 'Disconnecting...' : 'Disconnect'}
                    </Button>
                    <Button onClick={handleXeroConnect} variant="outline" size="sm">
                      <Link className="h-4 w-4 mr-2" />
                      Reconnect
                    </Button>
                    <Button onClick={handleXeroTest} variant="default" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      {isTestingXero ? 'Testing...' : 'Test Connection'}
                    </Button>
                    <Button onClick={handleGetXeroAccounts} variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      {isTestingXero ? 'Loading...' : 'Get Accounts'}
                    </Button>
                  </div>

                  {xeroTestResult && (
                    <div className="mt-4 p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">Test Results</h4>
                      {xeroTestResult.error ? (
                        <div className="text-red-600 text-sm">
                          <strong>Error:</strong> {xeroTestResult.error}
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <div className="text-green-600">
                            <strong>✓ Connection Successful!</strong>
                          </div>
                          <div>
                            <strong>Tenant:</strong> {xeroTestResult.tenantName}
                          </div>
                          <div>
                            <strong>Accounts Retrieved:</strong> {xeroTestResult.accountsCount}
                          </div>
                          <Button onClick={() => setShowXeroAccountsModal(true)} variant="outline" size="sm" className="mt-2">
                            <Eye className="h-4 w-4 mr-2" />
                            View All Accounts
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Connect your Xero account to automatically sync invoices, expenses, and other financial data.</p>
                  <Button onClick={handleXeroConnect} className="w-full sm:w-auto">
                    <Link className="h-4 w-4 mr-2" />
                    {isLoadingXero ? 'Connecting...' : 'Connect to Xero'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export-history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Export History</CardTitle>
                  <CardDescription>All exports for this company</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Input placeholder="File name" value={exportFilterFile} onChange={(e) => setExportFilterFile(e.target.value)} className="max-w-xs" />
                <Input type="date" value={exportFilterFrom} onChange={(e) => setExportFilterFrom(e.target.value)} className="max-w-[180px]" />
                <Input type="date" value={exportFilterTo} onChange={(e) => setExportFilterTo(e.target.value)} className="max-w-[180px]" />
                <Button variant="outline" size="sm" onClick={() => { if (selectedCompany?.id && user?.id) fetchExportHistory() }}>Filter</Button>
              </div>
              <div className="text-xs text-muted-foreground mb-3 flex flex-wrap gap-2 items-center">
                <span className="font-medium">Summary:</span>
                <Badge variant="outline">Total: {exportHistoryStats.total}</Badge>
                <Badge variant="default">Success: {exportHistoryStats.success}</Badge>
                <Badge variant="destructive">Failed: {exportHistoryStats.failed}</Badge>
                <Badge variant="secondary">Rows: {exportHistoryStats.rowsExported}</Badge>
              </div>
              {(() => {
                const columns: ColumnDef<any>[] = [
                  { accessorKey: 'exportedAt', header: 'Exported At', cell: ({ row }) => <TruncatedCell text={formatDate(row.original.exportedAt)} /> },
                  { accessorKey: 'fileName', header: 'File Name', cell: ({ row }) => <TruncatedCell text={row.original.fileName} /> },
                  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={row.original.status === 'SUCCESS' ? 'default' : 'destructive'}>{row.original.status}</Badge> },
                  { accessorKey: 'totalRows', header: 'Rows', cell: ({ row }) => <TruncatedCell text={String(row.original.totalRows || 0)} /> },
                  { id: 'actions', header: 'Actions', cell: ({ row }) => (
                    <Button size="sm" variant="outline" onClick={() => downloadExportFile(row.original.fileName)}>Download</Button>
                  ) },
                ]
                const key = user?.id ? `export_history_columns_visibility:${user.id}` : undefined
                return (
                  <DataTable 
                    columns={columns} 
                    data={exportHistory} 
                    storageKey={key}
                    onRowCountChange={(n) => setExportHistoryVisibleCount(n)}
                  />
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deleted</CardTitle>
              <CardDescription>
                Items copied from Digitized upon deletion
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const columns: ColumnDef<DigitizedData>[] = [
                  { accessorKey: 'purchaseDate', header: 'Purchase Date', cell: ({ row }) => <TruncatedCell text={row.original.purchaseDate ? formatDate(row.original.purchaseDate) : '-'} /> },
                  { accessorKey: 'vendorName', header: 'Vendor Name', cell: ({ row }) => {
                    const doc = row.original
                    const abn = doc.vendorAbn || ''
                    const name = vendorInfo[abn]?.name || doc.vendorName || '-'
                    const onClick = () => {
                      if (!user?.id) {
                        toast({ title: 'Not signed in', description: 'Please sign in to view images.', variant: 'destructive' })
                        return
                      }
                      const imageId = doc.originalDocumentId || (doc as any).id
                      const docForModal = { ...doc, id: imageId, status: 'DIGITIZED' as const, uploadDate: doc.createdAt, transactionDate: doc.purchaseDate, vendor: doc.vendorName, abn: doc.vendorAbn, gstAmount: doc.taxAmount, paymentMethod: doc.paymentType, receiptData: (doc as any).extractedData }
                      setSelectedDocumentForImage(docForModal)
                      setIsImageModalOpen(true)
                    }
                    return <span className="cursor-pointer" onClick={onClick}>{name}</span>
                  } },
                  { accessorKey: 'documentType', header: 'Document Type', cell: ({ row }) => <TruncatedCell text={row.original.documentType || 'Receipt'} /> },
                  { accessorKey: 'receiptNumber', header: 'Receipt/Invoice Number', cell: ({ row }) => <TruncatedCell text={row.original.receiptNumber || '-'} /> },
                  { accessorKey: 'paymentType', header: 'Payment Type', cell: ({ row }) => <TruncatedCell text={row.original.paymentType || '-'} /> },
                  { accessorKey: 'vendorAbn', header: 'Vendor ABN', size: 180, meta: { headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' }, cell: ({ row }) => {
                    const abn = row.original.vendorAbn || ''
                    const status = vendorInfo[abn]?.status
                    const cls = status === 'Active' ? 'text-green-600 font-medium' : status ? 'text-red-600 font-medium' : ''
                    return <span className={cls}>{formatAbn(abn) || '-'}</span>
                  } },
                  { accessorKey: 'cashOutAmount', header: 'Cash Out', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.cashOutAmount === 'number' ? row.original.cashOutAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'discountAmount', header: 'Discount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.discountAmount === 'number' ? row.original.discountAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'surchargeAmount', header: 'Card Surcharge', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.surchargeAmount === 'number' ? row.original.surchargeAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'taxAmount', header: 'Tax Amount (GST)', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.taxAmount === 'number' ? row.original.taxAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'totalAmount', header: 'Total Amount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.totalAmount === 'number' ? row.original.totalAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'totalPaidAmount', header: 'Total Transaction', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.totalPaidAmount === 'number' ? row.original.totalPaidAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'gstStatus', header: 'GST Status', cell: ({ row }) => {
                    const abn = row.original.vendorAbn || ''
                    const gst = vendorInfo[abn]?.gst
                    const isRegistered = !!gst
                    const text = isRegistered ? 'Registered' : 'Not Registered'
                    const cls = isRegistered ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                    const tip = isRegistered ? `Registered from ${formatGstPretty(gst)}` : ''
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cls}>{text}</span>
                          </TooltipTrigger>
                          {isRegistered && (
                            <TooltipContent>
                              <p>{tip}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )
                  } },
                  {
                    id: 'actions',
                    header: 'Actions',
                    cell: ({ row }) => {
                      const doc = row.original
                      return (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" aria-label="Actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (!user?.id) {
                                  toast({ title: 'Not signed in', description: 'Please sign in to view images.', variant: 'destructive' })
                                  return
                                }
                                const imageId = doc.originalDocumentId || (doc as any).id
                                const docForModal = { ...doc, id: imageId, status: 'DIGITIZED' as const, uploadDate: doc.createdAt, transactionDate: doc.purchaseDate, vendor: doc.vendorName, abn: doc.vendorAbn, gstAmount: doc.taxAmount, paymentMethod: doc.paymentType, receiptData: (doc as any).extractedData }
                                setSelectedDocumentForImage(docForModal)
                                setIsImageModalOpen(true)
                              }}
                            >
                              View Source Document
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }
                  },
                ]

                const defaultVisible = [
                  'purchaseDate', 'vendorName', 'vendorAbn',
                  'cashOutAmount', 'discountAmount', 'surchargeAmount',
                  'taxAmount', 'totalAmount', 'totalPaidAmount', 'gstStatus', 'actions'
                ]
                const key = user?.id ? `review_columns_visibility:${user.id}` : undefined
                return (
                  <DataTable 
                    columns={columns} 
                    data={reviewDocuments} 
                    defaultVisibleColumnIds={defaultVisible} 
                    storageKey={key}
                  />
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="digitized" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Digitized Documents</CardTitle>
              <CardDescription>
                Documents that have been successfully processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const columns: ColumnDef<DigitizedData>[] = [
                  { accessorKey: 'purchaseDate', header: 'Purchase Date', cell: ({ row }) => <TruncatedCell text={row.original.purchaseDate ? formatDate(row.original.purchaseDate) : '-'} /> },
                  { accessorKey: 'vendorName', header: 'Vendor Name', cell: ({ row }) => {
                    const abn = row.original.vendorAbn || ''
                    const name = vendorInfo[abn]?.name || row.original.vendorName || '-'
                    return <TruncatedCell text={name} />
                  } },
                  { accessorKey: 'vendorAbn', header: 'Vendor ABN', size: 220, meta: { headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' }, cell: ({ row }) => {
                    const abn = row.original.vendorAbn || ''
                    const status = vendorInfo[abn]?.status
                    const cls = status === 'Active' ? 'text-green-600 font-medium' : status ? 'text-red-600 font-medium' : ''
                    return <span className={cls}>{formatAbn(abn) || '-'}</span>
                  } },
                  { accessorKey: 'documentType', header: 'Document Type', cell: ({ row }) => <TruncatedCell text={row.original.documentType || 'Receipt'} /> },
                  { accessorKey: 'receiptNumber', header: 'Receipt/Invoice Number', cell: ({ row }) => <TruncatedCell text={row.original.receiptNumber || '-'} /> },
                  { accessorKey: 'paymentType', header: 'Payment Type', cell: ({ row }) => <TruncatedCell text={row.original.paymentType || '-'} /> },
                  
                  { accessorKey: 'cashOutAmount', header: 'Cash Out', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.cashOutAmount === 'number' ? row.original.cashOutAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'discountAmount', header: 'Discount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.discountAmount === 'number' ? row.original.discountAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'surchargeAmount', header: 'Card Surcharge', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.surchargeAmount === 'number' ? row.original.surchargeAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'taxAmount', header: 'Tax Amount (GST)', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.taxAmount === 'number' ? row.original.taxAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'totalAmount', header: 'Total Amount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.totalAmount === 'number' ? row.original.totalAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'totalPaidAmount', header: 'Total Transaction', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.totalPaidAmount === 'number' ? row.original.totalPaidAmount : 0).toFixed(2)} /> },
                  
                  { accessorKey: 'gstStatus', header: 'GST Status', cell: ({ row }) => {
                    const abn = row.original.vendorAbn || ''
                    const gst = vendorInfo[abn]?.gst
                    const isRegistered = !!gst
                    const text = isRegistered ? 'Registered' : 'Not Registered'
                    const cls = isRegistered ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                    const tip = isRegistered ? `Registered from ${formatGstPretty(gst)}` : ''
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cls}>{text}</span>
                          </TooltipTrigger>
                          {isRegistered && (
                            <TooltipContent>
                              <p>{tip}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )
                  } },
                  {
                    id: 'actions',
                    header: 'Actions',
                    cell: ({ row }) => {
                      const doc = row.original
                      return (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" aria-label="Actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                openEditModal(doc)
                              }}
                            >
                              Edit Source Document
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (!user?.id) {
                                  toast({ title: 'Not signed in', description: 'Please sign in to view images.', variant: 'destructive' })
                                  return
                                }
                                const imageId = doc.originalDocumentId || doc.id
                                const docForModal = { ...doc, id: imageId, status: 'DIGITIZED' as const, uploadDate: doc.createdAt, transactionDate: doc.purchaseDate, vendor: doc.vendorName, abn: doc.vendorAbn, gstAmount: doc.taxAmount, paymentMethod: doc.paymentType, receiptData: doc.extractedData }
                                setSelectedDocumentForImage(docForModal)
                                setIsImageModalOpen(true)
                              }}
                            >
                              View Source Document
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const abn = doc.vendorAbn
                                if (abn) {
                                  const imageId = doc.originalDocumentId || doc.id
                                  const docForModal = { ...doc, id: imageId, status: 'DIGITIZED' as const, uploadDate: doc.createdAt, transactionDate: doc.purchaseDate, vendor: doc.vendorName, abn: doc.vendorAbn, gstAmount: doc.taxAmount, paymentMethod: doc.paymentType, receiptData: doc.extractedData }
                                  setSelectedDocumentForAbn(docForModal)
                                  setIsAbnModalOpen(true)
                                  checkAbnDetails(abn)
                                } else {
                                  toast({ title: 'ABN not found', description: 'The document does not contain an ABN for verification', variant: 'destructive' })
                                }
                              }}
                            >
                              Check ASIC Validation
                            </DropdownMenuItem>
               
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDeleteDigitizedClick(doc.id)
                              }}
                              className="text-destructive"
                            >
                              Delete Source Document
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }
                  },
                ]

                const defaultVisible = [
                  'purchaseDate', 'vendorName', 'vendorAbn',
                  'cashOutAmount', 'discountAmount', 'surchargeAmount',
                  'taxAmount', 'totalAmount', 'totalPaidAmount', 'gstStatus', 'actions'
                ]
                const key = user?.id ? `digitized_columns_visibility:${user.id}` : undefined
                return (
                  <DataTable 
                    columns={columns} 
                    data={digitizedDocuments} 
                    defaultVisibleColumnIds={defaultVisible} 
                    storageKey={key}
                    bulkActions={(rows, clearSelection) => (
                      <>
                        <Button size="sm" onClick={() => { if (!rows.length) { toast({ title: 'Nothing selected', description: 'Please select at least one row', variant: 'destructive' }) ; return } ; validateSelected(rows).then(() => clearSelection()) }}>Validate</Button>
                        <Button size="sm" variant="destructive" onClick={() => { if (!rows.length) { toast({ title: 'Nothing selected', description: 'Please select at least one row', variant: 'destructive' }) ; return } ; handleBulkDeleteSelected(rows) }}>Delete</Button>
                      </>
                    )}
                    getRowClassName={(row) => validationErrors[row.original.id] ? 'bg-red-50' : ''}
                  />
                )
              })()}
            </CardContent>
          </Card>
          
          
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Company Profile</CardTitle>
                  <CardDescription>
                    Information about {selectedCompany.name}
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    setIsEditingCompany(!isEditingCompany)
                    setEditedCompany(selectedCompany)
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditingCompany ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditingCompany ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Company Name</Label>
                      <Input
                        id="name"
                        value={editedCompany?.name || ''}
                        onChange={(e) => setEditedCompany(prev => prev ? {...prev, name: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={editedCompany?.industry || ''}
                        onChange={(e) => setEditedCompany(prev => prev ? {...prev, industry: e.target.value} : null)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedCompany?.description || ''}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, description: e.target.value} : null)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedCompany?.email || ''}
                        onChange={(e) => setEditedCompany(prev => prev ? {...prev, email: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedCompany?.phone || ''}
                        onChange={(e) => setEditedCompany(prev => prev ? {...prev, phone: e.target.value} : null)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editedCompany?.website || ''}
                        onChange={(e) => setEditedCompany(prev => prev ? {...prev, website: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="abn">ABN</Label>
                      <Input
                        id="abn"
                        value={editedCompany?.abn || ''}
                        onChange={(e) => setEditedCompany(prev => prev ? {...prev, abn: e.target.value} : null)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editedCompany?.address || ''}
                      onChange={(e) => setEditedCompany(prev => prev ? {...prev, address: e.target.value} : null)}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleCompanyUpdate}>
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingCompany(false)
                        setEditedCompany(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Company Name</h4>
                        <p className="text-sm">{selectedCompany.name}</p>
                      </div>
                      
                      {selectedCompany.description && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                          <p className="text-sm">{selectedCompany.description}</p>
                        </div>
                      )}
                      
                      {selectedCompany.industry && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
                          <p className="text-sm">{selectedCompany.industry}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {selectedCompany.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCompany.email}</span>
                        </div>
                      )}
                      
                      {selectedCompany.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCompany.phone}</span>
                        </div>
                      )}
                      
                      {selectedCompany.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {selectedCompany.website}
                          </a>
                        </div>
                      )}
                      
                      {selectedCompany.address && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm">{selectedCompany.address}</span>
                        </div>
                      )}
                      
                      {selectedCompany.abn && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">ABN</h4>
                          <p className="text-sm">{selectedCompany.abn}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{selectedCompany.documentsCount}</div>
                        <div className="text-xs text-muted-foreground">Documents</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{digitizedCount}</div>
                        <div className="text-xs text-muted-foreground">Digitized</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatDate(selectedCompany.createdAt)}</div>
                        <div className="text-xs text-muted-foreground">Created Date</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatDate(selectedCompany.updatedAt)}</div>
                        <div className="text-xs text-muted-foreground">Last Updated</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal for displaying digitization JSON data */}
      <Dialog open={isJsonModalOpen} onOpenChange={setIsJsonModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Digitization Data - {selectedDocumentForJson?.originalName}</DialogTitle>
            <DialogDescription>Parsed results and metadata for the selected document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDocumentForJson && (
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify({
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
                  }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-7xl max-h-[98vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold">Edit Document</DialogTitle>
                <DialogDescription className="text-sm mt-1">{selectedDocumentForEdit?.originalName || selectedDocumentForEdit?.fileName}</DialogDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">Zoom: {Math.round(imageZoom * 100)}%</div>
                <Button variant="outline" size="sm" onClick={() => { setImageZoom(1); setImagePosition({ x: 0, y: 0 }) }}>Reset</Button>
              </div>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ height: 'calc(98vh - 80px)' }}>
            <div 
              className="relative bg-black/50 cursor-grab active:cursor-grabbing overflow-hidden"
              onWheel={(e) => { e.preventDefault(); const delta = e.deltaY > 0 ? 0.85 : 1.15; const newZoom = Math.max(0.1, Math.min(8, imageZoom * delta)); setImageZoom(newZoom) }}
              onMouseDown={(e) => { if (imageZoom > 1) { setIsDragging(true); setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y }) } }}
              onMouseMove={(e) => { if (isDragging && imageZoom > 1) { setImagePosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }) } }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {selectedDocumentForEdit && (
                <Image
                  ref={imageRef as any}
                  src={`/api/files/${selectedDocumentForEdit.originalDocumentId || (selectedDocumentForEdit as any).id}/view?userId=${user?.id}`}
                  alt={selectedDocumentForEdit.originalName || selectedDocumentForEdit.fileName}
                  width={2000}
                  height={2000}
                  className="absolute top-1/2 left-1/2 max-w-none shadow-2xl transition-transform duration-200 ease-out"
                  style={{ transform: `translate(-50%, -50%) translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageZoom})`, transformOrigin: 'center center' }}
                  draggable={false}
                />
              )}
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-2 rounded-lg">
                <p>Mouse wheel - zoom</p>
                <p>Drag - move</p>
              </div>
            </div>
            <div className="overflow-y-auto p-6">
              {editForm && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Date</Label>
                    <Input id="purchaseDate" type="date" value={editForm.purchaseDate} onChange={(e) => setEditForm({ ...editForm, purchaseDate: e.target.value })} />
                    {editErrors.purchaseDate && <div className="text-sm text-destructive">{editErrors.purchaseDate}</div>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendorName">Vendor Name</Label>
                      <Input id="vendorName" value={editForm.vendorName} onChange={(e) => setEditForm({ ...editForm, vendorName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendorAbn">Vendor ABN</Label>
                      <Input 
                        id="vendorAbn" 
                        value={editForm.vendorAbn} 
                        onChange={(e) => setEditForm({ ...editForm, vendorAbn: e.target.value })}
                        onBlur={(e) => fetchVendorInfoForAbn(e.target.value)}
                        className={(editForm.vendorAbn && vendorInfo[editForm.vendorAbn]?.status === 'Active') ? 'border-green-600 bg-green-50' : ''}
                      />
                      {editErrors.vendorAbn && <div className="text-sm text-destructive">{editErrors.vendorAbn}</div>}
                      {(editForm.vendorAbn && vendorInfo[editForm.vendorAbn]?.status === 'Active') && (
                        <div className="text-sm text-green-600">ABN Active</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorAddress">Vendor Address</Label>
                    <Textarea id="vendorAddress" value={editForm.vendorAddress} onChange={(e: any) => setEditForm({ ...editForm, vendorAddress: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documentType">Document Type</Label>
                      <Input id="documentType" value={editForm.documentType} onChange={(e) => setEditForm({ ...editForm, documentType: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiptNumber">Receipt/Invoice Number</Label>
                      <Input id="receiptNumber" value={editForm.receiptNumber} onChange={(e) => setEditForm({ ...editForm, receiptNumber: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentType">Payment Type</Label>
                      <Input id="paymentType" value={editForm.paymentType} onChange={(e) => setEditForm({ ...editForm, paymentType: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenseCategory">Expense Category</Label>
                      <Input id="expenseCategory" value={editForm.expenseCategory} onChange={(e) => setEditForm({ ...editForm, expenseCategory: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashOutAmount">Cash Out</Label>
                    <Input id="cashOutAmount" type="number" inputMode="decimal" step="0.01" min="0" value={editForm.cashOutAmount} onChange={(e) => setEditForm({ ...editForm, cashOutAmount: parseFloat(e.target.value) })} />
                      {editErrors.cashOutAmount && <div className="text-sm text-destructive">{editErrors.cashOutAmount}</div>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountAmount">Discount</Label>
                      <Input id="discountAmount" type="number" inputMode="decimal" step="0.01" min="0" value={editForm.discountAmount} onChange={(e) => setEditForm({ ...editForm, discountAmount: parseFloat(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surchargeAmount">Card Surcharge</Label>
                      <Input id="surchargeAmount" type="number" inputMode="decimal" step="0.01" min="0" value={editForm.surchargeAmount} onChange={(e) => setEditForm({ ...editForm, surchargeAmount: parseFloat(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxAmount">Tax Amount (GST)</Label>
                      <Input id="taxAmount" type="number" inputMode="decimal" step="0.01" min="0" value={editForm.taxAmount} onChange={(e) => setEditForm({ ...editForm, taxAmount: parseFloat(e.target.value) })} />
                      {editErrors.taxAmount && <div className="text-sm text-destructive">{editErrors.taxAmount}</div>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amountExclTax">Amount Excl Tax</Label>
                      <Input id="amountExclTax" type="number" inputMode="decimal" step="0.01" min="0" value={editForm.amountExclTax} onChange={(e) => setEditForm({ ...editForm, amountExclTax: parseFloat(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <Input id="totalAmount" type="number" inputMode="decimal" step="0.01" min="0" value={editForm.totalAmount} onChange={(e) => setEditForm({ ...editForm, totalAmount: parseFloat(e.target.value) })} />
                      {editErrors.totalAmount && <div className="text-sm text-destructive">{editErrors.totalAmount}</div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalPaidAmount">Total Transaction</Label>
                      <Input id="totalPaidAmount" type="number" inputMode="decimal" step="0.01" min="0" value={editForm.totalPaidAmount} onChange={(e) => setEditForm({ ...editForm, totalPaidAmount: parseFloat(e.target.value) })} />
                      {editErrors.totalPaidAmount && <div className="text-sm text-destructive">{editErrors.totalPaidAmount}</div>}
                    </div>
                    <div className="space-y-2 hidden">
                      <Label htmlFor="taxStatus">Tax Status</Label>
                      <Input id="taxStatus" value={editForm.taxStatus} readOnly disabled />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={handleEditCancel}>Cancel</Button>
                    <Button onClick={handleEditSave}>Save</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced modal window for displaying images after digitization */}
      <Dialog open={isImageModalOpen} onOpenChange={(open) => {
        setIsImageModalOpen(open)
        if (!open) {
          // Reset zoom and position when closing modal window
          setImageZoom(1)
          setImagePosition({ x: 0, y: 0 })
          setIsDragging(false)
        }
      }}>
        <DialogContent className="max-w-7xl max-h-[98vh] p-0 bg-black/95 border-0">
          <DialogHeader className="px-6 py-4 bg-background/95 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold text-foreground">
                  Document View
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {selectedDocumentForImage?.originalName}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  <span>Zoom: {Math.round(imageZoom * 100)}%</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setImageZoom(1)
                    setImagePosition({ x: 0, y: 0 })
                  }}
                  className="bg-background/80 hover:bg-background"
                >
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                     if (!user?.id) {
                       toast({
                         title: 'Not signed in',
                         description: 'Please sign in to view images.',
                         variant: 'destructive',
                       })
                       return
                     }
                     if (selectedDocumentForImage) {
                       const imageUrl = `/api/files/${selectedDocumentForImage.id}/view?userId=${user?.id}`
                       window.open(imageUrl, '_blank')
                     }
                   }}
                  className="bg-background/80 hover:bg-background"
                >
                  Open in New Tab
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div 
            className="flex-1 overflow-hidden relative bg-black/50 cursor-grab active:cursor-grabbing"
            style={{ height: 'calc(98vh - 100px)' }}
            onWheel={(e) => {
              e.preventDefault()
              const delta = e.deltaY > 0 ? 0.85 : 1.15
              const newZoom = Math.max(0.1, Math.min(8, imageZoom * delta))
              setImageZoom(newZoom)
            }}
            onMouseDown={(e) => {
              if (imageZoom > 1) {
                setIsDragging(true)
                setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
              }
            }}
            onMouseMove={(e) => {
              if (isDragging && imageZoom > 1) {
                setImagePosition({
                  x: e.clientX - dragStart.x,
                  y: e.clientY - dragStart.y
                })
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            {selectedDocumentForImage && (
              <>
                {/* Loading indicator */}
                <div className="loading-indicator absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
                    <p className="text-sm opacity-80">Loading image...</p>
                  </div>
                </div>
                
                <Image 
                  ref={imageRef as any}
                  src={`/api/files/${selectedDocumentForImage.id}/view?userId=${user?.id}`}
                  alt={selectedDocumentForImage.originalName}
                  width={2000}
                  height={2000}
                  className="absolute top-1/2 left-1/2 max-w-none shadow-2xl transition-transform duration-200 ease-out"
                  style={{
                    transform: `translate(-50%, -50%) translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageZoom})`,
                    transformOrigin: 'center center',
                    filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))'
                  }}
                  onError={(e: any) => {
                    e.currentTarget.style.display = 'none'
                    const loadingDiv = e.currentTarget.parentElement?.querySelector('.loading-indicator') as HTMLElement
                    if (loadingDiv) loadingDiv.style.display = 'none'
                    const errorDiv = e.currentTarget.parentElement?.querySelector('.error-message') as HTMLElement
                    if (errorDiv) errorDiv.style.display = 'flex'
                    toast({
                      title: "Image Loading Error",
                      description: `Failed to load document image: ${selectedDocumentForImage.originalName}`,
                      variant: "destructive"
                    })
                  }}
                  onLoad={() => {
                    const loadingDiv = imageRef.current?.parentElement?.querySelector('.loading-indicator') as HTMLElement
                    if (loadingDiv) loadingDiv.style.display = 'none'
                    const errorDiv = imageRef.current?.parentElement?.querySelector('.error-message') as HTMLElement
                    if (errorDiv) errorDiv.style.display = 'none'
                  }}
                  draggable={false}
                />
                
                {/* Error message */}
                <div className="error-message hidden absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center text-white bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md mx-4">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Image Loading Error</h3>
                    <p className="text-sm opacity-80 mb-4">Failed to load document image</p>
                    <div className="text-xs opacity-60 space-y-1">
                      <p>Document ID: {selectedDocumentForImage.id}</p>
                      <p>File: {selectedDocumentForImage.originalName}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => {
                        // Try to reload the image
                        const img = imageRef.current
                        if (img) {
                          const loadingDiv = img.parentElement?.querySelector('.loading-indicator') as HTMLElement
                          const errorDiv = img.parentElement?.querySelector('.error-message') as HTMLElement
                          if (loadingDiv) loadingDiv.style.display = 'flex'
                          if (errorDiv) errorDiv.style.display = 'none'
                          img.style.display = 'block'
                          img.src = img.src + '&t=' + Date.now() // Force reload
                        }
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            {/* Control hints */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg">
              <p>🖱️ Mouse wheel - zoom</p>
              <p>🖱️ Drag - move (when zoomed)</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAbnModalOpen} onOpenChange={setIsAbnModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ASIC Check - {selectedDocumentForAbn?.vendor || 'Unknown vendor'}</DialogTitle>
            <DialogDescription>ABR lookup details for the selected vendor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {isLoadingAbn ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Checking ABN...</p>
                </div>
              </div>
            ) : abnData ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">ABN:</span>
                      <span className="col-span-2">{abnData.Abn}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">Status:</span>
                      <span className="col-span-2">
                        <Badge variant={abnData.AbnStatus === 'Active' ? 'default' : 'destructive'}>
                          {abnData.AbnStatus === 'Active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">Activation Date:</span>
                      <span className="col-span-2">{abnData.AbnStatusEffectiveFrom || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">Entity Name:</span>
                      <span className="col-span-2">{abnData.EntityName || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">Entity Type:</span>
                      <span className="col-span-2">{abnData.EntityTypeName || abnData.EntityTypeCode || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">ACN:</span>
                      <span className="col-span-2">{abnData.Acn || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">GST Registration:</span>
                      <span className="col-span-2">
                        {abnData.Gst ? (
                          <Badge variant="default">Registered from {abnData.Gst}</Badge>
                        ) : (
                          <Badge variant="secondary">Not registered</Badge>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">Address:</span>
                      <span className="col-span-2">
                        {abnData.AddressState && abnData.AddressPostcode 
                          ? `${abnData.AddressState} ${abnData.AddressPostcode}` 
                          : '-'
                        }
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">Address Update Date:</span>
                      <span className="col-span-2">{abnData.AddressDate || '-'}</span>
                    </div>
                    {abnData.BusinessName && abnData.BusinessName.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 py-2">
                        <span className="font-medium">Business Names:</span>
                        <div className="col-span-2">
                          {abnData.BusinessName.map((name: string, index: number) => (
                            <Badge key={index} variant="outline" className="mr-2 mb-2">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">ABN data not loaded</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Xero Accounts Modal */}
      <Dialog open={showXeroAccountsModal} onOpenChange={setShowXeroAccountsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xero Accounts - {xeroTestResult?.tenantName}</DialogTitle>
            <DialogDescription>Chart of accounts retrieved from Xero for this tenant.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {xeroTestResult?.accounts && xeroTestResult.accounts.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Total accounts: {xeroTestResult.accountsCount}
                </div>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account ID</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tax Type</TableHead>
                        <TableHead>Bank Account Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {xeroTestResult.accounts.map((account: any, index: number) => (
                        <TableRow key={account.accountID || index}>
                          <TableCell className="font-mono text-xs">
                            {account.accountID || 'N/A'}
                          </TableCell>
                          <TableCell className="font-medium">
                            {account.code || 'N/A'}
                          </TableCell>
                          <TableCell>{account.name || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {account.type || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {account._class || account.class || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={account.status === 'ACTIVE' ? 'default' : 'secondary'}
                            >
                              {account.status || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{account.taxType || 'N/A'}</TableCell>
                          <TableCell>{account.bankAccountType || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Sample JSON Structure:</strong>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
{JSON.stringify(xeroTestResult.accounts[0], null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No accounts data available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Company Modal */}
      <Dialog open={isAddCompanyModalOpen} onOpenChange={setIsAddCompanyModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
          <DialogDescription>Enter details to create a new company</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-abn">ABN *</Label>
            <Input
              id="company-abn"
              value={newCompanyData.abn}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^\d]/g, '')
                setNewCompanyData({ ...newCompanyData, abn: formatAbnInput(digits) })
              }}
              onBlur={(e) => handleCompanyAbnBlur(e.target.value)}
              required
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                value={newCompanyData.name}
                disabled
                readOnly
                placeholder="Auto-filled from ABN"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-industry">Industry</Label>
              <Input
                id="company-industry"
                value={newCompanyData.industry}
                onChange={(e) => setNewCompanyData({...newCompanyData, industry: e.target.value})}
              />
            </div>
          </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-description">Description</Label>
              <Textarea
                id="company-description"
                value={newCompanyData.description}
                onChange={(e) => setNewCompanyData({...newCompanyData, description: e.target.value})}
                rows={3}
              />
            </div>
            
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input
                id="company-email"
                type="email"
                value={newCompanyData.email}
                onChange={(e) => setNewCompanyData({...newCompanyData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Phone *</Label>
              <Input
                id="company-phone"
                value={newCompanyData.phone}
                onChange={handleCompanyPhoneChange}
                inputMode="tel"
                required
              />
            </div>
          </div>
            
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={newCompanyData.website}
                onChange={(e) => setNewCompanyData({...newCompanyData, website: e.target.value})}
              />
            </div>
            <div className="space-y-2"></div>
          </div>
            
          <div className="space-y-2">
            <Label htmlFor="company-address">Address *</Label>
            <Input
              id="company-address"
              value={newCompanyData.address}
              onChange={(e) => setNewCompanyData({...newCompanyData, address: e.target.value})}
              required
            />
          </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {isCreatingCompany ? 'Creating...' : 'Create Company'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Digitized Document Confirmation Modal */}
      <Dialog open={isDeleteDigitizedModalOpen} onOpenChange={setIsDeleteDigitizedModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this digitized document? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={cancelDeleteDigitized}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDigitized}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>}>
      <DashboardContent />
    </Suspense>
  )
}

// Component for creating a new company
function CreateCompanyDialog({ onCompanyCreated }: { onCompanyCreated: (userData: UserData) => void }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [companyData, setCompanyData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    abn: '',
    industry: ''
  })
  const { toast } = useToast()

  const formatAbn2Input = (digits: string) => {
    const d = digits.replace(/[^\d]/g, '').slice(0, 11)
    const a = d.slice(0, 2)
    const b = d.slice(2, 5)
    const c = d.slice(5, 8)
    const e = d.slice(8, 11)
    return [a, b, c, e].filter(Boolean).join(' ')
  }

  const handleCompany2PhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/[^\d]/g, '')
    if (digits.startsWith('61')) digits = digits.slice(2)
    if (digits.startsWith('0')) digits = digits.slice(1)
    let formatted = '+61'
    if (digits.length > 0) {
      formatted += ' '
      const first = digits[0]
      if (first === '4') {
        const a = digits.slice(0, 1)
        const b = digits.slice(1, 4)
        const c = digits.slice(4, 7)
        const d = digits.slice(7, 10)
        formatted += a + (b ? ' ' + b : '') + (c ? ' ' + c : '') + (d ? ' ' + d : '')
      } else {
        const a = digits.slice(0, 1)
        const b = digits.slice(1, 5)
        const c = digits.slice(5, 9)
        formatted += a + (b ? ' ' + b : '') + (c ? ' ' + c : '')
      }
    }
    setCompanyData(prev => ({ ...prev, phone: formatted.trim() }))
  }

  const handleCompany2AbnBlur = async (abn: string) => {
    const clean = abn.replace(/[^\d]/g, '')
    if (!/^\d{11}$/.test(clean)) return
    try {
      const r = await fetch(`/api/vendors?abn=${clean}`, { credentials: 'include' })
      if (!r.ok) return
      const data = await r.json()
      const name = data.EntityName || (Array.isArray(data.BusinessName) ? (data.BusinessName[0] || '') : '')
      const addr = [data.AddressState || '', data.AddressPostcode || ''].join(' ').trim()
      setCompanyData(prev => ({
        ...prev,
        name: prev.name || name,
        address: prev.address || addr,
        abn: formatAbn2Input(clean)
      }))
    } catch {}
  }

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userData = localStorage.getItem('user')
      if (!userData) {
        toast({
          title: 'Error',
          description: 'User data not found. Please log in again.',
          variant: 'destructive'
        })
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...companyData,
          abn: companyData.abn.replace(/[^\d]/g, ''),
          userId: user.id
        }),
      })

      if (response.ok) {
        const payload = await response.json()
        const newCompany = payload?.company || payload
        if (!newCompany || !newCompany.id) {
          toast({ title: 'Error', description: 'Invalid response while creating company', variant: 'destructive' })
          return
        }
        toast({
          title: 'Success',
          description: 'Company created successfully!'
        })
        setIsOpen(false)
        try { localStorage.setItem('lastCompanyId', String(newCompany.id)) } catch {}
        window.location.href = `/dashboard?company=${newCompany.id}`
        return
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to create company',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error creating company:', error)
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Building className="h-4 w-4 mr-2" />
          Create Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
          <DialogDescription>Fill in ABN and details to create company</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-abn">ABN *</Label>
            <Input
              id="company-abn"
              value={companyData.abn}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^\d]/g, '')
                setCompanyData({ ...companyData, abn: formatAbn2Input(digits) })
              }}
              onBlur={(e) => handleCompany2AbnBlur(e.target.value)}
              required
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                value={companyData.name}
                disabled
                readOnly
                placeholder="Auto-filled from ABN"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-industry">Industry</Label>
              <Input
                id="company-industry"
                value={companyData.industry}
                onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-description">Description</Label>
            <Textarea
              id="company-description"
              value={companyData.description}
              onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input
                id="company-email"
                type="email"
                value={companyData.email}
                onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Phone *</Label>
              <Input
                id="company-phone"
                value={companyData.phone}
                onChange={handleCompany2PhoneChange}
                inputMode="tel"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={companyData.website}
                onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
              />
            </div>
            <div className="space-y-2"></div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-address">Address *</Label>
            <Input
              id="company-address"
              value={companyData.address}
              onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isLoading ? 'Creating...' : 'Create Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
