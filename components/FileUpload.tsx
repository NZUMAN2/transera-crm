// components/FileUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/use-toast'
import { 
  Upload, FileText, X, Download, Eye, 
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react'

interface FileUploadProps {
  candidateId: string
  onUploadComplete?: () => void
  maxFiles?: number
  allowedTypes?: string[]
}

interface UploadingFile {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
  error?: string
}

export default function FileUpload({ 
  candidateId, 
  onUploadComplete, 
  maxFiles = 10,
  allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [documentType, setDocumentType] = useState('cv')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const documentTypes = [
    { value: 'cv', label: 'CV/Resume' },
    { value: 'id', label: 'ID Document' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'contract', label: 'Contract' },
    { value: 'reference', label: 'Reference Letter' },
    { value: 'other', label: 'Other' }
  ]

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    // Validate file types
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase()
      return allowedTypes.includes(extension)
    })

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: `Only ${allowedTypes.join(', ')} files are allowed`,
        variant: "destructive"
      })
    }

    // Check file count limit
    if (uploadingFiles.length + validFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      })
      return
    }

    // Add files to uploading queue
    const newUploadingFiles = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadingFiles(prev => [...prev, ...newUploadingFiles])

    // Start uploading each file
    validFiles.forEach((file, index) => {
      uploadFile(file, uploadingFiles.length + index)
    })
  }

  const uploadFile = async (file: File, index: number) => {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${candidateId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage with progress tracking
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('candidate-documents')
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100
            updateFileProgress(index, percentage)
          }
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('candidate-documents')
        .getPublicUrl(fileName)

      // Save document record to database
      const { error: dbError } = await supabase
        .from('candidate_documents')
        .insert({
          candidate_id: candidateId,
          document_name: file.name,
          document_type: documentType,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type
        })

      if (dbError) throw dbError

      // Update file status to completed
      setUploadingFiles(prev => prev.map((f, i) => 
        i === index 
          ? { ...f, status: 'completed', progress: 100, url: urlData.publicUrl }
          : f
      ))

      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded successfully`
      })

      if (onUploadComplete) {
        onUploadComplete()
      }

    } catch (error) {
      console.error('Upload error:', error)
      
      setUploadingFiles(prev => prev.map((f, i) => 
        i === index 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
          : f
      ))

      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}`,
        variant: "destructive"
      })
    }
  }

  const updateFileProgress = (index: number, progress: number) => {
    setUploadingFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, progress } : f
    ))
  }

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index))
  }

  const openFile = (url: string) => {
    window.open(url, '_blank')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Type Selection */}
        <div>
          <Label htmlFor="document-type">Document Type</Label>
          <select
            id="document-type"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supported formats: {allowedTypes.join(', ')}
          </p>
          <p className="text-xs text-gray-400">
            Maximum {maxFiles} files, up to 10MB each
          </p>
          
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Uploading Files List */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Uploading Files</h4>
            {uploadingFiles.map((uploadingFile, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{uploadingFile.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadingFile.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadingFile.status === 'uploading' && (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    )}
                    {uploadingFile.status === 'completed' && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openFile(uploadingFile.url!)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </>
                    )}
                    {uploadingFile.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {uploadingFile.status === 'uploading' && (
                  <div className="space-y-1">
                    <Progress value={uploadingFile.progress} className="h-2" />
                    <p className="text-xs text-gray-500 text-right">
                      {Math.round(uploadingFile.progress)}%
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {uploadingFile.status === 'error' && (
                  <p className="text-sm text-red-600 mt-1">
                    {uploadingFile.error}
                  </p>
                )}

                {/* Success Message */}
                {uploadingFile.status === 'completed' && (
                  <div className="flex items-center mt-1">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Upload Complete
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Tips */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <h4 className="font-medium mb-2">Upload Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Files are automatically organized by document type</li>
            <li>• All uploads are secure and encrypted</li>
            <li>• Use clear, descriptive filenames</li>
            <li>• PDF format preferred for formal documents</li>
            <li>• Maximum file size: 10MB per file</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// components/DocumentViewer.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Download, Eye, Trash2, 
  CheckCircle, XCircle, Calendar
} from 'lucide-react'

interface Document {
  id: string
  document_name: string
  document_type: string
  file_url: string
  file_size: number
  uploaded_at: string
  is_verified: boolean
  user_profiles: { full_name: string }
}

interface DocumentViewerProps {
  documents: Document[]
  onDelete?: (documentId: string) => void
  onVerify?: (documentId: string, verified: boolean) => void
}

export function DocumentViewer({ documents, onDelete, onVerify }: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      cv: 'bg-blue-100 text-blue-800',
      id: 'bg-green-100 text-green-800',
      certificate: 'bg-purple-100 text-purple-800',
      qualification: 'bg-orange-100 text-orange-800',
      contract: 'bg-gray-100 text-gray-800',
      reference: 'bg-yellow-100 text-yellow-800',
      other: 'bg-pink-100 text-pink-800'
    }
    return colors[type as keyof typeof colors] || colors.other
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadFile = (document: Document) => {
    const link = document.createElement('a')
    link.href = document.file_url
    link.download = document.document_name
    link.click()
  }

  const viewFile = (document: Document) => {
    window.open(document.file_url, '_blank')
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4" />
            <p>No documents uploaded yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <Card key={document.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-3">
              <FileText className="w-8 h-8 text-purple-600" />
              <div className="flex items-center space-x-1">
                {document.is_verified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
                {onVerify && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onVerify(document.id, !document.is_verified)}
                    className="p-1 h-6"
                  >
                    {document.is_verified ? 'Unverify' : 'Verify'}
                  </Button>
                )}
              </div>
            </div>
            
            <h3 className="font-medium text-sm mb-1 line-clamp-2">
              {document.document_name}
            </h3>
            
            <div className="space-y-2 mb-3">
              <Badge className={getDocumentTypeColor(document.document_type)}>
                {document.document_type}
              </Badge>
              <p className="text-xs text-gray-500">
                {formatFileSize(document.file_size)}
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(document.uploaded_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                By {document.user_profiles?.full_name}
              </p>
            </div>
            
            <div className="flex space-x-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs"
                onClick={() => viewFile(document)}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs"
                onClick={() => downloadFile(document)}
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              {onDelete && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="px-2"
                  onClick={() => onDelete(document.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}