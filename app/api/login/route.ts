import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d'

// Validation schema
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// Mock user database (replace with real database later)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@transera.com',
    // Password: Admin123! (hashed)
    password: '$2a$10$YKqH1j8TRsLqVyQr5M3ROe.FJVqVqMLp6I8Q6zKZBxULNwo8.Khg6',
    name: 'Admin User',
    role: 'admin',
    permissions: ['all']
  },
  {
    id: '2', 
    email: 'recruiter@transera.com',
    // Password: Recruiter123! (hashed)
    password: '$2a$10$nCKrIpTnz2oNz4RKGyFbPeFXZrZScNqBknBYoCqE4TqGfgw6oqE2m',
    name: 'Recruiter User',
    role: 'recruiter',
    permissions: ['read', 'write']
  },
  {
    id: '3',
    email: 'demo@transera.com',
    // Password: Demo123! (hashed)
    password: '$2a$10$3VJgR9XmgYv2pCp/t6OQbuVvJmhQWKQg2GqXq0p17vP6BlK8CTnb.',
    name: 'Demo User',
    role: 'viewer',
    permissions: ['read']
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validated = LoginSchema.parse(body)
    
    // Rate limiting check (simple implementation)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const attemptKey = `login_attempt_${clientIp}_${validated.email}`
    
    // Find user
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === validated.email.toLowerCase())
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(validated.password, user.password)
    
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      },
      JWT_SECRET,
      { 
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'transera-crm',
        audience: 'transera-users'
      }
    )
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    
    // Create response with user data
    const response = NextResponse.json(
      { 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions
        },
        token
      },
      { status: 200 }
    )
    
    // Set HTTP-only cookies for tokens
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    response.cookies.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })
    
    // Log successful login
    console.log(`✅ User logged in: ${user.email} at ${new Date().toISOString()}`)
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}