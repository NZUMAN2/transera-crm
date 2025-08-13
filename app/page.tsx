'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // User is logged in, go to dashboard
      router.push('/dashboard')
    } else {
      // No user, go directly to login
      router.push('/login')
    }
  }

  // Loading state while checking authentication
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-purple-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}
