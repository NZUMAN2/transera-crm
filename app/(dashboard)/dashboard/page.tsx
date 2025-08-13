'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCard } from '@/components/ui/animated-card'
import { ModernButton } from '@/components/ui/modern-button'
import { 
  RiUserLine, 
  RiBriefcaseLine, 
  RiBuilding2Line,
  RiTrophyLine,
  RiArrowUpLine,
  RiArrowDownLine
} from 'react-icons/ri'
import { createClient } from '@/lib/supabase/client'

export default function ModernDashboard() {
  const [stats, setStats] = useState({
    candidates: 326,
    jobs: 47,
    clients: 28,
    placements: 12,
    revenue: 2320000
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.candidates,
      icon: RiUserLine,
      change: '+12%',
      trend: 'up',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Active Jobs',
      value: stats.jobs,
      icon: RiBriefcaseLine,
      change: '+8%',
      trend: 'up',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Clients',
      value: stats.clients,
      icon: RiBuilding2Line,
      change: '-2%',
      trend: 'down',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Placements',
      value: stats.placements,
      icon: RiTrophyLine,
      change: '+23%',
      trend: 'up',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        style={{
          backgroundSize: '200% 100%',
          animation: 'gradient 8s linear infinite'
        }}
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back to TransEra CRM!</h1>
        <p className="text-purple-100">Here's what's happening with your recruitment today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <AnimatedCard key={stat.title} delay={index * 0.1}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <RiArrowUpLine className="h-4 w-4" />
                  ) : (
                    <RiArrowDownLine className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.title === 'Revenue' 
                    ? `R${(stat.value / 1000).toFixed(0)}K`
                    : stat.value.toLocaleString()
                  }
                </p>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <ModernButton variant="primary">
          Add New Candidate
        </ModernButton>
        <ModernButton variant="secondary">
          Post New Job
        </ModernButton>
        <ModernButton variant="ghost">
          View Reports
        </ModernButton>
      </div>

      {/* Activity Timeline */}
      <AnimatedCard delay={0.5}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { text: 'New candidate added', time: '2 hours ago', color: 'bg-green-500' },
              { text: 'Job posted to LinkedIn', time: '4 hours ago', color: 'bg-blue-500' },
              { text: 'Interview scheduled', time: '6 hours ago', color: 'bg-purple-500' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className={`h-2 w-2 rounded-full ${activity.color} animate-pulse`} />
                <span className="text-gray-700">{activity.text}</span>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedCard>
    </div>
  )
}