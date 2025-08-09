'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SearchProvider() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      // Search across multiple tables
      const [jobs, candidates, clients] = await Promise.all([
        supabase
          .from('jobs')
          .select('id, title, job_code')
          .ilike('title', `%${query}%`)
          .limit(3),
        supabase
          .from('candidates')
          .select('id, first_name, last_name, email')
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(3),
        supabase
          .from('clients')
          .select('id, company_name')
          .ilike('company_name', `%${query}%`)
          .limit(3)
      ])

      const allResults = [
        ...(jobs.data || []).map(j => ({ ...j, type: 'job', label: j.title })),
        ...(candidates.data || []).map(c => ({ 
          ...c, 
          type: 'candidate', 
          label: `${c.first_name} ${c.last_name}` 
        })),
        ...(clients.data || []).map(c => ({ ...c, type: 'client', label: c.company_name }))
      ]

      setResults(allResults)
      setIsOpen(true)
    }

    const debounce = setTimeout(handleSearch, 300)
    return () => clearTimeout(debounce)
  }, [query, supabase])

  const handleSelect = (result: any) => {
    switch(result.type) {
      case 'job':
        router.push(`/jobs/${result.id}`)
        break
      case 'candidate':
        router.push(`/candidates/${result.id}`)
        break
      case 'client':
        router.push(`/clients/${result.id}`)
        break
    }
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className="relative flex-1 max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search across all data..."
        className="w-full px-4 py-2 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center space-x-3"
            >
              <span className="text-xs font-medium text-purple-600 uppercase">
                {result.type}
              </span>
              <span className="text-sm text-gray-900">{result.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}