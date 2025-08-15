import crypto from 'crypto'

export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>()
  
  // Generate CSRF token
  static generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 3600000 // 1 hour
    
    this.tokens.set(sessionId, { token, expires })
    
    // Clean expired tokens
    this.cleanExpiredTokens()
    
    return token
  }
  
  // Verify CSRF token
  static verifyToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId)
    
    if (!stored) return false
    if (Date.now() > stored.expires) {
      this.tokens.delete(sessionId)
      return false
    }
    
    return crypto.timingSafeEqual(
      Buffer.from(stored.token),
      Buffer.from(token)
    )
  }
  
  // Clean expired tokens
  private static cleanExpiredTokens(): void {
    const now = Date.now()
    for (const [key, value] of this.tokens.entries()) {
      if (now > value.expires) {
        this.tokens.delete(key)
      }
    }
  }
}