'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/contexts/auth-context'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate input
      LoginSchema.parse({ email, password })
      
      // Attempt login
      await login(email, password)
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError(err.message || 'Login failed. Please try again.')
      }
      setLoading(false)
    }
  }

  const demoAccounts = [
    { email: 'admin@transera.com', password: 'Admin123!', role: 'Admin' },
    { email: 'recruiter@transera.com', password: 'Recruiter123!', role: 'Recruiter' },
    { email: 'demo@transera.com', password: 'Demo123!', role: 'Viewer' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl">✨</span>
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TransEra CRM
            </h1>
            <p className="text-gray-600 mt-2">Secure Login</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⚙️</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Demo Accounts:</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email)
                    setPassword(account.password)
                  }}
                  className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{account.role}</span>
                    <span className="text-xs text-gray-500">{account.email}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click to auto-fill credentials
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full text-sm text-gray-600">
            <span>🔒</span>
            <span>Secured with JWT & Encryption</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}