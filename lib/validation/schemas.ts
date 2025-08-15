import { z } from 'zod'

// Email validation with sanitization
export const EmailSchema = z.string()
  .email('Invalid email format')
  .transform(val => val.toLowerCase().trim())

// Phone validation
export const PhoneSchema = z.string()
  .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number')

// Name validation - prevent script injection
export const NameSchema = z.string()
  .min(2, 'Name too short')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')

// Candidate form validation
export const CandidateFormSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  role: z.string().min(2).max(100),
  experience: z.number().min(0).max(50),
  skills: z.array(z.string()).max(20).optional(),
  status: z.enum(['active', 'interviewing', 'placed', 'rejected']).optional()
})

// Job form validation
export const JobFormSchema = z.object({
  title: z.string().min(2).max(200),
  company: z.string().min(2).max(100),
  description: z.string().min(10).max(5000).optional(),
  location: z.string().min(2).max(100),
  salary: z.string().regex(/^\d+(-\d+)?$/, 'Invalid salary format').optional(),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Remote'])
})

// Validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

// Safe JSON parse
export function safeJsonParse(text: string, fallback: any = null) {
  try {
    return JSON.parse(text)
  } catch {
    return fallback
  }
}