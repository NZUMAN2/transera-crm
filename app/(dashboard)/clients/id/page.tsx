// app/(dashboard)/clients/[id]/page.tsx

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { updateClientStatus, deleteClientCompany } from '../actions'

export const dynamic = 'force-dynamic'

export default async function ClientDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = createClient()
  
  // Get client details with related data
  const { data: client, error } = await supabase
    .from('clients')
    .select(`
      *,
      jobs(
        id,
        job_code,
        title,
        status,
        location,
        salary_min,
        salary_max
      ),
      account_manager:users!clients_account_manager_fkey(full_name, email),
      created_by_user:users!clients_created_by_fkey(full_name)
    `)
    .eq('id', params.id)
    .single()

  if (error || !client) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      prospect: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getJobStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      open: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-600'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const deleteClientWithId = deleteClientCompany.bind(null, client.id)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Link href="/clients" className="hover:text-purple-600">
            Clients
          </Link>
          <span className="mx-2">/</span>
          <span>{client.company_name}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.company_name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
              {client.industry && (
                <span className="text-sm text-gray-600">{client.industry}</span>
              )}
              {client.company_size && (
                <span className="text-sm text-gray-600">• {client.company_size} employees</span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link href={`/clients/${client.id}/edit`}>
              <Button variant="outline">
                Edit Client
              </Button>
            </Link>
            <Link href={`/jobs/new?client_id=${client.id}`}>
              <Button>
                Create Job
              </Button>
            </Link>
            <form action={deleteClientWithId}>
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.website && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Website</p>
                  <a 
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    {client.website}
                  </a>
                </div>
              )}
              
              {client.annual_revenue && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Annual Revenue</p>
                  <p className="text-sm text-gray-900">{client.annual_revenue}</p>
                </div>
              )}
              
              {client.billing_address && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700">Billing Address</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{client.billing_address}</p>
                </div>
              )}
              
              {client.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700">Notes</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Jobs ({client.jobs?.length || 0})
              </h2>
              <Link href={`/jobs?client_id=${client.id}`}>
                <Button size="sm">
                  View All Jobs
                </Button>
              </Link>
            </div>
            
            {client.jobs && client.jobs.length > 0 ? (
              <div className="space-y-3">
                {client.jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          href={`/jobs/${job.id}`}
                          className="font-medium text-gray-900 hover:text-purple-600"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-gray-600">
                          {job.job_code} • {job.location}
                        </p>
                        {job.salary_min && job.salary_max && (
                          <p className="text-xs text-gray-500 mt-1">
                            R{job.salary_min.toLocaleString()} - R{job.salary_max.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getJobStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No jobs created for this client yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Primary Contact */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h2>
            
            {client.primary_contact_name ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-sm text-gray-900">{client.primary_contact_name}</p>
                </div>
                
                {client.primary_contact_position && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Position</p>
                    <p className="text-sm text-gray-900">{client.primary_contact_position}</p>
                  </div>
                )}
                
                {client.primary_contact_email && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a 
                      href={`mailto:${client.primary_contact_email}`}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      {client.primary_contact_email}
                    </a>
                  </div>
                )}
                
                {client.primary_contact_phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <a 
                      href={`tel:${client.primary_contact_phone}`}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      {client.primary_contact_phone}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No primary contact set</p>
            )}
          </div>

          {/* Account Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h2>
            
            <div className="space-y-3">
              {client.account_manager && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Account Manager</p>
                  <p className="text-sm text-gray-900">{client.account_manager.full_name}</p>
                  <a 
                    href={`mailto:${client.account_manager.email}`}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    {client.account_manager.email}
                  </a>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-700">Client Since</p>
                <p className="text-sm text-gray-900">
                  {new Date(client.created_at).toLocaleDateString()}
                </p>
              </div>
              
              {client.created_by_user && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Added By</p>
                  <p className="text-sm text-gray-900">{client.created_by_user.full_name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              {client.status !== 'active' && (
                <form action={async () => {
                  'use server'
                  await updateClientStatus(client.id, 'active')
                }}>
                  <Button type="submit" variant="outline" className="w-full">
                    Mark as Active
                  </Button>
                </form>
              )}
              
              {client.status === 'active' && (
                <form action={async () => {
                  'use server'
                  await updateClientStatus(client.id, 'inactive')
                }}>
                  <Button type="submit" variant="outline" className="w-full">
                    Mark as Inactive
                  </Button>
                </form>
              )}
              
              {client.primary_contact_email && (
                <a 
                  href={`mailto:${client.primary_contact_email}`}
                  className="w-full inline-block"
                >
                  <Button variant="outline" className="w-full">
                    Email Contact
                  </Button>
                </a>
              )}
              
              {client.primary_contact_phone && (
                <a 
                  href={`tel:${client.primary_contact_phone}`}
                  className="w-full inline-block"
                >
                  <Button variant="outline" className="w-full">
                    Call Contact
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}