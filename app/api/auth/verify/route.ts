import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
          permissions: decoded.permissions
        }
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}