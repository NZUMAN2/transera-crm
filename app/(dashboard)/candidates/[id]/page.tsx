// app/(dashboard)/candidates/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { 
  User, FileText, Upload, Mail, Phone, MapPin, 
  Building, Calendar, Star, Download, Eye, Trash2,
  Plus, Edit, Save, X, CheckCircle, AlertCircle
} from 'lucide-react'

interface Candidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  current_company: string
  job_title: string
  years_experience: number
  experience_level: string
  status: string
  created_at: string
}

interface CandidateNote {
  id: string
  note_content: string
  note_type: string
  note_date: string
  is_important: boolean
  created_by: string
  created_at: string
  user_profiles: { full_name: string }
}

interface CandidateDocument {
  id: string
  document_name: string
  document_type: string
  file_url: string
  file_size: number
  uploaded_at: string
  is_verified: boolean
  user_profiles: { full_name: string }
}

interface CandidateReference {
  id: string
  reference_type: string
  reference_name: string
  company_name: string
  contact_phone: string
  contact_email: string
  reference_status: string
  background_check_status: string
  created_at: string
}

interface PreScreening {
  current_ctc: number
  expected_ctc: number
  willing_to_relocate: boolean
  age: number
  race: string
  marital_status: string
  dependents: number
  has_drivers_license: boolean
  education_level: string
  pre_screen_status: string
}

