// app/(dashboard)/jobs/[id]/page.tsx

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { updateJobStatus, deleteJob } from '../actions'

export default async function JobDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = createClient()
  
  // Get job details with related data
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      client:clients(*),
      applications(
        id,
        status,
        stage,
        candidate:candidates(
          id,
          first_name,
          last_name,
          email,
          phone,
          current_position
        )
      ),
      created_by_user:users!jobs_created_by_fkey(full_name),
      assigned_to_user:users!jobs_assigned_to_fkey(full_name)
    `)
    .eq('id', params.id)
    .single()

  if (error || !job) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      open: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-600'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[urgency as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const deleteJobWithId = deleteJob.bind(null, job.id)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Link href="/jobs" className="hover:text-purple-600">
            Jobs
          </Link>
          <span className="mx-2">/</span>
          <span>{job.job_code}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                {job.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyColor(job.urgency || 'medium')}`}>
                {job.urgency || 'medium'} priority
              </span>
              <span className="text-gray-500">
                {job.employment_type}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link href={`/jobs/${job.id}/edit`}>
              <Button variant="outline">
                Edit Job
              </Button>
            </Link>
            <form action={deleteJobWithId}>
              <Button variant="destructive" type="submit">
                Delete Job
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
            
            <div className="space-y-4">
              {job.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
                </div>
              )}
              
              {job.requirements && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Requirements</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}
              
              {job.benefits && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Benefits</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{job.benefits}</p>
                </div>
              )}
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Applications ({job.applications?.length || 0})
              </h2>
              <Link href={`/jobs/${job.id}/applications`}>
                <Button size="sm">
                  Manage Applications
                </Button>
              </Link>
            </div>
            
            {job.applications && job.applications.length > 0 ? (
              <div className="space-y-3">
                {job.applications.slice(0, 5).map((application) => (
                  <div key={application.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.candidate?.first_name} {application.candidate?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.candidate?.current_position}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.candidate?.email}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {application.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No applications yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Information</h2>
            
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-700">Job Code</dt>
                <dd className="text-sm text-gray-900 mt-1">{job.job_code}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-700">Location</dt>
                <dd className="text-sm text-gray-900 mt-1">{job.location}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-700">Salary Range</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {job.salary_min && job.salary_max
                    ? `R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}`
                    : 'Not specified'}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-700">Posted Date</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {new Date(job.created_at).toLocaleDateString()}
                </dd>
              </div>
              
              {job.closing_date && (
                <div>
                  <dt className="text-sm font-medium text-gray-700">Closing Date</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {new Date(job.closing_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Client Information */}
          {job.client && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Company</p>
                  <p className="text-sm text-gray-900 mt-1">{job.client.company_name}</p>
                </div>
                
                {job.client.industry && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Industry</p>
                    <p className="text-sm text-gray-900 mt-1">{job.client.industry}</p>
                  </div>
                )}
                
                {job.client.primary_contact_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contact Person</p>
                    <p className="text-sm text-gray-900 mt-1">{job.client.primary_contact_name}</p>
                    {job.client.primary_contact_email && (
                      <p className="text-xs text-gray-600">{job.client.primary_contact_email}</p>
                    )}
                  </div>
                )}
              </div>
              
              <Link 
                href={`/clients/${job.client.id}`}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-4 inline-block"
              >
                View Client Details →
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              {job.status !== 'open' && (
                <form action={async () => {
                  'use server'
                  await updateJobStatus(job.id, 'open')
                }}>
                  <Button type="submit" variant="outline" className="w-full">
                    Mark as Open
                  </Button>
                </form>
              )}
              
              {job.status === 'open' && (
                <form action={async () => {
                  'use server'
                  await updateJobStatus(job.id, 'on_hold')
                }}>
                  <Button type="submit" variant="outline" className="w-full">
                    Put on Hold
                  </Button>
                </form>
              )}
              
              {job.status !== 'closed' && (
                <form action={async () => {
                  'use server'
                  await updateJobStatus(job.id, 'closed')
                }}>
                  <Button type="submit" variant="outline" className="w-full">
                    Close Position
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}