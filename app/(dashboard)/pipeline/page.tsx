'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PipelinePage() {
  const router = useRouter()
  
  // Redirect to a default pipeline or show all pipelines
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Select a Pipeline 🚀
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => router.push('/pipeline/general')}
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all"
        >
          <h3 className="font-bold text-lg mb-2">General Pipeline</h3>
          <p className="text-gray-600">View all candidates</p>
        </button>
      </div>
    </div>
  )
}