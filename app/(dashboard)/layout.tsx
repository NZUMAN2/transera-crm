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
  RiLogoutBoxLine
} from 'react-icons/ri'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: RiDashboardLine },
  { name: 'Jobs', href: '/jobs', icon: RiBriefcaseLine },
  { name: 'Candidates', href: '/candidates', icon: RiUserLine },
  { name: 'Clients', href: '/clients', icon: RiBuilding2Line },
  { name: 'Workflow', href: '/workflow', icon: RiFlowChart },
  { name: 'Performance', href: '/performance', icon: RiBarChartBoxLine },
  { name: 'Reports', href: '/reports', icon: RiFileListLine },
  { name: 'Calculator', href: '/calculator', icon: RiCalculatorLine },
]

export default function ModernLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New candidate application', time: '5 min ago', unread: true },
    { id: 2, text: 'Interview scheduled', time: '1 hour ago', unread: true },
    { id: 3, text: 'Client approved job posting', time: '3 hours ago', unread: false },
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
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-purple-50'}`}>
      {/* Enhanced Top Navigation Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-2xl border-b border-gray-200/20' 
            : 'bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with Animation */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-10 w-10"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">T</span>
                  </div>
                </motion.div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    TransEra
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block -mt-1">CRM</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative px-3 py-2 rounded-xl group transition-all duration-200"
                  >
                    <motion.div
                      className={`flex items-center space-x-2 ${
                        isActive 
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </motion.div>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.25 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions - Enhanced */}
            <div className="flex items-center space-x-3">
              {/* Search Bar - Enhanced */}
              <div className="hidden lg:flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-56 xl:w-64 pl-10 pr-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md 
                             focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 
                             focus:shadow-lg transition-all duration-200 text-sm"
                  />
                  <RiSearchLine className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </motion.div>
              </div>

              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? (
                  <RiSunLine className="h-5 w-5 text-yellow-500" />
                ) : (
                  <RiMoonLine className="h-5 w-5 text-gray-600" />
                )}
              </motion.button>

              {/* Notifications - Enhanced */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <RiNotification3Line className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
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
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                              notif.unread ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`h-2 w-2 rounded-full mt-2 ${
                                notif.unread ? 'bg-purple-500' : 'bg-gray-300'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">{notif.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <RiSettings3Line className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>

              {/* User Profile - Enhanced */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 hover:shadow-lg transition-all"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden xl:block">
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
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <RiLogoutBoxLine className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm text-gray-700 dark:text-gray-200">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <RiCloseLine className="h-6 w-6" />
                ) : (
                  <RiMenu3Line className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content - Full Width */}
      <main className="pt-16 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 sm:px-6 lg:px-8 py-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}