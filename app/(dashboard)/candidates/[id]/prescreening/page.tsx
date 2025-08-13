// app/(dashboard)/candidates/[id]/prescreening/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { 
  User, Phone, Mail, MapPin, DollarSign, 
  GraduationCap, Car, Users, Save, ArrowLeft
} from 'lucide-react'

interface Candidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
}

interface PreScreeningData {
  // Contact Information
  alternative_contact: string
  alternative_email: string
  current_location: string
  willing_to_relocate: boolean
  
  // Employment Information
  current_ctc: number
  ctc_structure: string
  expected_ctc: number
  reasons_for_leaving: string
  reason_wanting_to_leave_current: string
  reporting_structure: string
  role_portfolio: string
  
  // Personal Information
  age: number
  race: string
  marital_status: string
  dependents: number
  has_drivers_license: boolean
  has_transport: boolean
  
  // Education
  education_level: string
  qualifications: string
  year_obtained: number
  
  // Screening Notes
  interview_notes: string
  pre_screen_status: string
}

export default function PreScreeningForm({ params }: { params: { id: string } }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<PreScreeningData>({
    alternative_contact: '',
    alternative_email: '',
    current_location: '',
    willing_to_relocate: false,
    current_ctc: 0,
    ctc_structure: '',
    expected_ctc: 0,
    reasons_for_leaving: '',
    reason_wanting_to_leave_current: '',
    reporting_structure: '',
    role_portfolio: '',
    age: 0,
    race: '',
    marital_status: '',
    dependents: 0,
    has_drivers_license: false,
    has_transport: false,
    education_level: '',
    qualifications: '',
    year_obtained: new Date().getFullYear(),
    interview_notes: '',
    pre_screen_status: 'pending'
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCandidateData()
  }, [params.id])

  const fetchCandidateData = async () => {
    try {
      // Fetch candidate basic info
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('id, first_name, last_name, email, phone')
        .eq('id', params.id)
        .single()

      if (candidateError) throw candidateError
      setCandidate(candidateData)

      // Check if pre-screening data already exists
      const { data: existingData } = await supabase
        .from('candidate_prescreening')
        .select('*')
        .eq('candidate_id', params.id)
        .single()

      if (existingData) {
        setFormData(existingData)
      }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('candidate_prescreening')
        .upsert({
          candidate_id: params.id,
          ...formData,
          conducted_at: new Date().toISOString()
        })

      if (error) throw error

      // Also add a note to candidate_notes
      await supabase
        .from('candidate_notes')
        .insert({
          candidate_id: params.id,
          note_content: `Pre-screening completed. Status: ${formData.pre_screen_status}. Current CTC: R${formData.current_ctc.toLocaleString()}, Expected: R${formData.expected_ctc.toLocaleString()}. ${formData.interview_notes}`,
          note_type: 'pre_screen',
          is_important: true
        })

      toast({
        title: "Success",
        description: "Pre-screening data saved successfully"
      })

      router.push(`/candidates/${params.id}`)

    } catch (error) {
      console.error('Error saving pre-screening data:', error)
      toast({
        title: "Error",
        description: "Failed to save pre-screening data",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const updateFormData = (field: keyof PreScreeningData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  if (!candidate) {
    return <div className="flex items-center justify-center h-96">Candidate not found</div>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Pre-screening Interview</h1>
            <p className="text-gray-600">
              {candidate.first_name} {candidate.last_name} • {candidate.email}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Pre-screening Questions (TransEra Process)</h3>
          <p className="text-sm text-blue-700">
            Complete this form during or after the pre-screening call to gather all necessary information 
            about the candidate as per the TransEra workflow.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="alternative_contact">Alternative Contact</Label>
              <Input
                id="alternative_contact"
                value={formData.alternative_contact}
                onChange={(e) => updateFormData('alternative_contact', e.target.value)}
                placeholder="Alternative phone number"
              />
            </div>
            <div>
              <Label htmlFor="alternative_email">Alternative Email</Label>
              <Input
                id="alternative_email"
                type="email"
                value={formData.alternative_email}
                onChange={(e) => updateFormData('alternative_email', e.target.value)}
                placeholder="Alternative email address"
              />
            </div>
            <div>
              <Label htmlFor="current_location">Current Location</Label>
              <Input
                id="current_location"
                value={formData.current_location}
                onChange={(e) => updateFormData('current_location', e.target.value)}
                placeholder="Current location/city"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="willing_to_relocate"
                checked={formData.willing_to_relocate}
                onCheckedChange={(checked) => updateFormData('willing_to_relocate', checked)}
              />
              <Label htmlFor="willing_to_relocate">Willing to relocate</Label>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Employment & Compensation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_ctc">Current CTC (Annual)</Label>
                <Input
                  id="current_ctc"
                  type="number"
                  value={formData.current_ctc || ''}
                  onChange={(e) => updateFormData('current_ctc', Number(e.target.value))}
                  placeholder="e.g., 500000"
                />
              </div>
              <div>
                <Label htmlFor="expected_ctc">Expected CTC (Annual)</Label>
                <Input
                  id="expected_ctc"
                  type="number"
                  value={formData.expected_ctc || ''}
                  onChange={(e) => updateFormData('expected_ctc', Number(e.target.value))}
                  placeholder="e.g., 600000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ctc_structure">CTC Structure (Benefits, Incentives, etc.)</Label>
              <Textarea
                id="ctc_structure"
                value={formData.ctc_structure}
                onChange={(e) => updateFormData('ctc_structure', e.target.value)}
                placeholder="Break down of current package: basic, medical aid, pension, car allowance, etc."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="reporting_structure">Reporting Structure</Label>
              <Textarea
                id="reporting_structure"
                value={formData.reporting_structure}
                onChange={(e) => updateFormData('reporting_structure', e.target.value)}
                placeholder="Who do they report to? Team size? Management responsibilities?"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="role_portfolio">Role Portfolio</Label>
              <Textarea
                id="role_portfolio"
                value={formData.role_portfolio}
                onChange={(e) => updateFormData('role_portfolio', e.target.value)}
                placeholder="Describe their current role responsibilities and portfolio"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="reasons_for_leaving">Reasons for Leaving Previous Employment</Label>
              <Textarea
                id="reasons_for_leaving"
                value={formData.reasons_for_leaving}
                onChange={(e) => updateFormData('reasons_for_leaving', e.target.value)}
                placeholder="Why did they leave their previous job?"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="reason_wanting_to_leave_current">Reason for Wanting to Leave Current Employment</Label>
              <Textarea
                id="reason_wanting_to_leave_current"
                value={formData.reason_wanting_to_leave_current}
                onChange={(e) => updateFormData('reason_wanting_to_leave_current', e.target.value)}
                placeholder="Why are they looking to leave their current position?"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => updateFormData('age', Number(e.target.value))}
                placeholder="Age"
                min="18"
                max="65"
              />
            </div>
            <div>
              <Label htmlFor="race">Race</Label>
              <select
                id="race"
                value={formData.race}
                onChange={(e) => updateFormData('race', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select race</option>
                <option value="African">African</option>
                <option value="Coloured">Coloured</option>
                <option value="Indian">Indian</option>
                <option value="White">White</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <select
                id="marital_status"
                value={formData.marital_status}
                onChange={(e) => updateFormData('marital_status', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="dependents">Number of Dependents</Label>
              <Input
                id="dependents"
                type="number"
                value={formData.dependents || ''}
                onChange={(e) => updateFormData('dependents', Number(e.target.value))}
                placeholder="Number of dependents"
                min="0"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="has_drivers_license"
                checked={formData.has_drivers_license}
                onCheckedChange={(checked) => updateFormData('has_drivers_license', checked)}
              />
              <Label htmlFor="has_drivers_license">Has Driver's License</Label>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="has_transport"
                checked={formData.has_transport}
                onCheckedChange={(checked) => updateFormData('has_transport', checked)}
              />
              <Label htmlFor="has_transport">Has Transport</Label>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education & Training
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="education_level">Education Level</Label>
              <select
                id="education_level"
                value={formData.education_level}
                onChange={(e) => updateFormData('education_level', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select education level</option>
                <option value="Matric">Matric</option>
                <option value="Certificate">Certificate</option>
                <option value="Diploma">Diploma</option>
                <option value="Degree">Degree</option>
                <option value="Honours">Honours</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="year_obtained">Year Obtained</Label>
              <Input
                id="year_obtained"
                type="number"
                value={formData.year_obtained || ''}
                onChange={(e) => updateFormData('year_obtained', Number(e.target.value))}
                placeholder="e.g., 2020"
                min="1970"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="qualifications">Qualifications & Training</Label>
              <Textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => updateFormData('qualifications', e.target.value)}
                placeholder="List all qualifications, certifications, and relevant training"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Interview Notes & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Notes & Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="interview_notes">Interview Notes</Label>
              <Textarea
                id="interview_notes"
                value={formData.interview_notes}
                onChange={(e) => updateFormData('interview_notes', e.target.value)}
                placeholder="Notes from the pre-screening call: impression, communication skills, suitability, concerns, etc."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="pre_screen_status">Pre-screening Status</Label>
              <select
                id="pre_screen_status"
                value={formData.pre_screen_status}
                onChange={(e) => updateFormData('pre_screen_status', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="passed">Passed - Proceed to Interview</option>
                <option value="failed">Failed - Not Suitable</option>
                <option value="on_hold">On Hold - Clarification Needed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <Button 
            type="submit" 
            disabled={saving}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Pre-screening Data'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}