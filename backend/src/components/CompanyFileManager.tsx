'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  FileText, 
  Upload,
  Eye,
  Trash2,
  Download,
  ImageIcon,
  FileIcon
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

interface CompanyFileManagerProps {
  companyId: string
  documents: DocumentData[]
  onDocumentsChange: (documents: DocumentData[]) => void
}

export default function CompanyFileManager({ 
  companyId, 
  documents, 
  onDocumentsChange 
}: CompanyFileManagerProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('companyId', companyId)

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const newDocument = await response.json()
          onDocumentsChange([newDocument, ...documents])
          
          toast({
            title: 'File uploaded successfully',
            description: `${file.name} has been uploaded and is being processed.`,
          })
        } else {
          throw new Error('Upload failed')
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      // Reset the input
      event.target.value = ''
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDocumentsChange(documents.filter(doc => doc.id !== documentId))
        toast({
          title: 'Document deleted',
          description: 'The document has been successfully deleted.',
        })
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the document.',
        variant: 'destructive',
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'QUEUE':
        return <Badge variant="secondary">Queue</Badge>
      case 'PROCESSING':
        return <Badge variant="default">Processing</Badge>
      case 'DIGITIZED':
        return <Badge variant="default">Digitized</Badge>
      case 'ERROR':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileIcon className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Manager
            </CardTitle>
            <CardDescription>
              Upload and manage company documents for digitization
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents uploaded</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first document to get started with digitization
            </p>
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.mimeType)}
                        <div>
                          <div className="font-medium">{doc.originalName}</div>
                          {doc.vendor && (
                            <div className="text-sm text-muted-foreground">
                              Vendor: {doc.vendor}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                    <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Handle view document
                            console.log('View document:', doc.id)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}