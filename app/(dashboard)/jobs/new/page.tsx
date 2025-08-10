// app/(dashboard)/jobs/new/page.tsx

import { createClient } from '@/lib/supabase/server'
import { createJob } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NewJobPage() {
  const supabase = createClient()
  
  // Get clients for dropdown
  const { data: clients } = await supabase
    .from('clients')
    .select('id, company_name')
    .eq('status', 'active')
    .order('company_name')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
        <p className="text-gray-600 mt-1">Add a new job posting to your pipeline</p>
      </div>

      <form action={createJob} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job_code">Job Code *</Label>
                <Input 
                  id="job_code"
                  name="job_code"
                  required
                  placeholder="e.g., TI-001"
                />
              </div>
              
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input 
                  id="title"
                  name="title"
                  required
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <Label htmlFor="client_id">Client</Label>
                <select
                  id="client_id"
                  name="client_id"
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select a client</option>
                  {clients?.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location"
                  name="location"
                  required
                  placeholder="e.g., Cape Town"
                />
              </div>

              <div>
                <Label htmlFor="employment_type">Employment Type *</Label>
                <select
                  id="employment_type"
                  name="employment_type"
                  required
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select type</option>
                  <option value="permanent">Permanent</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  name="status"
                  required
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="on_hold">On Hold</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <select
                  id="urgency"
                  name="urgency"
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Salary Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary_min">Minimum Salary (ZAR)</Label>
                <Input 
                  id="salary_min"
                  name="salary_min"
                  type="number"
                  placeholder="e.g., 500000"
                />
              </div>
              
              <div>
                <Label htmlFor="salary_max">Maximum Salary (ZAR)</Label>
                <Input 
                  id="salary_max"
                  name="salary_max"
                  type="number"
                  placeholder="e.g., 700000"
                />
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Job Description</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Describe the role and responsibilities..."
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="List the key requirements for this position..."
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefits</Label>
                <textarea
                  id="benefits"
                  name="benefits"
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="List the benefits and perks..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link href="/jobs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">
              Create Job
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}