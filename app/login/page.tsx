'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RiMailLine, RiLockLine, RiLoginBoxLine, RiSparklingLine } from 'react-icons/ri'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-blue-50/20 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full opacity-10 blur-3xl animate-pulse" />
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
            className="inline-flex items-center justify-center w-20 h-20 mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 blur-xl opacity-75" />
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

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-100"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
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
            </div>

            {/* Password Input */}
            <div>
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-purple-300 text-purple-600 focus:ring-purple-400" />
                <span className="ml-2 text-sm text-purple-600">Remember me 💜</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-pink-600 hover:text-pink-700">
                Forgot password? 🤔
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 border border-red-200"
              >
                <p className="text-sm text-red-600">⚠️ {error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 
                       text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <RiLoginBoxLine className="h-5 w-5" />
                  Sign In 🚀
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
            <span className="px-4 text-sm text-purple-400">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-600">
              Don't have an account? 
              <Link href="/register" className="ml-1 font-medium text-pink-600 hover:text-pink-700">
                Sign up here! 🎨
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Fun Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-purple-400">
            🌟 Making recruitment magical since 2024 🌟
          </p>
          <div className="mt-2 flex justify-center gap-2">
            <span className="text-2xl animate-bounce delay-0">💼</span>
            <span className="text-2xl animate-bounce delay-100">👥</span>
            <span className="text-2xl animate-bounce delay-200">🏢</span>
            <span className="text-2xl animate-bounce delay-300">📊</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}