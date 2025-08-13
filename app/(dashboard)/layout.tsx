// app/(dashboard)/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, Users, Briefcase, Building, BarChart3, 
  Calendar, Mail, LogOut, CheckSquare, Calculator,
  MapPin, Workflow, Upload, UserCheck, Settings,
  FileText, DollarSign, Target, Award, Bell
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile for role-based navigation
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('full_name, role, department')
    .eq('user_id', user.id)
    .single()

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and quick stats'
    },
    {
      name: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
      description: 'Manage job openings'
    },
    {
      name: 'Candidates',
      href: '/candidates',
      icon: Users,
      description: 'Candidate management'
    },
    {
      name: 'Clients',
      href: '/clients',
      icon: Building,
      description: 'Client relationship management'
    },
    {
      name: 'Workflow',
      href: '/workflow',
      icon: Workflow,
      description: 'Recruitment pipeline',
      badge: 'New'
    },
    {
      name: 'Performance',
      href: '/performance',
      icon: Target,
      description: 'Team performance tracking',
      badge: 'New'
    },
    {
      name: 'CV Submissions',
      href: '/submissions',
      icon: Upload,
      description: 'Bulk CV management',
      badge: 'New'
    },
    {
      name: 'Regional Reports',
      href: '/regional',
      icon: MapPin,
      description: 'Regional analytics',
      badge: 'New'
    },
    {
      name: 'Fee Calculator',
      href: '/calculator',
      icon: Calculator,
      description: 'Placement fee calculator',
      badge: 'New'
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      description: 'Task management'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      description: 'Analytics and reports'
    },
    {
      name: 'Email Templates',
      href: '/email',
      icon: Mail,
      description: 'Email automation'
    }
  ]

  // Admin/Manager only items
  const adminItems = [
    {
      name: 'Team Management',
      href: '/team',
      icon: UserCheck,
      description: 'Manage team members',
      badge: 'New'
    },
    {
      name: 'Xero Integration',
      href: '/xero',
      icon: DollarSign,
      description: 'Accounting integration',
      badge: 'New'
    },
    {
      name: 'System Settings',
      href: '/settings',
      icon: Settings,
      description: 'System configuration'
    }
  ]

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'manager'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-purple-600">TransEra CRM</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                <span className="text-sm text-gray-500">
                  Welcome back, {userProfile?.full_name || user.email}
                </span>
                {userProfile?.role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {userProfile.role}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
              
              {/* User Menu */}
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
          <div className="p-4">
            <div className="space-y-1">
              {/* Main Navigation */}
              <div className="mb-6">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Main Menu
                </h3>
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <item.icon className="flex-shrink-0 mr-3 h-5 w-5" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Admin Section */}
              {isAdmin && (
                <div className="mb-6">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Administration
                  </h3>
                  {adminItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="flex-shrink-0 mr-3 h-5 w-5" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-600">Active Jobs</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">Candidates</span>
                    <span className="font-medium">326</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">This Month</span>
                    <span className="font-medium">12 placements</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Recent Activity</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>New candidate added</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span>Job posted to LinkedIn</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    <span>Interview scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500">
                © 2025 TransEra Solutions. All rights reserved.
              </p>
              <span className="text-sm text-gray-400">•</span>
              <p className="text-sm text-gray-500">
                Version 2.0
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="text-sm text-gray-500 hover:text-gray-700">
                Help
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// components/ui/progress.tsx (if not already created)
import * as React from "react"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }