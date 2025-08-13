'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
import ChatBox from '@/components/chat/ChatBox' // ADD THIS IMPORT AT THE TOP

// Main navigation (top bar)
const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: RiDashboardLine, emoji: '🏠' },
  { name: 'Jobs', href: '/jobs', icon: RiBriefcaseLine, emoji: '💼' },
  { name: 'Candidates', href: '/candidates', icon: RiUserLine, emoji: '👥' },
  { name: 'Clients', href: '/clients', icon: RiBuilding2Line, emoji: '🏢' },
]

// Secondary navigation (sidebar)
const sidebarNavigation = [
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
              {/* Search Bar */}
              <div className="hidden lg:flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="🔍 Search anything..."
                    className="w-64 pl-12 pr-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 
                             focus:from-white focus:to-white focus:outline-none focus:ring-2 focus:ring-purple-400 
                             focus:shadow-lg transition-all duration-200 text-sm placeholder-purple-400"
                  />
                  <RiSearchLine className="absolute left-4 top-3 h-5 w-5 text-purple-400" />
                </motion.div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 transition-all"
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden z-50"
                    >
                      <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100">
                        <h3 className="font-bold text-purple-800">🎉 Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-purple-50 transition-colors cursor-pointer border-b border-purple-50 ${
                              notif.unread ? 'bg-purple-50/50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-800">{notif.text}</p>
                            <p className="text-xs text-purple-400 mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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

      {/* Colorful Sidebar */}
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
              {/* Expand/Collapse Button */}
              <div className="p-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  className="p-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200"
                >
                  {sidebarExpanded ? (
                    <RiArrowLeftSLine className="h-5 w-5 text-purple-600" />
                  ) : (
                    <RiArrowRightSLine className="h-5 w-5 text-purple-600" />
                  )}
                </motion.button>
              </div>

              {/* Sidebar Navigation */}
              <nav className="px-4 pb-4 space-y-6">
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

              {/* Fun Stats at Bottom */}
              {sidebarExpanded && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-purple-100 to-transparent">
                  <div className="bg-white/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-600">🔥 Streak</span>
                      <span className="text-xs font-bold text-purple-800">12 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pink-600">⭐ Points</span>
                      <span className="text-xs font-bold text-pink-800">2,450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">🏆 Level</span>
                      <span className="text-xs font-bold text-blue-800">Pro</span>
                    </div>
                  </div>
                </div>
              )}
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
          {/* Colorful Page Header */}
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-6 shadow-lg"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                <span>🌟</span>
                Welcome to Your Colorful CRM!
                <span>🎨</span>
              </h1>
              <p className="text-purple-600 mt-2">Making recruitment fun and delightful, one placement at a time! 🚀</p>
            </motion.div>
          </div>

          {/* Page Content */}
          <div className="relative z-10">
            {children}
          </div>
        </motion.div>
      </main>

      {/* CHAT BOX COMPONENT - ADD HERE AT THE END */}
      <ChatBox />
    </div>
  )
}