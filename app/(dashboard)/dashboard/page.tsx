// app/(dashboard)/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch real stats
  const [
    { count: jobsCount },
    { count: candidatesCount },
    { count: clientsCount },
    { data: recentPlacements }
  ] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('candidates').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('placements').select('*').order('created_at', { ascending: false }).limit(5)
  ])

  const stats = [
    {
      title: 'Active Jobs',
      value: jobsCount || 0,
      icon: Briefcase,
      change: '+12%',
      changeType: 'positive',
      link: '/jobs'
    },
    {
      title: 'Total Candidates',
      value: candidatesCount || 0,
      icon: Users,
      change: '+8%',
      changeType: 'positive',
      link: '/candidates'
    },
    {
      title: 'Active Clients',
      value: clientsCount || 0,
      icon: Building2,
      change: '+5%',
      changeType: 'positive',
      link: '/clients'
    },
    {
      title: 'Revenue MTD',
      value: 'R485K',
      icon: DollarSign,
      change: '+15%',
      changeType: 'positive',
      link: '/reports'
    }
  ]

  const quickActions = [
    { title: 'Add New Job', icon: Briefcase, link: '/jobs/new', color: 'bg-purple-500' },
    { title: 'Add Candidate', icon: Users, link: '/candidates/new', color: 'bg-blue-500' },
    { title: 'Add Client', icon: Building2, link: '/clients/new', color: 'bg-green-500' },
    { title: 'View Reports', icon: TrendingUp, link: '/reports', color: 'bg-orange-500' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-purple-100 mt-2">Here's what's happening with your recruitment pipeline today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.link}>
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">from last month</span>
                    </div>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.link}>
                <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all w-full">
                  <div className={`${action.color} rounded-full p-3 text-white mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.title}</span>
                </button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New candidate added</p>
                <p className="text-xs text-gray-500">John Doe - Senior Developer</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Job posted</p>
                <p className="text-xs text-gray-500">UI/UX Designer at TechCorp</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Interview scheduled</p>
                <p className="text-xs text-gray-500">Jane Smith - Tomorrow 10:00 AM</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Sourcing</span>
                <span className="text-sm font-medium text-gray-900">15 candidates</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Screening</span>
                <span className="text-sm font-medium text-gray-900">8 candidates</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Interview</span>
                <span className="text-sm font-medium text-gray-900">5 candidates</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Offer</span>
                <span className="text-sm font-medium text-gray-900">2 candidates</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
          <Link href="/tasks" className="text-sm text-purple-600 hover:text-purple-700">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Follow up with candidate</p>
                <p className="text-xs text-gray-500">John Doe - Senior Developer position</p>
              </div>
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">10:00 AM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Client meeting</p>
                <p className="text-xs text-gray-500">TechCorp - Discuss new requirements</p>
              </div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">2:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  )
}