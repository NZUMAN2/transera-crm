import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CandidatesPage() {
  const supabase = createClient()
  
  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-1">Manage your talent pipeline</p>
        </div>
        <Link 
          href="/candidates/new"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add New Candidate
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Total Candidates</div>
          <div className="text-2xl font-bold">{candidates?.length || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {candidates?.filter(c => c.status === 'active').length || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Placed</div>
          <div className="text-2xl font-bold text-blue-600">0</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Avg Experience</div>
          <div className="text-2xl font-bold text-purple-600">4 yrs</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search candidates..."
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <select className="px-4 py-2 border rounded-lg">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Placed</option>
            </select>
            <select className="px-4 py-2 border rounded-lg">
              <option>All Experience</option>
              <option>0-2 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {candidates?.map((candidate) => (
            <div key={candidate.id} className="border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{candidate.first_name} {candidate.last_name}</h3>
                  <p className="text-gray-600">{candidate.job_title}</p>
                  <p className="text-sm text-gray-500">{candidate.current_company}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  {candidate.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📍</span> {candidate.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">✉️</span> {candidate.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📱</span> {candidate.phone}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {candidate.experience_level} • {candidate.years_experience} years
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/candidates/${candidate.id}`} className="text-purple-600 text-sm">
                      View
                    </Link>
                    <Link href={`/candidates/${candidate.id}/edit`} className="text-purple-600 text-sm">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}