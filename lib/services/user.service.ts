import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export class UserService {
  static async createUser(data: {
    email: string
    password: string
    name: string
    role?: Role
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        name: data.name,
        role: data.role || Role.RECRUITER,
        permissions: this.getDefaultPermissions(data.role || Role.RECRUITER)
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true
      }
    })
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
  }

  static async verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  }

  static async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() }
    })
  }

  private static getDefaultPermissions(role: Role): string[] {
    switch (role) {
      case Role.ADMIN:
        return ['all']
      case Role.MANAGER:
        return ['read', 'write', 'delete']
      case Role.RECRUITER:
        return ['read', 'write']
      case Role.VIEWER:
        return ['read']
      default:
        return ['read']
    }
  }
}