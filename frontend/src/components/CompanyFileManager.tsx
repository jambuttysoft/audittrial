'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Upload, FileText, ImageIcon, Loader2 } from 'lucide-react'

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
  userId: string
  onDocumentsUpdate: () => void
}

export default function CompanyFileManager({ companyId, userId, onDocumentsUpdate }: CompanyFileManagerProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload only images (JPEG, PNG, GIF) or PDF files.',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload files smaller than 10MB.',
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)
      formData.append('companyId', companyId)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: 'File uploaded successfully',
          description: `${file.name} has been uploaded and queued for processing.`,
        })
        onDocumentsUpdate()
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const errorData = await response.json()
        toast({
          title: 'Upload failed',
          description: errorData.error || 'Failed to upload file',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload error',
        description: 'Network error occurred during upload',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Upload receipts, invoices, and other business documents for digitization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleChange}
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-8 w-8" />
                <ImageIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports: JPEG, PNG, GIF, PDF (max 10MB)
                </p>
              </div>
              <Button onClick={onButtonClick} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>• Uploaded documents will be automatically processed using AI</p>
          <p>• Processing typically takes 1-2 minutes</p>
          <p>• You&apos;ll be notified when digitization is complete</p>
        </div>
      </CardContent>
    </Card>
  )
}
