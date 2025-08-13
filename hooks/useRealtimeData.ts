'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeData(table: string) {
  const [data, setData] = useState<any[]>([])
  
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        (payload) => {
          // Update data when changes occur
          if (payload.eventType === 'INSERT') {
            setData(prev => [...prev, payload.new])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table])

  return data
}