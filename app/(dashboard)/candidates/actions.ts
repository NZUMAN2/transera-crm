// app/(dashboard)/candidates/actions.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCandidate(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  // Parse skills from comma-separated string to array
  const skillsString = formData.get('skills') as string
  const skills = skillsString ? skillsString.split(',').map(s => s.trim()).filter(Boolean) : []

  const candidateData = {
    organization_id: profile?.organization_id,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    location: formData.get('location') as string,
    current_position: formData.get('current_position') as string,
    current_company: formData.get('current_company') as string,
    years_experience: parseInt(formData.get('years_experience') as string) || 0,
    salary_current: parseFloat(formData.get('salary_current') as string) || null,
    salary_expected: parseFloat(formData.get('salary_expected') as string) || null,
    notice_period: formData.get('notice_period') as string,
    linkedin_url: formData.get('linkedin_url') as string,
    skills: skills,
    education: formData.get('education') as string,
    status: formData.get('status') as string || 'active',
    source: formData.get('source') as string,
    notes: formData.get('notes') as string,
    created_by: user.id
  }

  const { error } = await supabase
    .from('candidates')
    .insert(candidateData)

  if (error) {
    console.error('Error creating candidate:', error)
    throw new Error('Failed to create candidate')
  }

  revalidatePath('/candidates')
  redirect('/candidates')
}

export async function updateCandidate(candidateId: string, formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Parse skills
  const skillsString = formData.get('skills') as string
  const skills = skillsString ? skillsString.split(',').map(s => s.trim()).filter(Boolean) : []

  const candidateData = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    location: formData.get('location') as string,
    current_position: formData.get('current_position') as string,
    current_company: formData.get('current_company') as string,
    years_experience: parseInt(formData.get('years_experience') as string) || 0,
    salary_current: parseFloat(formData.get('salary_current') as string) || null,
    salary_expected: parseFloat(formData.get('salary_expected') as string) || null,
    notice_period: formData.get('notice_period') as string,
    linkedin_url: formData.get('linkedin_url') as string,
    skills: skills,
    education: formData.get('education') as string,
    status: formData.get('status') as string,
    source: formData.get('source') as string,
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase
    .from('candidates')
    .update(candidateData)
    .eq('id', candidateId)

  if (error) {
    console.error('Error updating candidate:', error)
    throw new Error('Failed to update candidate')
  }

  revalidatePath('/candidates')
  revalidatePath(`/candidates/${candidateId}`)
  redirect('/candidates')
}

export async function deleteCandidate(candidateId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', candidateId)

  if (error) {
    console.error('Error deleting candidate:', error)
    throw new Error('Failed to delete candidate')
  }

  revalidatePath('/candidates')
  redirect('/candidates')
}

export async function updateCandidateStatus(candidateId: string, status: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('candidates')
    .update({ status })
    .eq('id', candidateId)

  if (error) {
    console.error('Error updating candidate status:', error)
    throw new Error('Failed to update candidate status')
  }

  revalidatePath('/candidates')
  revalidatePath(`/candidates/${candidateId}`)
}