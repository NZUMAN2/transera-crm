import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/api/auth/login', '/api/auth/refresh', '/', '/api/test-env']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip auth check for public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return addSecurityHeaders(NextResponse.next())
  }
  
  // Check for auth token
  const token = request.cookies.get('auth-token')?.value
  
  // Redirect to login if no token on protected routes
  if (!token && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Verify token for API routes
  if (token && pathname.startsWith('/api')) {
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }
  
  // Verify token for protected pages
  if (token && !pathname.startsWith('/api')) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // Check role-based access
      if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      response.cookies.delete('refresh-token')
      return response
    }
  }
  
  return addSecurityHeaders(NextResponse.next())
}

function addSecurityHeaders(response: NextResponse) {
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  )
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}