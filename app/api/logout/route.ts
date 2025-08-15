import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  )
  
  // Clear auth cookies
  response.cookies.delete('auth-token')
  response.cookies.delete('refresh-token')
  
  return response
}