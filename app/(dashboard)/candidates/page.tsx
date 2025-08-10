import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function CandidatesPage() {
  const supabase = createClient()

  // Get candidates with application count
  const { data: candidates, error } = await supabase
    .from('candidates')
    .select(`
      *,
      applications(count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching candidates:', error)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      blacklisted: 'bg-red-100 text-red-800',
      placed: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getExperienceLevel = (years: number) => {
    if (years <= 2) return { label: 'Junior', color: 'text-green-600' }
    if (years <= 5) return { label: 'Mid-Level', color: 'text-blue-600' }
    if (years <= 10) return { label: 'Senior', color: 'text-purple-600' }
    return { label: 'Expert', color: 'text-orange-600' }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-1">Manage your talent pipeline</p>
        </div>
        <Link href="/candidates/new">
          <Button>
            + Add New Candidate
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Candidates</p>
          <p className="text-2xl font-bold text-gray-900">{candidates?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {candidates?.filter(c => c.status === 'active').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Placed</p>
          <p className="text-2xl font-bold text-blue-600">
            {candidates?.filter(c => c.status === 'placed').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Avg Experience</p>
          <p className="text-2xl font-bold text-purple-600">
            {candidates && candidates.length > 0
              ? Math.round(
                  candidates.reduce((acc, c) => acc + (c.years_experience || 0), 0) / candidates.length
                )
              : 0} yrs
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search candidates..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="placed">Placed</option>
            <option value="blacklisted">Blacklisted</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option value="">All Experience</option>
            <option value="junior">Junior (0-2 years)</option>
            <option value="mid">Mid-Level (3-5 years)</option>
            <option value="senior">Senior (6-10 years)</option>
            <option value="expert">Expert (10+ years)</option>
          </select>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates && candidates.length > 0 ? (
          candidates.map((candidate) => {
            const expLevel = getExperienceLevel(candidate.years_experience || 0)
            return (
              <div key={candidate.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {candidate.first_name} {candidate.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{candidate.current_position}</p>
                      {candidate.current_company && (
                        <p className="text-xs text-gray-500">at {candidate.current_company}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {candidate.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {candidate.email}
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {candidate.phone}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-medium ${expLevel.color}`}>
                      {expLevel.label} • {candidate.years_experience || 0} years
                    </span>
                    {candidate.salary_expected && (
                      <span className="text-sm text-gray-600">
                        R{candidate.salary_expected.toLocaleString()}/yr
                      </span>
                    )}
                  </div>

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{candidate.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      {candidate.applications?.length || 0} applications
                    </span>
                    <div className="flex gap-2">
                      <Link 
                        href={`/candidates/${candidate.id}`}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/candidates/${candidate.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg mb-2">No candidates found</p>
              <p className="text-sm">Click "Add New Candidate" to add your first candidate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}