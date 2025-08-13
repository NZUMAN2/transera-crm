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
  RiArrowDownLine,
  RiTimeLine,
  RiCheckLine
} from 'react-icons/ri'

export default function ModernDashboard() {
  const [stats] = useState({
    candidates: 326,
    jobs: 47,
    clients: 28,
    placements: 12
  })

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
      change: '+5%',
      trend: 'up',
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
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to TransEra CRM!</h1>
          <p className="text-purple-100 text-lg">Here's what's happening with your recruitment today.</p>
        </div>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <AnimatedCard key={stat.title} delay={index * 0.1}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
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
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Quick Actions */}
      <AnimatedCard delay={0.4}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 gradient-text">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <ModernButton variant="primary">
              <RiUserLine className="mr-2" />
              Add Candidate
            </ModernButton>
            <ModernButton variant="secondary">
              <RiBriefcaseLine className="mr-2" />
              Post Job
            </ModernButton>
            <ModernButton variant="ghost">
              <RiBuilding2Line className="mr-2" />
              Add Client
            </ModernButton>
          </div>
        </div>
      </AnimatedCard>

      {/* Recent Activity */}
      <AnimatedCard delay={0.5}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 gradient-text">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { icon: RiCheckLine, text: 'New candidate added', time: '2 hours ago', color: 'text-green-500' },
              { icon: RiBriefcaseLine, text: 'Job posted to LinkedIn', time: '4 hours ago', color: 'text-blue-500' },
              { icon: RiTimeLine, text: 'Interview scheduled', time: '6 hours ago', color: 'text-purple-500' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
                <span className="flex-1 text-gray-700">{activity.text}</span>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedCard>
    </div>
  )
}