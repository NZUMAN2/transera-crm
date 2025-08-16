import { prisma } from '@/lib/db/prisma'
import { CandidateStatus } from '@prisma/client'

export class CandidateService {
  static async create(data: any, userId: string) {
    return prisma.candidate.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        role: data.role,
        experience: data.experience || 0,
        skills: data.skills || [],
        location: data.location,
        status: data.status || CandidateStatus.ACTIVE,
        createdBy: userId
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })
  }

  static async findAll(userId: string, filters?: any) {
    return prisma.candidate.findMany({
      where: {
        createdBy: userId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && {
          OR: [
            { firstName: { contains: filters.search, mode: 'insensitive' } },
            { lastName: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
            { role: { contains: filters.search, mode: 'insensitive' } }
          ]
        })
      },
      include: {
        applications: {
          include: {
            job: true
          }
        },
        interviews: {
          where: { status: 'SCHEDULED' },
          orderBy: { date: 'asc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async findById(id: string) {
    return prisma.candidate.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            job: {
              include: { client: true }
            },
            interviews: true
          }
        },
        interviews: {
          orderBy: { date: 'desc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        documents: true,
        user: {
          select: { name: true, email: true }
        }
      }
    })
  }

  static async update(id: string, data: any) {
    return prisma.candidate.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  }

  static async delete(id: string) {
    return prisma.candidate.delete({
      where: { id }
    })
  }

  static async getStats(userId: string) {
    const [total, active, interviewing, placed] = await Promise.all([
      prisma.candidate.count({ where: { createdBy: userId } }),
      prisma.candidate.count({ where: { createdBy: userId, status: CandidateStatus.ACTIVE } }),
      prisma.candidate.count({ where: { createdBy: userId, status: CandidateStatus.INTERVIEWING } }),
      prisma.candidate.count({ where: { createdBy: userId, status: CandidateStatus.PLACED } })
    ])

    return { total, active, interviewing, placed }
  }
}