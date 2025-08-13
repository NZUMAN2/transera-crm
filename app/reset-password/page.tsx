'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { RiLockLine, RiCheckLine, RiKeyLine } from 'react-icons/ri'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Passwords don't match! 😅")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long 📏")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-blue-50/20 flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
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
                <span className="text-3xl">🔑</span>
              </div>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Reset Your Password 🎯
          </h1>
          <p className="text-purple-600 mt-2">Create a new secure password</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-100"
        >
          {!success ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  🔐 New Password
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
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  🔐 Confirm Password
                </label>
                <div className="relative">
                  <RiKeyLine className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 
                             focus:from-white focus:to-white focus:outline-none focus:ring-2 focus:ring-purple-400 
                             transition-all duration-200 text-gray-700"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              {/* Password Strength Indicators */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`h-1 flex-1 rounded-full ${password.length >= 6 ? 'bg-green-400' : 'bg-gray-200'}`} />
                  <span className="text-xs text-purple-600">6+ characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-1 flex-1 rounded-full ${password === confirmPassword && password.length > 0 ? 'bg-green-400' : 'bg-gray-200'}`} />
                  <span className="text-xs text-purple-600">Passwords match</span>
                </div>
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
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password 🚀
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-green-400 to-teal-500 rounded-full"
              >
                <RiCheckLine className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Password Reset Successful! 🎉</h3>
              <p className="text-purple-600">
                Your password has been reset successfully.
                <br />
                Redirecting to login page...
              </p>
              <div className="mt-4">
                <div className="inline-flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}