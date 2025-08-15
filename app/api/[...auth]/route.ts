import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { SecureStorage } from '@/lib/security/secure-storage'

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE-THIS-IN-PRODUCTION'
const JWT_EXPIRES_IN = '24h'

// Validation schema
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// Mock user database (replace with real database)
const users = [
  {
    id: '1',
    email: 'admin@transera.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY3pz8GZQP8QD8W', // Password: Admin123!
    role: 'admin',
    name: 'Admin User'
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validated = LoginSchema.parse(body)
    
    // Find user
    const user = users.find(u => u.email === validated.email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(validated.password, user.password)
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )
    
    // Create secure session
    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    }
    
    // Set secure HTTP-only cookie
    const response = NextResponse.json(
      { success: true, user: session.user },
      { status: 200 }
    )
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Logout - clear session
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  )
  
  response.cookies.delete('auth-token')
  
  return response
}

export async function GET(request: NextRequest) {
  // Verify session
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return NextResponse.json(
      { authenticated: true, user: decoded },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }
}