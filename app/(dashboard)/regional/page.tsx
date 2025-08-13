'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCard } from '@/components/ui/animated-card'
import { 
  RiMapPinLine, 
  RiBuilding2Line, 
  RiTrendingUpLine,
  RiGroupLine,
  RiMoneyDollarCircleLine
} from 'react-icons/ri'

export default function RegionalReportsPage() {
  const [regions] = useState([
    { 
      name: 'Western Cape', 
      clients: 12, 
      placements: 45, 
      revenue: 850000,
      growth: '+15%',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Gauteng', 
      clients: 25, 
      placements: 78, 
      revenue: 1500000,
      growth: '+22%',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'KwaZulu-Natal', 
      clients: 8, 
      placements: 23, 
      revenue: 450000,
      growth: '+8%',
      color: 'from-green-500 to-teal-500'
    },
    { 
      name: 'Eastern Cape', 
      clients: 5, 
      placements: 12, 
      revenue: 250000,
      growth: '+12%',
      color: 'from-orange-500 to-red-500'
    }
  ])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Regional Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze recruitment performance across different regions
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {regions.map((region, index) => (
          <motion.div
            key={region.name}
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-5`} />
            
            {/* Card Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${region.color} shadow-lg`}>
                    <RiMapPinLine className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {region.name}
                    </h3>
                    <span className="text-xs text-green-600 font-semibold">
                      {region.growth}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <RiBuilding2Line className="h-4 w-4" />
                    Active Clients
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {region.clients}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <RiGroupLine className="h-4 w-4" />
                    Placements
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {region.placements}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <RiMoneyDollarCircleLine className="h-4 w-4" />
                    Revenue
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    R{(region.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(region.placements / 78) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${region.color}`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Multi-Region Clients */}
      <AnimatedCard delay={0.6}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Multi-Region Clients
          </h2>
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <RiBuilding2Line className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">Woolworths</span>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">
                    Retail & Consumer Goods
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {['WC', 'KZN', 'EC'].map((region) => (
                  <span
                    key={region}
                    className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-xs font-semibold text-purple-600 dark:text-purple-400 shadow"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  )
}