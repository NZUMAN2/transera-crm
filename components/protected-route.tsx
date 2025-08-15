'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode
  requiredRole?: string 
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    
    if (!loading && user && requiredRole && user.role !== requiredRole) {
      router.push('/dashboard')
    }
  }, [loading, user, requiredRole, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Access Denied</p>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}