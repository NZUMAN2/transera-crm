// app/(dashboard)/clients/[id]/page.tsx
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
  Building, Mail, Phone, MapPin, Calendar, Star, 
  Plus, Save, FileText, DollarSign, TrendingUp,
  Users, Briefcase, Clock, AlertCircle
} from 'lucide-react'

interface Client {
  id: string
  company_name: string
  industry: string
  contact_name: string
  contact_email: string
  contact_phone: string
  address: string
  company_size: string
  status: string
  account_manager: string
  created_at: string
}

interface ClientNote {
  id: string
  note_content: string
  note_type: string
  note_date: string
  is_important: boolean
  follow_up_date: string | null
  created_by: string
  created_at: string
  user_profiles: { full_name: string }
}

interface Industry {
  id: string
  industry_name: string
  industry_category: string
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null)
  const [notes, setNotes] = useState<ClientNote[]>([])
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState('general')
  const [isImportant, setIsImportant] = useState(false)
  const [followUpDate, setFollowUpDate] = useState('')
  const [editingClient, setEditingClient] = useState(false)
  const [clientForm, setClientForm] = useState({
    company_name: '',
    industry: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    company_size: '',
    status: '',
    account_manager: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchClientData()
    fetchIndustries()
  }, [params.id])

  const fetchIndustries = async () => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .eq('is_active', true)
        .order('industry_name')

      if (!error) setIndustries(data || [])
    } catch (error) {
      console.error('Error fetching industries:', error)
    }
  }

  const fetchClientData = async () => {
    try {
      // Fetch client basic info
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', params.id)
        .single()

      if (clientError) throw clientError
      setClient(clientData)
      setClientForm(clientData)

      // Fetch notes
      const { data: notesData, error: notesError } = await supabase
        .from('client_notes')
        .select(`
          *,
          user_profiles (full_name)
        `)
        .eq('client_id', params.id)
        .order('created_at', { ascending: false })

      if (!notesError) setNotes(notesData || [])

    } catch (error) {
      console.error('Error fetching client data:', error)
      toast({
        title: "Error",
        description: "Failed to load client data",
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
        .from('client_notes')
        .insert({
          client_id: params.id,
          note_content: newNote,
          note_type: noteType,
          is_important: isImportant,
          follow_up_date: followUpDate || null
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Note added successfully"
      })

      setNewNote('')
      setIsImportant(false)
      setFollowUpDate('')
      fetchClientData()
    } catch (error) {
      console.error('Error adding note:', error)
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive"
      })
    }
  }

  const updateClient = async () => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientForm)
        .eq('id', params.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Client updated successfully"
      })

      setEditingClient(false)
      fetchClientData()
    } catch (error) {
      console.error('Error updating client:', error)
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive"
      })
    }
  }

  const getFollowUpNotes = () => {
    return notes.filter(note => 
      note.follow_up_date && 
      new Date(note.follow_up_date) >= new Date()
    ).sort((a, b) => new Date(a.follow_up_date!).getTime() - new Date(b.follow_up_date!).getTime())
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  if (!client) {
    return <div className="flex items-center justify-center h-96">Client not found</div>
  }

  const followUpNotes = getFollowUpNotes()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.company_name}</h1>
              <p className="text-gray-600">{client.industry}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {client.contact_email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {client.contact_phone}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {client.address}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
              {client.status}
            </Badge>
            <Badge variant="outline">{client.company_size}</Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEditingClient(true)}
            >
              Edit Client
            </Button>
          </div>
        </div>

        {/* Follow-up Alerts */}
        {followUpNotes.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">Upcoming Follow-ups</h3>
            </div>
            <div className="space-y-1">
              {followUpNotes.slice(0, 3).map((note) => (
                <p key={note.id} className="text-sm text-yellow-700">
                  {new Date(note.follow_up_date!).toLocaleDateString()}: {note.note_content.substring(0, 80)}...
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">
            Notes {notes.length > 0 && `(${notes.length})`}
          </TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <p className="text-sm text-gray-600">{client.industry}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Company Size</Label>
                  <p className="text-sm text-gray-600">{client.company_size}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-gray-600">{client.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Account Manager</Label>
                  <p className="text-sm text-gray-600">{client.account_manager}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Primary Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Contact Person</Label>
                  <p className="text-sm text-gray-600">{client.contact_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{client.contact_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-600">{client.contact_phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-gray-600">{client.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Total Notes</Label>
                  <p className="text-sm text-gray-600">{notes.length} notes</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Follow-ups Due</Label>
                  <p className="text-sm text-gray-600">{followUpNotes.length} pending</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(client.created_at).toLocaleDateString()}
                  </p>
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
                  Add Client Note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="note-type">Note Type</Label>
                    <select
                      id="note-type"
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="general">General</option>
                      <option value="meeting">Meeting</option>
                      <option value="call">Phone Call</option>
                      <option value="email">Email Discussion</option>
                      <option value="proposal">Proposal/Quote</option>
                      <option value="contract">Contract Discussion</option>
                      <option value="feedback">Client Feedback</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="follow-up-date">Follow-up Date (Optional)</Label>
                    <Input
                      id="follow-up-date"
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                    />
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
                    placeholder="Enter details about your interaction with this client..."
                    rows={4}
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
                          {note.follow_up_date && (
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" />
                              Follow-up: {new Date(note.follow_up_date).toLocaleDateString()}
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

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Active Jobs with {client.company_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Job listings and recruitment activity will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Revenue and placement analytics will be displayed here
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Client engagement metrics will be displayed here
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <p className="text-sm text-gray-600">
                Update client details and preferences
              </p>
            </CardHeader>
            <CardContent>
              {editingClient ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={clientForm.company_name}
                        onChange={(e) => setClientForm({...clientForm, company_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <select
                        id="industry"
                        value={clientForm.industry}
                        onChange={(e) => setClientForm({...clientForm, industry: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Industry</option>
                        {industries.map((industry) => (
                          <option key={industry.id} value={industry.industry_name}>
                            {industry.industry_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="contact_name">Contact Name</Label>
                      <Input
                        id="contact_name"
                        value={clientForm.contact_name}
                        onChange={(e) => setClientForm({...clientForm, contact_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={clientForm.contact_email}
                        onChange={(e) => setClientForm({...clientForm, contact_email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        value={clientForm.contact_phone}
                        onChange={(e) => setClientForm({...clientForm, contact_phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_size">Company Size</Label>
                      <select
                        id="company_size"
                        value={clientForm.company_size}
                        onChange={(e) => setClientForm({...clientForm, company_size: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Size</option>
                        <option value="Startup (1-10)">Startup (1-10)</option>
                        <option value="Small (11-50)">Small (11-50)</option>
                        <option value="Medium (51-200)">Medium (51-200)</option>
                        <option value="Large (201-1000)">Large (201-1000)</option>
                        <option value="Enterprise (1000+)">Enterprise (1000+)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={clientForm.address}
                      onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={updateClient}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditingClient(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Client information is up to date</p>
                  <Button onClick={() => setEditingClient(true)}>
                    Edit Client Information
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}