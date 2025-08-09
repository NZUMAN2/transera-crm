// app/(dashboard)/workflow/actions.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateApplicationStage(
  applicationId: string, 
  newStage: string
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('applications')
    .update({ 
      stage: newStage,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)

  if (error) {
    console.error('Error updating application stage:', error)
    throw new Error('Failed to update application stage')
  }

  revalidatePath('/workflow')
}

export async function createApplication(
  jobId: string,
  candidateId: string
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  const applicationData = {
    organization_id: profile?.organization_id,
    job_id: jobId,
    candidate_id: candidateId,
    stage: 'sourcing',
    status: 'active',
    created_by: user.id
  }

  const { error } = await supabase
    .from('applications')
    .insert(applicationData)

  if (error) {
    console.error('Error creating application:', error)
    throw new Error('Failed to create application')
  }

  revalidatePath('/workflow')
}