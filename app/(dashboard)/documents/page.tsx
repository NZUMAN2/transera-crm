'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  category: string
  uploadedBy: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [])

  function loadDocuments() {
    const saved = localStorage.getItem('uploaded_documents')
    if (saved) {
      setDocuments(JSON.parse(saved))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
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

  const handleFiles = (files: FileList) => {
    const newDocs: Document[] = []
    
    Array.from(files).forEach(file => {
      const doc: Document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        uploadDate: new Date().toISOString(),
        category: getFileCategory(file.name),
        uploadedBy: 'Current User'
      }
      newDocs.push(doc)
    })

    const updated = [...documents, ...newDocs]
    setDocuments(updated)
    localStorage.setItem('uploaded_documents', JSON.stringify(updated))
    alert(`Successfully uploaded ${files.length} document(s)`)
  }

  const getFileCategory = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    if (['pdf', 'doc', 'docx'].includes(ext || '')) return 'CV/Resume'
    if (['xls', 'xlsx'].includes(ext || '')) return 'Spreadsheet'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'Image'
    return 'Other'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const deleteDocument = (id: string) => {
    if (confirm('Delete this document?')) {
      const updated = documents.filter(d => d.id !== id)
      setDocuments(updated)
      localStorage.setItem('uploaded_documents', JSON.stringify(updated))
    }
  }

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.category === filter
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const categories = ['all', 'CV/Resume', 'Spreadsheet', 'Image', 'Other']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Document Management 📁
          </h1>
          <p className="text-gray-600 mt-1">Upload, manage and organize your documents</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
        >
          📤 Upload Documents
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4">
          <div className="text-2xl mb-2">📄</div>
          <div className="text-2xl font-bold">{documents.length}</div>
          <div className="text-sm text-gray-600">Total Documents</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-2xl font-bold">
            {formatFileSize(documents.reduce((acc, doc) => acc + doc.size, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Size</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-2xl mb-2">📝</div>
          <div className="text-2xl font-bold">
            {documents.filter(d => d.category === 'CV/Resume').length}
          </div>
          <div className="text-sm text-gray-600">CVs/Resumes</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-2xl font-bold">Today</div>
          <div className="text-sm text-gray-600">Last Upload</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === cat
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDocs.map(doc => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">
                {doc.type.includes('pdf') ? '📄' :
                 doc.type.includes('doc') ? '📝' :
                 doc.type.includes('sheet') ? '📊' :
                 doc.type.includes('image') ? '🖼️' : '📎'}
              </div>
              <button
                onClick={() => deleteDocument(doc.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
            <h3 className="font-semibold text-sm mb-1 truncate">{doc.name}</h3>
            <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
            <p className="text-xs text-gray-500">
              {new Date(doc.uploadDate).toLocaleDateString()}
            </p>
            <div className="mt-3 flex gap-2">
              <button className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                View
              </button>
              <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Download
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full"
          >
            <h3 className="text-xl font-bold mb-4">Upload Documents</h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-4xl mb-4">📤</div>
              <p className="text-gray-600 mb-4">
                Drag and drop files here or
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer hover:bg-purple-600"
              >
                Browse Files
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Supported: PDF, DOC, DOCX, XLS, XLSX, Images
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}