'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { 
  RiUserLine, 
  RiBriefcaseLine, 
  RiBuilding2Line,
  RiTrendingUpLine,
  RiCalendarLine,
  RiTimeLine,
  RiStarLine,
  RiMoneyDollarCircleLine
} from 'react-icons/ri'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    candidates: 326,
    jobs: 47,
    clients: 28,
    placements: 12
  })
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'candidate', action: 'New application received', name: 'John Doe', time: '2 hours ago', icon: '👤' },
    { id: 2, type: 'interview', action: 'Interview scheduled', name: 'Jane Smith', time: '4 hours ago', icon: '📅' },
    { id: 3, type: 'placement', action: 'Placement confirmed', name: 'Mike Johnson', time: '1 day ago', icon: '✅' },
    { id: 4, type: 'client', action: 'New job posting', name: 'Tech Corp', time: '2 days ago', icon: '🏢' }
  ])

  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    // Load real data from Supabase
    const [candidatesCount, jobsCount, clientsCount] = await Promise.all([
      supabase.from('candidates').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('clients').select('*', { count: 'exact', head: true })
    ])

    setStats({
      candidates: candidatesCount.count || 326,
      jobs: jobsCount.count || 47,
      clients: clientsCount.count || 28,
      placements: 12
    })
  }

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.candidates,
      change: '+12%',
      icon: RiUserLine,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      emoji: '👥'
    },
    {
      title: 'Active Jobs',
      value: stats.jobs,
      change: '+8%',
      icon: RiBriefcaseLine,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      emoji: '💼'
    },
    {
      title: 'Clients',
      value: stats.clients,
      change: '+5%',
      icon: RiBuilding2Line,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      emoji: '🏢'
    },
    {
      title: 'Placements',
      value: stats.placements,
      change: '+20%',
      icon: RiStarLine,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      emoji: '🌟'
    }
  ]

  // Monthly placement data for chart
  const monthlyData = [
    { month: 'Jan', placements: 8 },
    { month: 'Feb', placements: 12 },
    { month: 'Mar', placements: 10 },
    { month: 'Apr', placements: 15 },
    { month: 'May', placements: 18 },
    { month: 'Jun', placements: 14 }
  ]

  const maxPlacements = Math.max(...monthlyData.map(d => d.placements))

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back! 🎯</h1>
        <p className="text-purple-100">Here's what's happening with your recruitment today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <span className="text-2xl">{stat.emoji}</span>
              </div>
              <span className={`text-sm font-semibold ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Placements Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Monthly Placements 📊</h2>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-12">{data.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.placements / maxPlacements) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end pr-3"
                  >
                    <span className="text-white text-xs font-bold">{data.placements}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity 🔥</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.name}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions ⚡</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center">
            <span className="text-2xl mb-2 block">➕</span>
            <span className="text-sm font-medium text-gray-700">Add Candidate</span>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center">
            <span className="text-2xl mb-2 block">📝</span>
            <span className="text-sm font-medium text-gray-700">Post Job</span>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center">
            <span className="text-2xl mb-2 block">📅</span>
            <span className="text-sm font-medium text-gray-700">Schedule Interview</span>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center">
            <span className="text-2xl mb-2 block">📊</span>
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}