import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const supabase = createClient()
  
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, clients(company_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage your job postings and requirements</p>
        </div>
        <Link 
          href="/jobs/new"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add New Job
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Total Jobs</div>
          <div className="text-2xl font-bold">{jobs?.length || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Open Positions</div>
          <div className="text-2xl font-bold text-green-600">
            {jobs?.filter(j => j.status === 'open').length || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">On Hold</div>
          <div className="text-2xl font-bold text-yellow-600">0</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Closed</div>
          <div className="text-2xl font-bold text-gray-600">0</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs?.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-purple-600">{job.job_code}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.type}</div>
                </td>
                <td className="px-6 py-4 text-sm">{job.clients?.company_name}</td>
                <td className="px-6 py-4 text-sm">{job.location}</td>
                <td className="px-6 py-4 text-sm">{job.salary_range}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    job.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.urgency}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">0</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    <Link href={`/jobs/${job.id}`} className="text-purple-600 hover:text-purple-900">
                      View
                    </Link>
                    <Link href={`/jobs/${job.id}/edit`} className="text-purple-600 hover:text-purple-900">
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}