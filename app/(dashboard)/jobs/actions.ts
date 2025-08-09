// app/(dashboard)/jobs/actions.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createJob(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  const jobData = {
    organization_id: profile?.organization_id,
    job_code: formData.get('job_code') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    client_id: formData.get('client_id') as string || null,
    location: formData.get('location') as string,
    employment_type: formData.get('employment_type') as string,
    status: formData.get('status') as string || 'draft',
    urgency: formData.get('urgency') as string || 'medium',
    salary_min: parseFloat(formData.get('salary_min') as string) || null,
    salary_max: parseFloat(formData.get('salary_max') as string) || null,
    requirements: formData.get('requirements') as string,
    benefits: formData.get('benefits') as string,
    created_by: user.id
  }

  const { error } = await supabase
    .from('jobs')
    .insert(jobData)

  if (error) {
    console.error('Error creating job:', error)
    throw new Error('Failed to create job')
  }

  revalidatePath('/jobs')
  redirect('/jobs')
}

export async function updateJob(jobId: string, formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const jobData = {
    job_code: formData.get('job_code') as string,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    client_id: formData.get('client_id') as string || null,
    location: formData.get('location') as string,
    employment_type: formData.get('employment_type') as string,
    status: formData.get('status') as string,
    urgency: formData.get('urgency') as string,
    salary_min: parseFloat(formData.get('salary_min') as string) || null,
    salary_max: parseFloat(formData.get('salary_max') as string) || null,
    requirements: formData.get('requirements') as string,
    benefits: formData.get('benefits') as string,
  }

  const { error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', jobId)

  if (error) {
    console.error('Error updating job:', error)
    throw new Error('Failed to update job')
  }

  revalidatePath('/jobs')
  revalidatePath(`/jobs/${jobId}`)
  redirect('/jobs')
}

export async function deleteJob(jobId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)

  if (error) {
    console.error('Error deleting job:', error)
    throw new Error('Failed to delete job')
  }

  revalidatePath('/jobs')
  redirect('/jobs')
}

export async function updateJobStatus(jobId: string, status: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', jobId)

  if (error) {
    console.error('Error updating job status:', error)
    throw new Error('Failed to update job status')
  }

  revalidatePath('/jobs')
  revalidatePath(`/jobs/${jobId}`)
}