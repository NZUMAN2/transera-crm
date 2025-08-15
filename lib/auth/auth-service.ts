import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'recruiter', 'viewer']),
  permissions: z.array(z.string()),
  createdAt: z.date(),
  lastLogin: z.date().optional()
})

// Secure session management
export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'
  private static readonly TOKEN_EXPIRY = '24h'
  
  // Hash password with bcrypt
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }
  
  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
  
  // Generate JWT token
  static generateToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      { userId, email, role, iat: Date.now() },
      this.JWT_SECRET,
      { expiresIn: this.TOKEN_EXPIRY }
    )
  }
  
  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET)
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }
  
  // Role-based access control
  static checkPermission(user: any, requiredRole: string): boolean {
    const roleHierarchy = {
      viewer: 1,
      recruiter: 2,
      admin: 3
    }
    
    return roleHierarchy[user.role as keyof typeof roleHierarchy] >= 
           roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  }
}