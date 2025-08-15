import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// Sanitize function to prevent XSS
export const sanitize = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}

// Email validation with sanitization
export const EmailSchema = z.string()
  .email('Invalid email format')
  .transform(val => sanitize(val.toLowerCase().trim()))

// Phone validation
export const PhoneSchema = z.string()
  .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number')
  .transform(val => sanitize(val))

// Name validation - prevent script injection
export const NameSchema = z.string()
  .min(2, 'Name too short')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
  .transform(val => sanitize(val))

// Candidate form validation
export const CandidateFormSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  role: z.string().min(2).max(100).transform(sanitize),
  experience: z.number().min(0).max(50),
  skills: z.array(z.string().transform(sanitize)).max(20),
  status: z.enum(['active', 'interviewing', 'placed', 'rejected'])
})

// Job form validation
export const JobFormSchema = z.object({
  title: z.string().min(2).max(200).transform(sanitize),
  company: z.string().min(2).max(100).transform(sanitize),
  description: z.string().min(10).max(5000).transform(sanitize),
  location: z.string().min(2).max(100).transform(sanitize),
  salary: z.string().regex(/^\d+(-\d+)?$/, 'Invalid salary format'),
  type: z.enum(['full-time', 'part-time', 'contract', 'remote'])
})

// File upload validation
export const FileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(5 * 1024 * 1024, 'File too large (max 5MB)'),
  type: z.enum([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ], {
    errorMap: () => ({ message: 'Only PDF and Word documents allowed' })
  })
})