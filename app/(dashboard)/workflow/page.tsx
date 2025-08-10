import { createClient } from '@/lib/supabase/server'
import WorkflowBoard from './workflow-board'

export const dynamic = 'force-dynamic'

export default async function WorkflowPage() {
  const supabase = createClient()

  // Get all applications with job and candidate details
  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(id, title, job_code, status),
      candidate:candidates(id, first_name, last_name, email, current_position)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
  }

  // Define pipeline stages
  const stages = [
    { id: 'sourcing', title: 'Client & Sourcing', color: 'bg-blue-500' },
    { id: 'screening', title: 'Screening & Submission', color: 'bg-orange-500' },
    { id: 'interview', title: 'Interview', color: 'bg-purple-500' },
    { id: 'offer', title: 'Offer', color: 'bg-green-500' },
    { id: 'placed', title: 'Placement & Invoicing', color: 'bg-emerald-600' }
  ]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Workflow Management</h1>
        <p className="text-gray-600 mt-1">Track jobs through the recruitment pipeline</p>
      </div>

      <WorkflowBoard 
        stages={stages} 
        applications={applications || []} 
      />
    </div>
  )
}