export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [notes, setNotes] = useState<CandidateNote[]>([])
  const [documents, setDocuments] = useState<CandidateDocument[]>([])
  const [references, setReferences] = useState<CandidateReference[]>([])
  const [prescreening, setPrescreening] = useState<PreScreening | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState('general')
  const [isImportant, setIsImportant] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('cv')

  const supabase = createClient()

  useEffect(() => {
    fetchCandidateData()
  }, [params.id])

  const fetchCandidateData = async () => {
    try {
      // Fetch candidate basic info
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', params.id)
        .single()

      if (candidateError) throw candidateError
      setCandidate(candidateData)

      // Fetch notes
      const { data: notesData, error: notesError } = await supabase
        .from('candidate_notes')
        .select(`
          *,
          user_profiles (full_name)
        `)
        .eq('candidate_id', params.id)
        .order('created_at', { ascending: false })

      if (!notesError) setNotes(notesData || [])

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('candidate_documents')
        .select(`
          *,
          user_profiles (full_name)
        `)
        .eq('candidate_id', params.id)
        .order('uploaded_at', { ascending: false })

      if (!documentsError) setDocuments(documentsData || [])

      // Fetch references
      const { data: referencesData, error: referencesError } = await supabase
        .from('candidate_references')
        .select('*')
        .eq('candidate_id', params.id)
        .order('created_at', { ascending: false })

      if (!referencesError) setReferences(referencesData || [])

      // Fetch prescreening data
      const { data: prescreeningData, error: prescreeningError } = await supabase
        .from('candidate_prescreening')
        .select('*')
        .eq('candidate_id', params.id)
        .single()

      if (!prescreeningError) setPrescreening(prescreeningData)

    } catch (error) {
      console.error('Error fetching candidate data:', error)
      toast({
        title: "Error",
        description: "Failed to load candidate data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    try {
      const { error } = await supabase
        .from('candidate_notes')
        .insert({
          candidate_id: params.id,
          note_content: newNote,
          note_type: noteType,
          is_important: isImportant
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Note added successfully"
      })

      setNewNote('')
      setIsImportant(false)
      fetchCandidateData()
    } catch (error) {
      console.error('Error adding note:', error)
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive"
      })
    }
  }

  const uploadDocument = async () => {
    if (!uploadedFile) return

    try {
      // Upload to Supabase Storage
      const fileName = `${params.id}/${Date.now()}-${uploadedFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('candidate-documents')
        .upload(fileName, uploadedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('candidate-documents')
        .getPublicUrl(fileName)

      // Save document record
      const { error: dbError } = await supabase
        .from('candidate_documents')
        .insert({
          candidate_id: params.id,
          document_name: uploadedFile.name,
          document_type: documentType,
          file_url: urlData.publicUrl,
          file_size: uploadedFile.size,
          mime_type: uploadedFile.type
        })

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      })

      setUploadedFile(null)
      fetchCandidateData()
    } catch (error) {
      console.error('Error uploading document:', error)
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      })
    }
  }

  const sendJobSpecEmail = async (jobId: string) => {
    try {
      // This would integrate with your email service
      const response = await fetch('/api/send-job-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: params.id,
          jobId: jobId,
          candidateEmail: candidate?.email
        })
      })

      if (!response.ok) throw new Error('Failed to send email')

      toast({
        title: "Success",
        description: "Job specification sent successfully"
      })
    } catch (error) {
      console.error('Error sending email:', error)
      toast({
        title: "Error",
        description: "Failed to send job specification",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  if (!candidate) {
    return <div className="flex items-center justify-center h-96">Candidate not found</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {candidate.first_name} {candidate.last_name}
              </h1>
              <p className="text-gray-600">{candidate.job_title} at {candidate.current_company}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {candidate.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {candidate.phone}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {candidate.location}
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge variant={candidate.status === 'active' ? 'default' : 'secondary'}>
              {candidate.status}
            </Badge>
            <Badge variant="outline">
              {candidate.experience_level}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
          <TabsTrigger value="prescreening">Pre-screening</TabsTrigger>
          <TabsTrigger value="emails">Email Actions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Experience</Label>
                  <p className="text-sm text-gray-600">{candidate.years_experience} years</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Level</Label>
                  <p className="text-sm text-gray-600">{candidate.experience_level}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-gray-600">{candidate.status}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Current Employment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm text-gray-600">{candidate.current_company}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Position</Label>
                  <p className="text-sm text-gray-600">{candidate.job_title}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-gray-600">{notes.length} notes</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Documents</Label>
                  <p className="text-sm text-gray-600">{documents.length} files</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">References</Label>
                  <p className="text-sm text-gray-600">{references.length} references</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <div className="space-y-6">
            {/* Add New Note */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="note-type">Note Type</Label>
                    <select
                      id="note-type"
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="general">General</option>
                      <option value="pre_screen">Pre-screening Call</option>
                      <option value="interview">Interview</option>
                      <option value="reference">Reference Check</option>
                      <option value="background_check">Background Check</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="important"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="important">Mark as Important</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="note-content">Note Content</Label>
                  <Textarea
                    id="note-content"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                    rows={3}
                  />
                </div>
                <Button onClick={addNote} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </CardContent>
            </Card>

            {/* Notes List */}
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className={note.is_important ? 'border-yellow-400' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{note.note_type}</Badge>
                          {note.is_important && (
                            <Badge variant="default" className="bg-yellow-500">
                              <Star className="w-3 h-3 mr-1" />
                              Important
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-900 mb-2">{note.note_content}</p>
                        <p className="text-sm text-gray-500">
                          By {note.user_profiles?.full_name} on {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="space-y-6">
            {/* Upload Document */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Document
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="document-type">Document Type</Label>
                    <select
                      id="document-type"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="cv">CV/Resume</option>
                      <option value="id">ID Document</option>
                      <option value="certificate">Certificate</option>
                      <option value="qualification">Qualification</option>
                      <option value="contract">Contract</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="document-file">Select File</Label>
                    <Input
                      id="document-file"
                      type="file"
                      onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
                <Button 
                  onClick={uploadDocument} 
                  disabled={!uploadedFile}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>

            {/* Documents List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <FileText className="w-8 h-8 text-purple-600" />
                      {doc.is_verified && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-1">{doc.document_name}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {doc.document_type} • {(doc.file_size / 1024).toFixed(1)} KB
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="references">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employment References & Background Checks</CardTitle>
                <p className="text-sm text-gray-600">
                  Manage employer references and background verification for this candidate
                </p>
              </CardHeader>
              <CardContent>
                <Button className="mb-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reference
                </Button>
                
                <div className="space-y-4">
                  {references.map((ref) => (
                    <Card key={ref.id}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Reference Details</Label>
                            <p className="text-sm">{ref.reference_name}</p>
                            <p className="text-sm text-gray-600">{ref.company_name}</p>
                            <p className="text-sm text-gray-600">{ref.contact_email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Badge variant={ref.reference_status === 'completed' ? 'default' : 'secondary'}>
                              {ref.reference_status}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Background Check</Label>
                            <Badge variant={ref.background_check_status === 'clear' ? 'default' : 'secondary'}>
                              {ref.background_check_status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pre-screening Tab */}
        <TabsContent value="prescreening">
          <Card>
            <CardHeader>
              <CardTitle>Pre-screening Information</CardTitle>
              <p className="text-sm text-gray-600">
                Information gathered during the pre-screening call as per TransEra process
              </p>
            </CardHeader>
            <CardContent>
              {prescreening ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium">Compensation</h3>
                    <div>
                      <Label className="text-sm">Current CTC</Label>
                      <p className="text-sm">R{prescreening.current_ctc?.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Expected CTC</Label>
                      <p className="text-sm">R{prescreening.expected_ctc?.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Personal Information</h3>
                    <div>
                      <Label className="text-sm">Age</Label>
                      <p className="text-sm">{prescreening.age}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Marital Status</Label>
                      <p className="text-sm">{prescreening.marital_status}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Dependents</Label>
                      <p className="text-sm">{prescreening.dependents}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Logistics</h3>
                    <div>
                      <Label className="text-sm">Willing to Relocate</Label>
                      <p className="text-sm">{prescreening.willing_to_relocate ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Driver's License</Label>
                      <p className="text-sm">{prescreening.has_drivers_license ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Education Level</Label>
                      <p className="text-sm">{prescreening.education_level}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pre-screening data available</p>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Conduct Pre-screening
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Actions Tab */}
        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Automated Email Actions
              </CardTitle>
              <p className="text-sm text-gray-600">
                Send job specifications and other automated emails to the candidate
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <h3 className="font-medium mb-2">Send Job Specification</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Automatically send job specification email for a specific position
                    </p>
                    <Button 
                      onClick={() => sendJobSpecEmail('job-id')} 
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Job Spec
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4">
                    <h3 className="font-medium mb-2">Interview Invitation</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Send interview invitation with details and calendar invite
                    </p>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Send Interview Invite
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}