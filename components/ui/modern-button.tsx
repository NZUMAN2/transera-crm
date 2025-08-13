'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ModernButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ModernButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '' 
}: ModernButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-medium rounded-lg
        transition-all duration-200
        shadow-lg hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}