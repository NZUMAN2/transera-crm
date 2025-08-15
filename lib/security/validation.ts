import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// Input sanitization
export class SecurityValidator {
  // Sanitize HTML to prevent XSS
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href']
    })
  }
  
  // Sanitize for SQL injection prevention
  static sanitizeSQL(input: string): string {
    return input
      .replace(/['";\\]/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
      .trim()
  }
  
  // Validate and sanitize email
  static sanitizeEmail(email: string): string {
    const emailSchema = z.string().email().toLowerCase()
    return emailSchema.parse(email.trim())
  }
  
  // Validate file uploads
  static validateFile(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type')
    }
    
    if (file.size > maxSize) {
      throw new Error('File too large')
    }
    
    return true
  }
  
  // Rate limiting check
  static checkRateLimit(userId: string, action: string): boolean {
    const key = `rate_limit_${userId}_${action}`
    const limit = 100 // requests per hour
    const window = 3600000 // 1 hour in ms
    
    const now = Date.now()
    const attempts = JSON.parse(localStorage.getItem(key) || '[]')
    const recentAttempts = attempts.filter((time: number) => now - time < window)
    
    if (recentAttempts.length >= limit) {
      throw new Error('Rate limit exceeded')
    }
    
    recentAttempts.push(now)
    localStorage.setItem(key, JSON.stringify(recentAttempts))
    return true
  }
}

// Form validation schemas
export const CandidateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  role: z.string().min(2).max(100),
  experience: z.number().min(0).max(50),
  skills: z.array(z.string()).max(20),
  resume: z.string().optional(),
  status: z.enum(['active', 'interviewing', 'placed', 'rejected'])
})

export const JobSchema = z.object({
  title: z.string().min(2).max(200),
  company: z.string().min(2).max(100),
  description: z.string().min(10).max(5000),
  requirements: z.array(z.string()),
  salary: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.enum(['USD', 'EUR', 'GBP', 'ZAR'])
  }),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'remote']),
  status: z.enum(['open', 'closed', 'on-hold'])
})