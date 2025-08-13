import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const [
    { count: jobsCount },
    { count: candidatesCount },
    { count: clientsCount }
  ] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('candidates').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true })
  ])

  return (
    <div className="p-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="opacity-90">Here's what's happening with your recruitment pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Active Jobs</span>
            <span className="text-2xl">💼</span>
          </div>
          <div className="text-3xl font-bold">{jobsCount || 0}</div>
          <div className="text-sm text-green-600 mt-2">+12% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Candidates</span>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold">{candidatesCount || 0}</div>
          <div className="text-sm text-green-600 mt-2">+8% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Active Clients</span>
            <span className="text-2xl">🏢</span>
          </div>
          <div className="text-3xl font-bold">{clientsCount || 0}</div>
          <div className="text-sm text-green-600 mt-2">+5% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Revenue MTD</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-3xl font-bold">R485K</div>
          <div className="text-sm text-green-600 mt-2">+15% from last month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
          <div className="text-purple-600 text-3xl mb-4">💼</div>
          <h3 className="font-semibold">Add New Job</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
          <div className="text-blue-600 text-3xl mb-4">👤</div>
          <h3 className="font-semibold">Add Candidate</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
          <div className="text-green-600 text-3xl mb-4">🏢</div>
          <h3 className="font-semibold">Add Client</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
          <div className="text-orange-600 text-3xl mb-4">📊</div>
          <h3 className="font-semibold">View Reports</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm">New candidate added</p>
                <p className="text-xs text-gray-500">John Doe - Senior Developer</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm">Job posted</p>
                <p className="text-xs text-gray-500">UI/UX Designer at TechCorp</p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pipeline Overview</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Sourcing</span>
                <span className="text-sm">15 candidates</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Screening</span>
                <span className="text-sm">8 candidates</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '40%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Interview</span>
                <span className="text-sm">5 candidates</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}