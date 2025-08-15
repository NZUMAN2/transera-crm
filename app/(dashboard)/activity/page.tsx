// app/(dashboard)/activity/page.tsx (NEW FILE)
'use client'

import { useState, useEffect } from 'react'

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('activities') || '[]')
    setActivities(stored.reverse()) // Show newest first
  }, [])

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.table === filter)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Activity Log</h1>
      
      <div className="mb-4 flex gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('candidates')}
          className={`px-4 py-2 rounded ${filter === 'candidates' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Candidates
        </button>
        <button 
          onClick={() => setFilter('jobs')}
          className={`px-4 py-2 rounded ${filter === 'jobs' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Jobs
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredActivities.map((activity, index) => (
          <div key={index} className="p-4 border-b hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600">
                  by {activity.user || 'Unknown'} • {new Date(activity.timestamp).toLocaleString()}
                </p>
                {activity.changes && (
                  <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                    Changes: {JSON.stringify(activity.changes)}
                  </div>
                )}
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {activity.table}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}