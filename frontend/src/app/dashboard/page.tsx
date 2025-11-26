'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRef } from 'react'

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
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [digitizedDocuments, setDigitizedDocuments] = useState<DigitizedData[]>([])
  const [reviewDocuments, setReviewDocuments] = useState<DigitizedData[]>([])
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
    // Check user authorization
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
  }, [])

  // Handle company parameter from URL and auto-refresh data
  useEffect(() => {
    const companyId = searchParams.get('company')
    if (companyId && companies.length > 0) {
      const company = companies.find(c => c.id === companyId)
      if (company && company.id !== selectedCompany?.id) {
        handleCompanyChange(company)
      }
    } else if (companies.length > 0 && !selectedCompany) {
      // Select first company by default
      handleCompanyChange(companies[0])
    }
  }, [searchParams, companies.length])

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
  }, [selectedCompany?.id, documents.length])

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
  }, [user?.id, selectedCompany?.id])

  const loadDashboardData = async (userData: UserData) => {
    try {
      // Load companies
      await loadCompanies(userData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompanyChange = async (company: Company) => {
    try {
      setSelectedCompany(company)
      // Update URL to reflect the selected company
      const newUrl = `/dashboard?company=${company.id}`
      window.history.pushState({}, '', newUrl)
      // Load documents and digitized documents for the selected company
      await Promise.all([
        loadCompanyDocuments(company.id),
        loadDigitizedDocuments(company.id),
        loadReviewDocuments(company.id)
      ])
      // Refresh companies data to get updated document counts
      if (user) {
        await loadCompanies(user)
      }
    } catch (error) {
      console.error('Error changing company:', error)
    }
  }

  const loadCompanies = async (userData: UserData) => {
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
  }

  const loadCompanyDocuments = async (companyId: string) => {
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
        
        // Check if the number of digitized documents has increased
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
  }

  const loadDigitizedDocuments = async (companyId: string) => {
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
  }

  const loadReviewDocuments = async (companyId: string) => {
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
  }

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
          userId: user.id
        }),
      })

      if (response.ok) {
        const newCompany = await response.json()
        setCompanies(prev => [newCompany, ...prev])
        
        toast({
          title: 'Success',
          description: 'Company created successfully!'
        })
        
        // Close modal and reset form
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
        
        // Navigate to the new company using optimized handler
        handleCompanyChange(newCompany)
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
    localStorage.removeItem('user')
    window.location.href = '/auth'
  }

  // File upload functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileUpload(files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || [])
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
        description: 'Digitized document deleted successfully',
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
      const response = await fetch(`/api/abn-lookup?abn=${abn}`, {
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

  // Xero integration functions
  const checkXeroStatus = async () => {
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
  }

  const handleXeroConnect = async () => {
    if (!user?.id) return
    
    setIsLoadingXero(true)
    try {
      const response = await fetch(`/api/xero/auth?userId=${user.id}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const { consentUrl } = await response.json()
        window.open(consentUrl, '_blank', 'width=600,height=700')
        
        // Poll for connection status
        const pollInterval = setInterval(async () => {
          await checkXeroStatus()
          if (xeroStatus.connected) {
            clearInterval(pollInterval)
            toast({
              title: 'Xero Connected!',
              description: `Successfully connected to ${xeroStatus.tenantName}`,
            })
          }
        }, 2000)
        
        // Stop polling after 2 minutes
        setTimeout(() => clearInterval(pollInterval), 120000)
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
  }, [user?.id])

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Statistics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Documents uploaded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digitized</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{digitizedCount}</div>
            <p className="text-xs text-muted-foreground">
              Processed documents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Queue</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingDocuments}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="digitized">Digitized</TabsTrigger>
          <TabsTrigger value="review">For Review</TabsTrigger>
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
                    disabled={isUploading}
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
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="mb-4 border-2 border-dashed rounded-md p-4 text-center text-sm text-muted-foreground"
              >
                Drag & drop files here or click Choose Files
              </div>
              <TooltipProvider>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          {doc.mimeType.startsWith('image/') ? (
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <img 
                                src={`/api/files/${doc.id}/view?userId=${user?.id}`}
                                alt={doc.originalName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>'
                                  }
                                }}
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
                      </TableCell>
                      <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                      <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            doc.status === 'DIGITIZED'
                              ? 'default'
                              : doc.status === 'PROCESSING'
                              ? 'secondary'
                              : doc.status === 'ERROR'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {doc.mimeType.startsWith('image/') && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
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
                                    setSelectedDocumentForImage(doc)
                                    setIsImageModalOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Image</p>
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
                                  disabled={digitizingDocuments.has(doc.id)}
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
                              <p>Delete Document</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {documents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No documents uploaded yet. Upload your first document above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                </Table>
              </TooltipProvider>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>For Review</CardTitle>
              <CardDescription>
                Items moved from Digitized for manual review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const columns: ColumnDef<DigitizedData>[] = [
                  { accessorKey: 'purchaseDate', header: 'Purchase Date', cell: ({ row }) => <TruncatedCell text={row.original.purchaseDate ? formatDate(row.original.purchaseDate) : '-'} /> },
                  { accessorKey: 'vendorName', header: 'Vendor Name', cell: ({ row }) => <TruncatedCell text={row.original.vendorName || '-'} /> },
                  { accessorKey: 'vendorAbn', header: 'Vendor ABN', cell: ({ row }) => <TruncatedCell text={row.original.vendorAbn || '-'} /> },
                  { accessorKey: 'cashOutAmount', header: 'Cash Out', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.cashOutAmount === 'number' ? row.original.cashOutAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'discountAmount', header: 'Discount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.discountAmount === 'number' ? row.original.discountAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'amountExclTax', header: 'Amount Excl. Tax', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.amountExclTax === 'number' ? row.original.amountExclTax : 0).toFixed(2)} /> },
                  { accessorKey: 'taxAmount', header: 'Tax Amount (GST)', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.taxAmount === 'number' ? row.original.taxAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'totalAmount', header: 'Total Amount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.totalAmount === 'number' ? row.original.totalAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'taxStatus', header: 'Status', cell: ({ row }) => <Badge variant="secondary">{row.original.taxStatus || '-'}</Badge> },
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
                              View Image
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }
                  },
                ]

                const defaultVisible = [
                  'purchaseDate', 'vendorName', 'vendorAbn',
                  'cashOutAmount', 'discountAmount', 'amountExclTax',
                  'taxAmount', 'totalAmount', 'taxStatus', 'actions'
                ]
                const key = user?.id ? `review_columns_visibility:${user.id}` : undefined
                return (
                  <DataTable 
                    columns={columns} 
                    data={reviewDocuments} 
                    defaultVisibleColumnIds={defaultVisible} 
                    storageKey={key}
                    onRowClick={(row) => {
                      const doc = row.original
                      if (!user?.id) {
                        toast({ title: 'Not signed in', description: 'Please sign in to view images.', variant: 'destructive' })
                        return
                      }
                      const imageId = doc.originalDocumentId || (doc as any).id
                      const docForModal = { 
                        ...doc, 
                        id: imageId, 
                        status: 'DIGITIZED' as const, 
                        uploadDate: doc.createdAt, 
                        transactionDate: doc.purchaseDate, 
                        vendor: doc.vendorName, 
                        abn: doc.vendorAbn, 
                        gstAmount: doc.taxAmount, 
                        paymentMethod: doc.paymentType, 
                        receiptData: (doc as any).extractedData 
                      }
                      setSelectedDocumentForImage(docForModal)
                      setIsImageModalOpen(true)
                    }}
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
                  { accessorKey: 'vendorName', header: 'Vendor Name', cell: ({ row }) => <TruncatedCell text={row.original.vendorName || '-'} /> },
                  { accessorKey: 'vendorAbn', header: 'Vendor ABN', cell: ({ row }) => <TruncatedCell text={row.original.vendorAbn || '-'} /> },
                  { accessorKey: 'documentType', header: 'Document Type', cell: ({ row }) => <TruncatedCell text={row.original.documentType || 'Receipt'} /> },
                  { accessorKey: 'receiptNumber', header: 'Receipt/Invoice Number', cell: ({ row }) => <TruncatedCell text={row.original.receiptNumber || '-'} /> },
                  { accessorKey: 'paymentType', header: 'Payment Type', cell: ({ row }) => <TruncatedCell text={row.original.paymentType || '-'} /> },
                  { accessorKey: 'cashOutAmount', header: 'Cash Out', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.cashOutAmount === 'number' ? row.original.cashOutAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'discountAmount', header: 'Discount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.discountAmount === 'number' ? row.original.discountAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'amountExclTax', header: 'Amount Excl. Tax', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.amountExclTax === 'number' ? row.original.amountExclTax : 0).toFixed(2)} /> },
                  { accessorKey: 'taxAmount', header: 'Tax Amount (GST)', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.taxAmount === 'number' ? row.original.taxAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'totalAmount', header: 'Total Amount', meta: { headerClassName: 'text-right', cellClassName: 'text-right font-bold' }, cell: ({ row }) => <TruncatedCell text={(typeof row.original.totalAmount === 'number' ? row.original.totalAmount : 0).toFixed(2)} /> },
                  { accessorKey: 'expenseCategory', header: 'Expense Category', cell: ({ row }) => <TruncatedCell text={row.original.expenseCategory || '-'} /> },
                  { accessorKey: 'taxStatus', header: 'Status', cell: ({ row }) => <Badge variant="secondary">{row.original.taxStatus || '-'}</Badge> },
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
                                const imageId = doc.originalDocumentId || doc.id
                                const docForModal = { ...doc, id: imageId, status: 'DIGITIZED' as const, uploadDate: doc.createdAt, transactionDate: doc.purchaseDate, vendor: doc.vendorName, abn: doc.vendorAbn, gstAmount: doc.taxAmount, paymentMethod: doc.paymentType, receiptData: doc.extractedData }
                                setSelectedDocumentForImage(docForModal)
                                setIsImageModalOpen(true)
                              }}
                            >
                              View Image
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
                              Check Vendor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toast({ title: 'Xero Journal Record', description: 'Xero Journal Record creation feature will be implemented' })
                              }}
                            >
                              Create Xero Journal Record
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDeleteDigitizedClick(doc.id)
                              }}
                              className="text-destructive"
                            >
                              Delete Document
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }
                  },
                ]

                const defaultVisible = [
                  'purchaseDate', 'vendorName', 'vendorAbn',
                  'cashOutAmount', 'discountAmount', 'amountExclTax',
                  'taxAmount', 'totalAmount', 'taxStatus', 'actions'
                ]
                const key = user?.id ? `digitized_columns_visibility:${user.id}` : undefined
                return (
                  <DataTable 
                    columns={columns} 
                    data={digitizedDocuments} 
                    defaultVisibleColumnIds={defaultVisible} 
                    storageKey={key}
                    onRowClick={(row) => {
                      const doc = row.original
                      if (!user?.id) {
                        toast({ title: 'Not signed in', description: 'Please sign in to view images.', variant: 'destructive' })
                        return
                      }
                      const imageId = doc.originalDocumentId || doc.id
                      const docForModal = { 
                        ...doc, 
                        id: imageId, 
                        status: 'DIGITIZED' as const, 
                        uploadDate: doc.createdAt, 
                        transactionDate: doc.purchaseDate, 
                        vendor: doc.vendorName, 
                        abn: doc.vendorAbn, 
                        gstAmount: doc.taxAmount, 
                        paymentMethod: doc.paymentType, 
                        receiptData: doc.extractedData 
                      }
                      setSelectedDocumentForImage(docForModal)
                      setIsImageModalOpen(true)
                    }}
                  />
                )
              })()}
            </CardContent>
          </Card>
          
          {/* Xero Integration Card */}
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
                  
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={handleXeroDisconnect}
                      disabled={isLoadingXero || isTestingXero}
                      variant="outline"
                      size="sm"
                    >
                      <Unlink className="h-4 w-4 mr-2" />
                      {isLoadingXero ? 'Disconnecting...' : 'Disconnect'}
                    </Button>
                    <Button
                      onClick={handleXeroConnect}
                      disabled={isLoadingXero || isTestingXero}
                      variant="outline"
                      size="sm"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Reconnect
                    </Button>
                    <Button
                      onClick={handleXeroTest}
                      disabled={isLoadingXero || isTestingXero}
                      variant="default"
                      size="sm"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {isTestingXero ? 'Testing...' : 'Test Connection'}
                    </Button>
                    <Button
                      onClick={handleGetXeroAccounts}
                      disabled={isLoadingXero || isTestingXero}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {isTestingXero ? 'Loading...' : 'Get Accounts'}
                    </Button>

                  </div>
                  
                  {/* Test Results */}
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
                          <Button
                            onClick={() => setShowXeroAccountsModal(true)}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                          >
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
                  <p className="text-sm text-muted-foreground">
                    Connect your Xero account to automatically sync invoices, expenses, and other financial data.
                  </p>
                  <Button
                    onClick={handleXeroConnect}
                    disabled={isLoadingXero}
                    className="w-full sm:w-auto"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    {isLoadingXero ? 'Connecting...' : 'Connect to Xero'}
                  </Button>
                </div>
              )}
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
                
                <img 
                  ref={imageRef}
                  src={`/api/files/${selectedDocumentForImage.id}/view?userId=${user?.id}`}
                  alt={selectedDocumentForImage.originalName}
                  className="absolute top-1/2 left-1/2 max-w-none shadow-2xl transition-transform duration-200 ease-out"
                  style={{
                    transform: `translate(-50%, -50%) translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageZoom})`,
                    transformOrigin: 'center center',
                    filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))'
                  }}
                  onError={(e) => {
                    console.error('Image loading error for document:', selectedDocumentForImage.id)
                    console.error('Image URL:', e.currentTarget.src)
                    
                    // Hide image and loading indicator
                    e.currentTarget.style.display = 'none'
                    const loadingDiv = e.currentTarget.parentElement?.querySelector('.loading-indicator') as HTMLElement
                    if (loadingDiv) loadingDiv.style.display = 'none'
                    
                    // Show error message
                    const errorDiv = e.currentTarget.parentElement?.querySelector('.error-message') as HTMLElement
                    if (errorDiv) {
                      errorDiv.style.display = 'flex'
                    }
                    
                    toast({
                      title: "Image Loading Error",
                      description: `Failed to load document image: ${selectedDocumentForImage.originalName}`,
                      variant: "destructive"
                    })
                  }}
                  onLoad={() => {
                    console.log('Image successfully loaded for document:', selectedDocumentForImage.id)
                    
                    // Hide loading indicator
                    const loadingDiv = imageRef.current?.parentElement?.querySelector('.loading-indicator') as HTMLElement
                    if (loadingDiv) loadingDiv.style.display = 'none'
                    
                    // Hide error message if it was shown
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
            <DialogTitle>Vendor Check - {selectedDocumentForAbn?.vendor || 'Unknown vendor'}</DialogTitle>
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
          </DialogHeader>
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={newCompanyData.name}
                  onChange={(e) => setNewCompanyData({...newCompanyData, name: e.target.value})}
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
                <Label htmlFor="company-phone">Phone</Label>
                <Input
                  id="company-phone"
                  value={newCompanyData.phone}
                  onChange={(e) => setNewCompanyData({...newCompanyData, phone: e.target.value})}
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
              <div className="space-y-2">
                <Label htmlFor="company-abn">ABN</Label>
                <Input
                  id="company-abn"
                  value={newCompanyData.abn}
                  onChange={(e) => setNewCompanyData({...newCompanyData, abn: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-address">Address</Label>
              <Input
                id="company-address"
                value={newCompanyData.address}
                onChange={(e) => setNewCompanyData({...newCompanyData, address: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingCompany}>
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
          userId: user.id
        }),
      })

      if (response.ok) {
        const newCompany = await response.json()
        toast({
          title: 'Success',
          description: 'Company created successfully!'
        })
        setIsOpen(false)
        onCompanyCreated(user)
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
        </DialogHeader>
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                value={companyData.name}
                onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
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
              <Label htmlFor="company-phone">Phone</Label>
              <Input
                id="company-phone"
                value={companyData.phone}
                onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
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
            <div className="space-y-2">
              <Label htmlFor="company-abn">ABN</Label>
              <Input
                id="company-abn"
                value={companyData.abn}
                onChange={(e) => setCompanyData({...companyData, abn: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-address">Address</Label>
            <Input
              id="company-address"
              value={companyData.address}
              onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
