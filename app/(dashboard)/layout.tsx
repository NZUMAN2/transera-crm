'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  RiDashboardLine,
  RiBriefcaseLine,
  RiUserLine,
  RiBuilding2Line,
  RiFlowChart,
  RiBarChartBoxLine,
  RiFileListLine,
  RiMapPinLine,
  RiCalculatorLine,
  RiTeamLine,
  RiMenu3Line,
  RiCloseLine,
  RiNotification3Line,
  RiSearchLine,
  RiMoonLine,
  RiSunLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiMailLine,
  RiTaskLine,
  RiFileList3Line,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiHome2Line,
  RiPieChartLine,
  RiUserStarLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiHeartLine,
  RiStarLine,
  RiRocketLine,
  RiFireLine,
  RiTrophyLine,
  RiSparklingLine
} from 'react-icons/ri'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Dynamic import for ChatBox to avoid SSR issues
const ChatBox = dynamic(() => import('@/components/chat/ChatBox'), { ssr: false })

// Main navigation (top bar)
const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: RiDashboardLine, emoji: '🏠', color: 'from-purple-400 to-pink-400' },
  { name: 'Jobs', href: '/jobs', icon: RiBriefcaseLine, emoji: '💼', color: 'from-blue-400 to-cyan-400' },
  { name: 'Candidates', href: '/candidates', icon: RiUserLine, emoji: '👥', color: 'from-green-400 to-teal-400' },
  { name: 'Clients', href: '/clients', icon: RiBuilding2Line, emoji: '🏢', color: 'from-yellow-400 to-orange-400' },
]

// Secondary navigation (sidebar)  
const sidebarNavigation = [
  {
    category: 'Core Features',
    emoji: '🎯',
    items: [
      { name: 'Search', href: '/search', icon: RiSearchLine, emoji: '🔍', color: 'from-purple-400 to-pink-400' },
      { name: 'Calendar', href: '/calendar', icon: RiCalendarLine, emoji: '📅', color: 'from-blue-400 to-cyan-400' },
      { name: 'Pipeline', href: '/pipeline', icon: RiFlowChart, emoji: '🚀', color: 'from-green-400 to-teal-400' },
    ]
  },
  {
    category: 'Analytics',
    emoji: '📊',
    items: [
      { name: 'Performance', href: '/performance', icon: RiBarChartBoxLine, emoji: '📈', color: 'from-purple-400 to-pink-400' },
      { name: 'Regional Reports', href: '/regional', icon: RiMapPinLine, emoji: '🗺️', color: 'from-blue-400 to-cyan-400' },
      { name: 'Reports', href: '/reports', icon: RiFileListLine, emoji: '📋', color: 'from-green-400 to-teal-400' },
    ]
  },
  {
    category: 'Workflow',
    emoji: '⚡',
    items: [
      { name: 'Recruitment Flow', href: '/workflow', icon: RiFlowChart, emoji: '🔄', color: 'from-orange-400 to-red-400' },
      { name: 'CV Submissions', href: '/submissions', icon: RiFileList3Line, emoji: '📄', color: 'from-indigo-400 to-purple-400' },
      { name: 'Tasks', href: '/tasks', icon: RiTaskLine, emoji: '✅', color: 'from-pink-400 to-rose-400' },
    ]
  },
  {
    category: 'Tools',
    emoji: '🛠️',
    items: [
      { name: 'Fee Calculator', href: '/calculator', icon: RiCalculatorLine, emoji: '💰', color: 'from-yellow-400 to-orange-400' },
      { name: 'Team', href: '/team', icon: RiTeamLine, emoji: '👨‍👩‍👧‍👦', color: 'from-cyan-400 to-blue-400' },
      { name: 'Email Templates', href: '/email', icon: RiMailLine, emoji: '📧', color: 'from-teal-400 to-green-400' },
    ]
  }
]

export default function ModernLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: '🎉 New candidate application', time: '5 min ago', unread: true },
    { id: 2, text: '📅 Interview scheduled', time: '1 hour ago', unread: true },
    { id: 3, text: '✅ Client approved job posting', time: '3 hours ago', unread: false },
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50/30 to-pink-50/20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full opacity-10 blur-3xl animate-pulse" />
      </div>

      {/* Enhanced Top Navigation Bar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl shadow-xl border-b border-purple-100'
            : 'bg-white/60 backdrop-blur-xl'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with Menu Toggle */}
            <div className="flex items-center space-x-4">
              {/* Sidebar Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all"
              >
                <RiMenu3Line className="h-5 w-5 text-purple-600" />
              </motion.button>

              {/* Logo */}
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-10 w-10"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">✨</span>
                  </div>
                </motion.div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    TransEra
                  </span>
                  <span className="text-xs text-purple-400 block -mt-1">CRM Pro 🚀</span>
                </div>
              </Link>
            </div>

            {/* Main Navigation - Only Essential Items */}
            <nav className="hidden md:flex items-center space-x-2">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-2 rounded-xl group transition-all duration-200"
                  >
                    <motion.div
                      className={`flex items-center space-x-2 ${
                        isActive
                          ? 'text-purple-600'
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </motion.div>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.25 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* User Profile */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 hover:from-purple-200 hover:via-pink-200 hover:to-blue-200 transition-all"
                >
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">👤</span>
                  </div>
                  <span className="text-sm font-medium text-purple-700 hidden xl:block">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <RiLogoutBoxLine className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-700">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", bounce: 0.25 }}
              className={`fixed left-0 top-16 bottom-0 ${
                sidebarExpanded ? 'w-64' : 'w-20'
              } bg-white/90 backdrop-blur-xl shadow-2xl border-r border-purple-100 z-40 overflow-hidden transition-all duration-300`}
            >
              {/* Sidebar Navigation */}
              <nav className="px-4 pb-4 space-y-6 mt-4">
                {sidebarNavigation.map((category, categoryIndex) => (
                  <div key={category.category}>
                    {sidebarExpanded && (
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>{category.emoji}</span>
                        {category.category}
                      </h3>
                    )}
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => !sidebarExpanded && setSidebarOpen(false)}
                          >
                            <motion.div
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: categoryIndex * 0.1 + itemIndex * 0.05 }}
                              className={`flex items-center ${
                                sidebarExpanded ? 'space-x-3' : 'justify-center'
                              } px-3 py-2.5 rounded-xl transition-all ${
                                isActive
                                  ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                                  : 'hover:bg-gradient-to-r hover:' + item.color + ' hover:text-white'
                              }`}
                            >
                              <span className="text-xl">{item.emoji}</span>
                              {sidebarExpanded && (
                                <span className="text-sm font-medium">{item.name}</span>
                              )}
                            </motion.div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : ''
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 sm:px-6 lg:px-8 py-8"
        >
          {/* Page Content */}
          <div className="relative z-10">
            {children}
          </div>
        </motion.div>
      </main>

      {/* Chat Box */}
      <ChatBox />
    </div>
  )
}