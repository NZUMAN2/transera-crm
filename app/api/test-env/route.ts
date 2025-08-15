import { NextResponse } from 'next/server'

export async function GET() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Not available in production' })
  }
  
  return NextResponse.json({
    hasJWT: !!process.env.JWT_SECRET,
    hasEncryption: !!process.env.NEXT_PUBLIC_ENCRYPTION_KEY,
    hasNextAuth: !!process.env.NEXTAUTH_SECRET,
    environment: process.env.NODE_ENV,
    appUrl: process.env.NEXT_PUBLIC_APP_URL
  })
}