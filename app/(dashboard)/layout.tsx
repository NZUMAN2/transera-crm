// app/(dashboard)/layout.tsx

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const signOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/jobs', label: 'Jobs', icon: '💼' },
    { href: '/candidates', label: 'Candidates', icon: '👥' },
    { href: '/workflow', label: 'Workflow', icon: '⚡' },
    { href: '/tasks', label: 'My Tasks', icon: '✓' },
    { href: '/clients', label: 'Clients', icon: '🏢' },
    { href: '/reports', label: 'Reports', icon: '📈' },
    { href: '/email', label: 'Email', icon: '✉️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <span className="text-2xl font-bold">TS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">TransEra Solutions</h1>
                <p className="text-xs text-purple-200">Professional Recruitment CRM</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search across all data..."
                  className="w-full px-4 py-2 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-purple-200 hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <button className="flex items-center space-x-2 text-purple-200 hover:text-white">
                <span>📥 Import</span>
              </button>
              
              <button className="flex items-center space-x-2 text-purple-200 hover:text-white">
                <span>📤 Export</span>
              </button>
              
              <button className="flex items-center space-x-2 text-purple-200 hover:text-white">
                <span>✉️ Email</span>
              </button>
              
              <button className="flex items-center space-x-2 text-purple-200 hover:text-white">
                <span>🔗 LinkedIn</span>
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-purple-600">
                <div className="text-right">
                  <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-purple-300">{profile?.role || 'Consultant'}</p>
                </div>
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                  </span>
                </div>
                <form action={signOut}>
                  <button type="submit" className="text-purple-200 hover:text-white text-sm">
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-purple-800 bg-opacity-50">
          <div className="px-4">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium text-purple-200 hover:text-white hover:bg-purple-700 hover:bg-opacity-50 rounded-t-lg transition-colors flex items-center space-x-2"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}