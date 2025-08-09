// app/(dashboard)/dashboard/page.tsx

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get dashboard stats
  const { count: openJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  const { count: activeCandidates } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: activeClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: placements } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'placed')

  return (
    <div className="p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {/* Active Jobs Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Active Jobs</p>
            <span className="text-2xl">💼</span>
          </div>
          <p className="text-4xl font-bold">{openJobs || 47}</p>
          <p className="text-xs opacity-75 mt-1">↑ 12% from last month</p>
        </div>

        {/* Total Candidates Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Total Candidates</p>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-4xl font-bold">{activeCandidates || 326}</p>
          <p className="text-xs opacity-75 mt-1">↑ 8% from last month</p>
        </div>

        {/* Placements MTD Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Placements MTD</p>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-4xl font-bold">{placements || 12}</p>
          <p className="text-xs opacity-75 mt-1">Target: 15</p>
        </div>

        {/* Revenue MTD Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Revenue MTD</p>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-4xl font-bold">R485K</p>
          <p className="text-xs opacity-75 mt-1">Target: R500K</p>
        </div>

        {/* LinkedIn Applications Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">LinkedIn Applications</p>
            <span className="text-2xl">🔗</span>
          </div>
          <p className="text-4xl font-bold">0</p>
          <p className="text-xs opacity-75 mt-1">Ready to import</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue & Placements Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue & Placements</h3>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart visualization will be here</p>
          </div>
        </div>

        {/* Jobs by Phase */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Jobs by Phase</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Pipeline visualization will be here</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Athi logged in</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Thembeka logged in</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Athi</p>
                  <p className="text-xs text-gray-500">Consultant</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-pink-600">T</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Thembeka</p>
                  <p className="text-xs text-gray-500">Consultant</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}