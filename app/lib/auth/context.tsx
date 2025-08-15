// 1. Create lib/auth/auth-context.tsx (NEW FILE)
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'consultant' | 'manager'
}

const AuthContext = createContext<{
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem('auth_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // For now, simple validation - replace with real API later
    const users = [
      { id: '1', email: 'admin@transera.com', password: 'admin123', name: 'Admin', role: 'admin' as const },
      { id: '2', email: 'lillian@transera.com', password: 'lillian123', name: 'Lillian', role: 'consultant' as const },
      { id: '3', email: 'athi@transera.com', password: 'athi123', name: 'Athi', role: 'consultant' as const }
    ]

    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (!foundUser) {
      throw new Error('Invalid credentials')
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword))
    router.push('/dashboard')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)