import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export function useActivityTracker() {
  const router = useRouter()
  const supabase = createClient()
  
  const trackActivity = useCallback(async (activityType: string, metadata?: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const sessionId = sessionStorage.getItem('session_id') || uuidv4()
    sessionStorage.setItem('session_id', sessionId)

    await supabase.from('user_activity').insert({
      user_id: user.id,
      session_id: sessionId,
      page_visited: window.location.pathname,
      activity_type: activityType,
      metadata: metadata,
      ip_address: null, // Will be set server-side
      user_agent: navigator.userAgent
    })

    // Update last active
    await supabase.from('user_sessions').upsert({
      user_id: user.id,
      session_token: sessionId,
      is_online: true,
      last_active_at: new Date().toISOString()
    }, {
      onConflict: 'session_token'
    })
  }, [supabase])

  // Track page views
  useEffect(() => {
    trackActivity('page_view')
  }, [router.pathname])

  // Track user online status
  useEffect(() => {
    const interval = setInterval(() => {
      trackActivity('heartbeat')
    }, 30000) // Every 30 seconds

    // Set offline on unmount
    return () => {
      clearInterval(interval)
      trackActivity('offline')
    }
  }, [])

  return { trackActivity }
}