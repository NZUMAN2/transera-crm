'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  RiSearchLine, 
  RiFilterLine, 
  RiUserLine, 
  RiBriefcaseLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiDownloadLine
} from 'react-icons/ri'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'candidates' | 'jobs' | 'clients'>('candidates')
  const [filters, setFilters] = useState({
    location: '',
    minSalary: '',
    maxSalary: '',
    experience: '',
    skills: '',
    status: 'all'
  })
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const supabase = createClient()

  // Sample data for demonstration
  const sampleCandidates = [
    { id: 1, name: 'John Doe', role: 'Software Engineer', location: 'New York', salary: 120000, experience: 5, skills: ['React', 'Node.js'], status: 'available' },
    { id: 2, name: 'Jane Smith', role: 'Product Manager', location: 'San Francisco', salary: 150000, experience: 7, skills: ['Agile', 'Scrum'], status: 'interviewing' },
    { id: 3, name: 'Mike Johnson', role: 'UI/UX Designer', location: 'Los Angeles', salary: 95000, experience: 3, skills: ['Figma', 'Adobe XD'], status: 'available' },
    { id: 4, name: 'Sarah Williams', role: 'Data Scientist', location: 'Chicago', salary: 130000, experience: 6, skills: ['Python', 'ML'], status: 'placed' }
  ]

  const sampleJobs = [
    { id: 1, title: 'Senior Developer', company: 'Tech Corp', location: 'Remote', salary: '100k-150k', type: 'Full-time', posted: '2 days ago' },
    { id: 2, title: 'Product Manager', company: 'StartupXYZ', location: 'New York', salary: '120k-180k', type: 'Full-time', posted: '1 week ago' },
    { id: 3, title: 'UX Designer', company: 'Design Studio', location: 'San Francisco', salary: '90k-120k', type: 'Contract', posted: '3 days ago' }
  ]

  async function handleSearch() {
    setLoading(true)
    
    // Simulate search with filters
    setTimeout(() => {
      if (searchType === 'candidates') {
        let filtered = sampleCandidates
        
        if (searchQuery) {
          filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.role.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        if (filters.location) {
          filtered = filtered.filter(c => 
            c.location.toLowerCase().includes(filters.location.toLowerCase())
          )
        }
        
        if (filters.minSalary) {
          filtered = filtered.filter(c => c.salary >= parseInt(filters.minSalary))
        }
        
        if (filters.status !== 'all') {
          filtered = filtered.filter(c => c.status === filters.status)
        }
        
        setResults(filtered)
      } else {
        setResults(sampleJobs)
      }
      
      setLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advanced Search 🔍
          </h1>
          <p className="text-gray-600 mt-1">Find the perfect candidates, jobs, or clients</p>
        </div>
      </div>

      {/* Search Type Selector */}
      <div className="flex gap-2">
        {(['candidates', 'jobs', 'clients'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSearchType(type)}
            className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${
              searchType === type
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {type === 'candidates' && '👥'} 
            {type === 'jobs' && '💼'} 
            {type === 'clients' && '🏢'} 
            {' '}{type}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={`Search ${searchType}...`}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <RiFilterLine /> Filters
          </button>
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
          >
            Search
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <RiMapPinLine className="inline mr-1" /> Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  placeholder="e.g. New York"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <RiMoneyDollarCircleLine className="inline mr-1" /> Min Salary
                </label>
                <input
                  type="number"
                  value={filters.minSalary}
                  onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <RiMoneyDollarCircleLine className="inline mr-1" /> Max Salary
                </label>
                <input
                  type="number"
                  value={filters.maxSalary}
                  onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                  placeholder="e.g. 150000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <RiTimeLine className="inline mr-1" /> Experience (years)
                </label>
                <input
                  type="number"
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  placeholder="e.g. React, Node.js"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="placed">Placed</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span>Searching...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              {searchType === 'candidates' && (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{result.name}</h3>
                      <p className="text-gray-600">{result.role}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      result.status === 'available' ? 'bg-green-100 text-green-600' :
                      result.status === 'interviewing' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📍 {result.location}</p>
                    <p>💰 ${result.salary.toLocaleString()}</p>
                    <p>⏰ {result.experience} years experience</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.skills.map((skill: string) => (
                        <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>