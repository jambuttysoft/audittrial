'use client'

import { useState, useEffect } from 'react'
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
  AlertCircle
} from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CompanyFileManager from '@/components/CompanyFileManager'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<DocumentData[]>([])
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

  // Handle company parameter from URL
  useEffect(() => {
    const companyId = searchParams.get('company')
    if (companyId && companies.length > 0) {
      const company = companies.find(c => c.id === companyId)
      if (company) {
        setSelectedCompany(company)
        loadCompanyDocuments(company.id)
      }
    } else if (companies.length > 0 && !selectedCompany) {
      // Select first company by default
      setSelectedCompany(companies[0])
      loadCompanyDocuments(companies[0].id)
    }
  }, [searchParams, companies])

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
  }, [selectedCompany?.id, documents])

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

  const loadCompanies = async (userData: UserData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/companies?userId=${userData.id}`)
      if (response.ok) {
        const companiesData = await response.json()
        setCompanies(companiesData)
      } else {
        console.error('Failed to load companies')
      }
    } catch (error) {
      console.error('Error loading companies:', error)
    }
  }

  const loadCompanyDocuments = async (companyId: string) => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`http://localhost:3001/api/companies/${companyId}/files?userId=${user.id}`)
      if (response.ok) {
        const documentsData = await response.json()
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
        console.error('Failed to load company documents')
        setDocuments([])
      }
    } catch (error) {
      console.error('Error loading company documents:', error)
      setDocuments([])
    }
  }

  const handleCompanyUpdate = async () => {
    if (!editedCompany || !user?.id) return

    try {
      const response = await fetch(`http://localhost:3001/api/companies/${editedCompany.id}?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const checkAbnDetails = async (abn: string) => {
    setIsLoadingAbn(true)
    setAbnData(null)
    
    try {
      const response = await fetch(`http://localhost:3001/api/abn-lookup?abn=${abn}`)
      
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
      const response = await fetch(`http://localhost:3001/api/xero/status?userId=${user.id}`)
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
      const response = await fetch(`http://localhost:3001/api/xero/auth?userId=${user.id}`)
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
      const response = await fetch(`http://localhost:3001/api/xero/status?userId=${user.id}`, {
        method: 'DELETE'
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
      const response = await fetch(`http://localhost:3001/api/xero/test?userId=${user.id}`)
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
      const response = await fetch(`http://localhost:3001/api/xero/test?userId=${user.id}`)
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
          <div className="text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Company Selected</h3>
            <p className="text-muted-foreground">Select a company from the sidebar to view data</p>
          </div>
        </div>
      </div>
    )
  }

  const totalDocuments = documents.length
  const digitizedDocuments = documents.filter(doc => doc.status === 'DIGITIZED').length
  const queueDocuments = documents.filter(doc => doc.status === 'QUEUE').length
  const processingDocuments = documents.filter(doc => doc.status === 'PROCESSING').length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{selectedCompany.name}</h2>
          <p className="text-muted-foreground">{selectedCompany.description}</p>
        </div>
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
            <div className="text-2xl font-bold">{digitizedDocuments}</div>
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
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          <CompanyFileManager 
            companyId={selectedCompany.id} 
            documents={documents}
            onDocumentsChange={setDocuments}
          />
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Purchase Date</TableHead>
                    <TableHead className="w-[150px]">Vendor Name</TableHead>
                    <TableHead className="w-[120px]">Vendor ABN</TableHead>
                    <TableHead className="w-[200px]">Vendor Address</TableHead>
                    <TableHead className="w-[100px]">Document Type</TableHead>
                    <TableHead className="w-[140px]">Receipt/Invoice Number</TableHead>
                    <TableHead className="w-[100px]">Payment Type</TableHead>
                    <TableHead className="text-right w-[130px]">Amount Excl. Tax</TableHead>
                    <TableHead className="text-right w-[130px]">Tax Amount (GST)</TableHead>
                    <TableHead className="text-right w-[120px]">Total Amount</TableHead>
                    <TableHead className="w-[140px]">Expense Category</TableHead>
                    <TableHead className="w-[80px]">Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.filter(doc => doc.status === 'DIGITIZED').map((doc) => {
                    const receiptData = doc.receiptData || {}
                    const totalAmount = typeof doc.totalAmount === 'number' ? doc.totalAmount : typeof doc.totalAmount === 'string' ? parseFloat(doc.totalAmount) : 0
                    const gstAmount = typeof doc.gstAmount === 'number' ? doc.gstAmount : typeof doc.gstAmount === 'string' ? parseFloat(doc.gstAmount) : 0
                    const subtotal = doc.totalAmount && doc.gstAmount ? (totalAmount - gstAmount) : null
                    
                    return (
                      <TableRow 
                        key={doc.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedDocumentForJson(doc)
                          setIsJsonModalOpen(true)
                        }}
                      >
                        <TableCell>{doc.transactionDate ? formatDate(doc.transactionDate) : '-'}</TableCell>
                        <TableCell className="font-medium">{doc.vendor || receiptData.vendor || '-'}</TableCell>
                        <TableCell>{doc.abn || receiptData.abn || '-'}</TableCell>
                        <TableCell>{receiptData.address || receiptData.vendorAddress || '-'}</TableCell>
                        <TableCell>{doc.documentType || receiptData.documentType || 'Receipt'}</TableCell>
                        <TableCell>{receiptData.invoiceNumber || receiptData.receiptNumber || '-'}</TableCell>
                        <TableCell>{doc.paymentMethod || receiptData.paymentMethod || '-'}</TableCell>
                        <TableCell className="text-right font-bold">{subtotal ? subtotal.toFixed(2) : '-'}</TableCell>
                        <TableCell className="text-right font-bold">{doc.gstAmount && typeof doc.gstAmount === 'number' ? doc.gstAmount.toFixed(2) : doc.gstAmount && typeof doc.gstAmount === 'string' ? parseFloat(doc.gstAmount).toFixed(2) : '-'}</TableCell>
                        <TableCell className="text-right font-bold">{doc.totalAmount && typeof doc.totalAmount === 'number' ? doc.totalAmount.toFixed(2) : doc.totalAmount && typeof doc.totalAmount === 'string' ? parseFloat(doc.totalAmount).toFixed(2) : '-'}</TableCell>
                        <TableCell>{receiptData.category || receiptData.expenseCategory || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={doc.gstAmount ? 'default' : 'secondary'}>
                            {doc.gstAmount ? 'Included' : 'No GST'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedDocumentForImage(doc)
                                setIsImageModalOpen(true)
                              }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const abn = doc.abn || doc.receiptData?.abn
                                    if (abn) {
                                      setSelectedDocumentForAbn(doc)
                                      setIsAbnModalOpen(true)
                                      checkAbnDetails(abn)
                                    } else {
                                      toast({
                                        title: 'ABN not found',
                                        description: 'The document does not contain an ABN for verification',
                                        variant: 'destructive'
                                      })
                                    }
                                  }}
                                >
                                  <Search className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Check Vendor</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Here will be the logic for creating Xero Journal Record
                                    toast({
                                      title: 'Xero Journal Record',
                                      description: 'Xero Journal Record creation feature will be implemented',
                                    })
                                  }}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Create Xero Journal Record</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                  })}
                </TableBody>
              </Table>
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
                        <div className="text-2xl font-bold">{digitizedDocuments}</div>
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

      {/* Modal for displaying image */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Document Preview - {selectedDocumentForImage?.originalName}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center">
            {selectedDocumentForImage && (
              <img 
                src={`http://localhost:3001/api/files/${selectedDocumentForImage.id}/view?userId=${user?.id}`}
                alt={selectedDocumentForImage.originalName}
                className="max-w-full max-h-[70vh] object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const errorDiv = e.currentTarget.nextElementSibling as HTMLElement
                  if (errorDiv) errorDiv.style.display = 'flex'
                }}
              />
            )}
            <div className="hidden w-full h-64 flex items-center justify-center bg-muted rounded">
              <div className="text-center">
                <FileIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Failed to load image</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAbnModalOpen} onOpenChange={setIsAbnModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor Check - {selectedDocumentForAbn?.vendor || 'Unknown vendor'}</DialogTitle>
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


      
      <Toaster />
    </div>
  )
}