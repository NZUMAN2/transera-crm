import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )
  
  // Check authentication for protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                           request.nextUrl.pathname.startsWith('/candidates') ||
                           request.nextUrl.pathname.startsWith('/jobs') ||
                           request.nextUrl.pathname.startsWith('/clients')
  
  if (isProtectedRoute) {
    // For now, just check if we're not on login page
    // In production, implement proper JWT validation
    const isLoginPage = request.nextUrl.pathname === '/login'
    if (!isLoginPage) {
      // Allow access for now
      return response
    }
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}