// types/database.ts

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  subscription_tier: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'consultant' | 'viewer';
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  organization_id: string;
  company_name: string;
  industry?: string;
  website?: string;
  company_size?: string;
  annual_revenue?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  primary_contact_position?: string;
  billing_address?: string;
  notes?: string;
  status: 'prospect' | 'active' | 'inactive' | 'archived';
  created_by?: string;
  account_manager?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  organization_id: string;
  client_id?: string;
  job_code: string;
  title: string;
  description?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  employment_type?: 'permanent' | 'contract' | 'temporary' | 'internship';
  status: 'draft' | 'open' | 'on_hold' | 'closed' | 'cancelled';
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  created_by?: string;
  requirements?: string;
  benefits?: string;
  posted_date?: string;
  closing_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  current_position?: string;
  current_company?: string;
  years_experience?: number;
  salary_current?: number;
  salary_expected?: number;
  currency: string;
  notice_period?: string;
  linkedin_url?: string;
  resume_url?: string;
  skills?: string[];
  education?: string;
  status: 'active' | 'inactive' | 'blacklisted' | 'placed';
  source?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  organization_id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  stage: ApplicationStage;
  submitted_to_client_at?: string;
  interview_date?: string;
  offer_date?: string;
  placement_date?: string;
  rejection_reason?: string;
  consultant_notes?: string;
  client_feedback?: string;
  created_by?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus = 
  | 'sourced' 
  | 'contacted' 
  | 'screening' 
  | 'submitted' 
  | 'client_review'
  | 'interview_scheduled' 
  | 'interviewed' 
  | 'reference_check' 
  | 'offer_pending'
  | 'offer_sent' 
  | 'offer_accepted' 
  | 'offer_declined' 
  | 'placed' 
  | 'rejected' 
  | 'withdrawn';

export type ApplicationStage = 
  | 'sourcing' 
  | 'screening' 
  | 'submission' 
  | 'interview' 
  | 'offer' 
  | 'placement';

export interface Task {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  task_type?: 'call' | 'email' | 'meeting' | 'interview' | 'reference_check' | 'document' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  completed_at?: string;
  related_to_type?: 'job' | 'candidate' | 'client' | 'application';
  related_to_id?: string;
  assigned_to?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  organization_id: string;
  name: string;
  subject: string;
  body: string;
  category?: 'candidate_outreach' | 'client_submission' | 'interview_prep' | 'rejection' | 'offer' | 'general';
  variables?: string[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  organization_id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Database response types for joined queries
export interface JobWithClient extends Job {
  client?: Client;
}

export interface ApplicationWithCandidate extends Application {
  candidate: Candidate;
}

export interface ApplicationWithJob extends Application {
  job: Job;
}

export interface ActivityLogWithUser extends ActivityLog {
  user?: {
    full_name: string;
  };
}