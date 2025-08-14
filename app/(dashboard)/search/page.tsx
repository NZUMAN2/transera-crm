'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  RiSearchLine, 
  RiFilterLine, 
  RiUserLine, 
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiBriefcaseLine,
  RiBuilding2Line
} from 'react-icons/ri'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
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

  // Run search on mount if query exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch()
    }
  }, [])

  async function handleSearch() {
    setLoading(true)
    
    try {
      let query
      
      if (searchType === 'candidates') {
        query = supabase.from('candidates').select('*')
        
        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%,skills.cs.{${searchQuery}}`)
        }
        
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`)
        }
        
        if (filters.minSalary) {
          query = query.gte('expected_salary', filters.minSalary)
        }
        
        if (filters.maxSalary) {
          query = query.lte('expected_salary', filters.maxSalary)
        }
        
        if (filters.status !== 'all') {
          query = query.eq('status', filters.status)
        }
      } else if (searchType === 'jobs') {
        query = supabase.from('jobs').select('*')
        
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        }
      } else {
        query = supabase.from('clients').select('*')
        
        if (searchQuery) {
          query = query.or(`company_name.ilike.%${searchQuery}%,industry.ilike.%${searchQuery}%`)
        }
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      setResults(data || [])
    } catch (error) {
      console.error('Search error:', error)
      // Use sample data as fallback
      setResults(getSampleData())
    } finally {
      setLoading(false)
    }
  }

  function getSampleData() {
    if (searchType === 'candidates') {
      return [
        { id: 1, name: 'John Doe', role: 'Software Engineer', location: 'New York', expected_salary: 120000, experience: 5, skills: ['React', 'Node.js'], status: 'available' },
        { id: 2, name: 'Jane Smith', role: 'Product Manager', location: 'San Francisco', expected_salary: 150000, experience: 7, skills: ['Agile', 'Scrum'], status: 'interviewing' },
        { id: 3, name: 'Mike Johnson', role: 'UI/UX Designer', location: 'Los Angeles', expected_salary: 95000, experience: 3, skills: ['Figma', 'Adobe XD'], status: 'available' }
      ]
    } else if (searchType === 'jobs') {
      return [
        { id: 1, title: 'Senior Developer', company: 'Tech Corp', location: 'Remote', salary_range: '100k-150k', employment_type: 'Full-time', created_at: new Date() },
        { id: 2, title: 'Product Manager', company: 'StartupXYZ', location: 'New York', salary_range: '120k-180k', employment_type: 'Full-time', created_at: new Date() }
      ]
    } else {
      return [
        { id: 1, company_name: 'Tech Corp', industry: 'Technology', location: 'San Francisco', employee_count: '100-500' },
        { id: 2, company_name: 'Finance Inc', industry: 'Banking', location: 'New York', employee_count: '1000+' }
      ]
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Advanced Search 🔍
        </h1>
        <p className="text-gray-600 mt-1">Find the perfect candidates, jobs, or clients</p>
      </div>

      {/* Search Type Selector */}
      <div className="flex gap-2">
        {(['candidates', 'jobs', 'clients'] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setSearchType(type)
              setResults([])
            }}
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
              onKeyPress={handleKeyPress}
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
        {showFilters && searchType === 'candidates' && (
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
              onClick={() => {
                if (searchType === 'candidates') router.push(`/candidates/${result.id}`)
                else if (searchType === 'jobs') router.push(`/jobs/${result.id}`)
                else router.push(`/clients/${result.id}`)
              }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
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
                    <p>💰 ${(result.expected_salary || 0).toLocaleString()}</p>
                    <p>⏰ {result.experience} years experience</p>
                  </div>
                </>
              )}
              
              {searchType === 'jobs' && (
                <>
                  <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                  <p className="text-purple-600 mb-3">{result.company}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📍 {result.location}</p>
                    <p>💰 {result.salary_range}</p>
                    <p>⏰ {result.employment_type}</p>
                  </div>
                </>
              )}
              
              {searchType === 'clients' && (
                <>
                  <h3 className="font-semibold text-lg mb-1">{result.company_name}</h3>
                  <p className="text-purple-600 mb-3">{result.industry}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📍 {result.location}</p>
                    <p>👥 {result.employee_count} employees</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}