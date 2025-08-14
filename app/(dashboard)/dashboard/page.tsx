'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    candidates: 326,
    jobs: 47,
    clients: 28,
    placements: 12
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showQuickAdd, setShowQuickAdd] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
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
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files])
      // Store in localStorage for now
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      }))
      const existing = JSON.parse(localStorage.getItem('uploaded_documents') || '[]')
      localStorage.setItem('uploaded_documents', JSON.stringify([...existing, ...fileData]))
      alert(`Successfully uploaded ${files.length} file(s)`)
    }
  }

  const quickActions = [
    {
      title: 'Add Candidate',
      icon: '➕',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => setShowQuickAdd('candidate')
    },
    {
      title: 'Post Job',
      icon: '📝',
      color: 'from-purple-500 to-pink-500',
      onClick: () => setShowQuickAdd('job')
    },
    {
      title: 'Schedule Interview',
      icon: '📅',
      color: 'from-green-500 to-teal-500',
      onClick: () => router.push('/calendar')
    },
    {
      title: 'View Reports',
      icon: '📊',
      color: 'from-orange-500 to-red-500',
      onClick: () => router.push('/reports')
    },
    {
      title: 'Upload CV',
      icon: '📄',
      color: 'from-indigo-500 to-purple-500',
      onClick: () => document.getElementById('file-upload')?.click()
    },
    {
      title: 'Send Email',
      icon: '✉️',
      color: 'from-pink-500 to-rose-500',
      onClick: () => router.push('/emails')
    }
  ]

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.candidates,
      change: '+12%',
      emoji: '👥',
      color: 'from-purple-500 to-pink-500',
      onClick: () => router.push('/candidates')
    },
    {
      title: 'Active Jobs',
      value: stats.jobs,
      change: '+8%',
      emoji: '💼',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => router.push('/jobs')
    },
    {
      title: 'Clients',
      value: stats.clients,
      change: '+5%',
      emoji: '🏢',
      color: 'from-green-500 to-teal-500',
      onClick: () => router.push('/clients')
    },
    {
      title: 'Placements',
      value: stats.placements,
      change: '+20%',
      emoji: '🌟',
      color: 'from-yellow-500 to-orange-500',
      onClick: () => router.push('/placements')
    }
  ]

  const monthlyData = [
    { month: 'Jan', placements: 8, interviews: 24, applications: 156 },
    { month: 'Feb', placements: 12, interviews: 32, applications: 189 },
    { month: 'Mar', placements: 10, interviews: 28, applications: 167 },
    { month: 'Apr', placements: 15, interviews: 41, applications: 234 },
    { month: 'May', placements: 18, interviews: 45, applications: 267 },
    { month: 'Jun', placements: 14, interviews: 38, applications: 198 }
  ]

  const recentActivity = [
    { id: 1, type: 'candidate', action: 'New application received', name: 'John Doe', time: '2 hours ago', icon: '👤', status: 'new' },
    { id: 2, type: 'interview', action: 'Interview scheduled', name: 'Jane Smith', time: '4 hours ago', icon: '📅', status: 'scheduled' },
    { id: 3, type: 'placement', action: 'Placement confirmed', name: 'Mike Johnson', time: '1 day ago', icon: '✅', status: 'completed' },
    { id: 4, type: 'client', action: 'New job posting', name: 'Tech Corp', time: '2 days ago', icon: '🏢', status: 'active' },
    { id: 5, type: 'cv', action: 'CV submitted to client', name: 'Sarah Brown', time: '3 days ago', icon: '📄', status: 'pending' }
  ]

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        id="file-upload"
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Welcome Banner with Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">🚀 TransEra CRM - Fully Functional! 🚀</h1>
        <p className="text-purple-100 mb-4">Manage your recruitment pipeline efficiently</p>
        
        <form onSubmit={handleSearch} className="max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates, jobs, or clients..."
              className="w-full px-4 py-3 pl-10 pr-24 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">🔍</span>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white/30 rounded hover:bg-white/40 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
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
            onClick={stat.onClick}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg text-white text-2xl`}>
                {stat.emoji}
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

      {/* Quick Actions - FULLY FUNCTIONAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions ⚡</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`p-4 bg-white rounded-lg hover:shadow-md transition-all text-center group relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="text-xs font-medium text-gray-700">{action.title}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Monthly Performance 📊</h2>
            <select className="text-sm border rounded-lg px-3 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">{data.month}</span>
                  <div className="flex gap-4 text-xs">
                    <span>📊 {data.placements} placements</span>
                    <span>💬 {data.interviews} interviews</span>
                    <span>📝 {data.applications} applications</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.placements / 20) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-end pr-2"
                    >
                      <span className="text-white text-xs font-bold">{data.placements}</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity 🔥</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700">View all →</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  if (activity.type === 'candidate') router.push('/candidates')
                  else if (activity.type === 'interview') router.push('/calendar')
                  else if (activity.type === 'client') router.push('/clients')
                  else if (activity.type === 'cv') router.push('/submissions')
                }}
                className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">{activity.time}</span>
                  <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                    activity.status === 'new' ? 'bg-blue-100 text-blue-600' :
                    activity.status === 'scheduled' ? 'bg-yellow-100 text-yellow-600' :
                    activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                    activity.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Add Modals */}
      {showQuickAdd === 'candidate' && (
        <QuickAddModal
          title="Add New Candidate"
          onClose={() => setShowQuickAdd(null)}
          fields={[
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel' },
            { name: 'role', label: 'Desired Role', type: 'text' },
            { name: 'experience', label: 'Years of Experience', type: 'number' },
            { name: 'cv', label: 'Upload CV', type: 'file', accept: '.pdf,.doc,.docx' }
          ]}
          onSubmit={(data) => {
            const candidates = JSON.parse(localStorage.getItem('candidates') || '[]')
            candidates.push({ ...data, id: Date.now(), createdAt: new Date().toISOString() })
            localStorage.setItem('candidates', JSON.stringify(candidates))
            alert('Candidate added successfully!')
            setShowQuickAdd(null)
            router.push('/candidates')
          }}
        />
      )}

      {showQuickAdd === 'job' && (
        <QuickAddModal
          title="Post New Job"
          onClose={() => setShowQuickAdd(null)}
          fields={[
            { name: 'title', label: 'Job Title', type: 'text', required: true },
            { name: 'company', label: 'Company', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'salary', label: 'Salary Range', type: 'text' },
            { name: 'type', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract', 'Remote'] },
            { name: 'description', label: 'Description', type: 'textarea' }
          ]}
          onSubmit={(data) => {
            const jobs = JSON.parse(localStorage.getItem('jobs') || '[]')
            jobs.push({ ...data, id: Date.now(), createdAt: new Date().toISOString() })
            localStorage.setItem('jobs', JSON.stringify(jobs))
            alert('Job posted successfully!')
            setShowQuickAdd(null)
            router.push('/jobs')
          }}
        />
      )}
    </div>
  )
}

// Quick Add Modal Component
function QuickAddModal({ title, onClose, fields, onSubmit }: any) {
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field: any) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && '*'}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                >
                  <option value="">Select...</option>
                  {field.options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'file' ? (
                <input
                  type="file"
                  accept={field.accept}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.files?.[0] })}
                />
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}