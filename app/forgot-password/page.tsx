'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RiMailLine, RiArrowLeftLine, RiCheckLine, RiMailSendLine } from 'react-icons/ri'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
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
                <span className="text-3xl">🔐</span>
              </div>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Forgot Password? 🤔
          </h1>
          <p className="text-purple-600 mt-2">No worries! We'll help you reset it</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-100"
        >
          {!sent ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm text-purple-600">
                  Enter your email address and we'll send you a magic link to reset your password ✨
                </p>
              </div>

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
                    Sending...
                  </>
                ) : (
                  <>
                    <RiMailSendLine className="h-5 w-5" />
                    Send Reset Link 📮
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
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-green-400 to-teal-500 rounded-full"
              >
                <RiCheckLine className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Check Your Email! 📬</h3>
              <p className="text-purple-600 mb-6">
                We've sent a password reset link to:
                <br />
                <span className="font-medium">{email}</span>
              </p>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-700">
                  💡 Tip: Check your spam folder if you don't see it in a few minutes
                </p>
              </div>
            </motion.div>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              <RiArrowLeftLine className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}