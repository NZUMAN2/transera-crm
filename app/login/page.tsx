'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMailLine, RiLockLine, RiLoginBoxLine, RiCheckLine, RiCloseLine } from 'react-icons/ri'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user credentials are saved
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      
      // Shake animation on error
      const form = document.getElementById('login-form')
      form?.classList.add('animate-shake')
      setTimeout(() => form?.classList.remove('animate-shake'), 500)
    } else {
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }
      
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-blue-50/20 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full opacity-20 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            whileHover={{ rotate: 360 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-4 cursor-pointer"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 blur-xl opacity-75 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-2xl">
                <span className="text-3xl">✨</span>
              </div>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back! 🎉
          </h1>
          <p className="text-purple-600 mt-2">Sign in to TransEra CRM</p>
        </div>

        {/* Success Animation Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-4 mx-auto"
                >
                  <RiCheckLine className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-purple-800">Login Successful! 🎊</h3>
                <p className="text-purple-600 mt-2">Redirecting to dashboard...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Card */}
        <motion.div
          id="login-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-100"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input with Animation */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-purple-700 mb-2">
                📧 Email Address
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 
                           focus:from-white focus:to-white focus:outline-none focus:ring-2 focus:ring-purple-400 
                           transition-all duration-200 text-gray-700"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Input with Animation */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-purple-700 mb-2">
                🔐 Password
              </label>
              <div className="relative">
                <RiLockLine className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 
                           focus:from-white focus:to-white focus:outline-none focus:ring-2 focus:ring-purple-400 
                           transition-all duration-200 text-gray-700"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password with Animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    rememberMe ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                  }`}>
                    <motion.div
                      animate={{ x: rememberMe ? 16 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </div>
                </div>
                <span className="ml-3 text-sm text-purple-600 group-hover:text-purple-700">
                  Remember me 💜
                </span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm text-pink-600 hover:text-pink-700 hover:underline transition-all"
              >
                Forgot password? 🤔
              </Link>
            </motion.div>

            {/* Error Message with Animation */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button with Loading State */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 
                       text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                       relative overflow-hidden"
            >
              {loading && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="animate-pulse">Signing in...</span>
                </>
              ) : (
                <>
                  <RiLoginBoxLine className="h-5 w-5" />
                  Sign In 🚀
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-purple-600">
              Don't have an account? 
              <Link 
                href="/register" 
                className="ml-1 font-medium text-pink-600 hover:text-pink-700 hover:underline transition-all"
              >
                Sign up here! 🎨
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}