// app/(dashboard)/reports/page.tsx

import { createClient } from '@/lib/supabase/server'

export default async function ReportsPage() {
  const supabase = createClient()

  // Get statistics
  const { count: totalJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  const { count: openJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  const { count: totalCandidates } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true })

  const { count: activeCandidates } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: activeClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate insights and export reports</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Monthly Performance Report</h3>
          <p className="text-xs text-gray-500 mt-1">Generate comprehensive monthly metrics</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Revenue Analytics</h3>
          <p className="text-xs text-gray-500 mt-1">Track revenue trends and forecasts</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Consultant Performance</h3>
          <p className="text-xs text-gray-500 mt-1">Individual consultant metrics</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Pipeline Analysis</h3>
          <p className="text-xs text-gray-500 mt-1">Recruitment pipeline health</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Time-to-Fill Report</h3>
          <p className="text-xs text-gray-500 mt-1">Average time to fill positions</p>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg. Time to Fill</p>
            <p className="text-3xl font-bold text-purple-600">23 days</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Placement Rate</p>
            <p className="text-3xl font-bold text-green-600">78%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Client Satisfaction</p>
            <p className="text-3xl font-bold text-blue-600">94%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Active Searches</p>
            <p className="text-3xl font-bold text-orange-600">{openJobs || 0}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Jobs Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Jobs</span>
              <span className="font-semibold">{totalJobs || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Open Positions</span>
              <span className="font-semibold text-green-600">{openJobs || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fill Rate</span>
              <span className="font-semibold">78%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Candidates Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Candidates</span>
              <span className="font-semibold">{totalCandidates || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Candidates</span>
              <span className="font-semibold text-green-600">{activeCandidates || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Placement Rate</span>
              <span className="font-semibold">32%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Clients Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Clients</span>
              <span className="font-semibold">{totalClients || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Clients</span>
              <span className="font-semibold text-green-600">{activeClients || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retention Rate</span>
              <span className="font-semibold">92%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}