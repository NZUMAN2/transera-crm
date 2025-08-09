// lib/database/queries.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { 
  Organization, 
  User, 
  Client, 
  Job, 
  Candidate, 
  Application,
  Task,
  EmailTemplate,
  ActivityLog,
  JobWithClient,
  ApplicationWithCandidate,
  ApplicationWithJob,
  ActivityLogWithUser
} from '@/types/database'

// Server-side database queries
export async function getOrganization() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching organization:', error)
    return null
  }
  return data as Organization
}

export async function getClients(limit = 10) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }
  return data as Client[]
}

export async function getJobs(status?: string, limit = 10) {
  const supabase = createServerComponentClient({ cookies })
  
  let query = supabase
    .from('jobs')
    .select(`
      *,
      client:clients(company_name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching jobs:', error)
    return []
  }
  return data as JobWithClient[]
}

export async function getCandidates(limit = 10) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching candidates:', error)
    return []
  }
  return data as Candidate[]
}

export async function getApplicationsByJob(jobId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      candidate:candidates(*)
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }
  return data as ApplicationWithCandidate[]
}

export async function getApplicationsByCandidate(candidateId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(*)
    `)
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }
  return data as ApplicationWithJob[]
}

export async function getTasks(userId?: string, status?: string) {
  const supabase = createServerComponentClient({ cookies })
  
  let query = supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true })
  
  if (userId) {
    query = query.eq('assigned_to', userId)
  }
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
  return data as Task[]
}

export async function getEmailTemplates(category?: string) {
  const supabase = createServerComponentClient({ cookies })
  
  let query = supabase
    .from('email_templates')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching email templates:', error)
    return []
  }
  return data as EmailTemplate[]
}

export async function getRecentActivity(limit = 20) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      user:users(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching activity logs:', error)
    return []
  }
  return data as ActivityLogWithUser[]
}

// Dashboard statistics queries
export async function getDashboardStats() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get counts for each entity
  const [
    { count: jobsCount },
    { count: candidatesCount },
    { count: clientsCount },
    { count: activePlacementsCount }
  ] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('candidates').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'placed')
  ])
  
  return {
    openJobs: jobsCount || 0,
    activeCandidates: candidatesCount || 0,
    activeClients: clientsCount || 0,
    placements: activePlacementsCount || 0
  }
}