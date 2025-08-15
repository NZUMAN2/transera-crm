import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh-token')?.value
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any
    
    if (decoded.type !== 'refresh') {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }
    
    // Generate new access token
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        // In production, fetch fresh user data from database
        email: 'user@transera.com',
        name: 'User',
        role: 'user',
        permissions: ['read']
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    const response = NextResponse.json(
      { success: true, token: newToken },
      { status: 200 }
    )
    
    // Update auth token cookie
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid refresh token' },
      { status: 401 }
    )
  }
}