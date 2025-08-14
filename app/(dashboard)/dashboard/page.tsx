'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  RiUserLine, 
  RiBriefcaseLine, 
  RiBuilding2Line,
  RiStarLine,
  RiSearchLine
} from 'react-icons/ri'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    candidates: 326,
    jobs: 47,
    clients: 28,
    placements: 12
  })
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const quickActions = [
    {
      title: 'Add Candidate',
      icon: '➕',
      onClick: () => router.push('/candidates/new')
    },
    {
      title: 'Post Job',
      icon: '📝',
      onClick: () => router.push('/jobs/new')
    },
    {
      title: 'Schedule Interview',
      icon: '📅',
      onClick: () => router.push('/calendar')
    },
    {
      title: 'View Reports',
      icon: '📊',
      onClick: () => router.push('/reports')
    }
  ]

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.candidates,
      change: '+12%',
      emoji: '👥',
      onClick: () => router.push('/candidates')
    },
    {
      title: 'Active Jobs',
      value: stats.jobs,
      change: '+8%',
      emoji: '💼',
      onClick: () => router.push('/jobs')
    },
    {
      title: 'Clients',
      value: stats.clients,
      change: '+5%',
      emoji: '🏢',
      onClick: () => router.push('/clients')
    },
    {
      title: 'Placements',
      value: stats.placements,
      change: '+20%',
      emoji: '🌟',
      onClick: () => router.push('/placements')
    }
  ]

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back! 🎯</h1>
        <p className="text-purple-100 mb-4">Here's what's happening with your recruitment today.</p>
        
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates, jobs, or clients..."
              className="w-full px-4 py-2 pl-10 pr-20 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/30 rounded hover:bg-white/40 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={stat.onClick}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Placements 📊</h2>
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

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity 🔥</h2>
          <div className="space-y-4">
            {[
              { icon: '👤', action: 'New application received', name: 'John Doe', time: '2 hours ago' },
              { icon: '📅', action: 'Interview scheduled', name: 'Jane Smith', time: '4 hours ago' },
              { icon: '✅', action: 'Placement confirmed', name: 'Mike Johnson', time: '1 day ago' },
              { icon: '🏢', action: 'New job posting', name: 'Tech Corp', time: '2 days ago' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions ⚡</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="text-sm font-medium text-gray-700">{action.title}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}