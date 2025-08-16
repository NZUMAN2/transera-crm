import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@transera.com' },
    update: {},
    create: {
      email: 'admin@transera.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      permissions: ['all']
    }
  })
  
  console.log('✅ Admin user created:', admin.email)
  
  // Create recruiter user
  const recruiterPassword = await bcrypt.hash('Recruiter123!', 12)
  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@transera.com' },
    update: {},
    create: {
      email: 'recruiter@transera.com',
      password: recruiterPassword,
      name: 'John Recruiter',
      role: Role.RECRUITER,
      permissions: ['read', 'write']
    }
  })
  
  console.log('✅ Recruiter user created:', recruiter.email)
  
  // Create some sample candidates
  const candidates = await Promise.all([
    prisma.candidate.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@example.com',
        phone: '+1234567890',
        role: 'Senior Software Engineer',
        experience: 8,
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
        location: 'San Francisco, CA',
        status: 'ACTIVE',
        createdBy: recruiter.id
      }
    }),
    prisma.candidate.create({
      data: {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@example.com',
        phone: '+1234567891',
        role: 'Product Manager',
        experience: 6,
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research'],
        location: 'New York, NY',
        status: 'INTERVIEWING',
        createdBy: recruiter.id
      }
    })
  ])
  
  console.log(`✅ Created ${candidates.length} sample candidates`)
  
  // Create sample client
  const client = await prisma.client.create({
    data: {
      name: 'TechCorp Solutions',
      industry: 'Technology',
      website: 'https://techcorp.example.com',
      contactName: 'Emma Wilson',
      contactEmail: 'emma@techcorp.com',
      contactPhone: '+1234567892',
      size: 'LARGE',
      status: 'ACTIVE',
      createdBy: recruiter.id
    }
  })
  
  console.log('✅ Created sample client:', client.name)
  
  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Solutions',
        clientId: client.id,
        description: 'We are looking for an experienced Full Stack Developer to join our team...',
        requirements: ['5+ years experience', 'React/Node.js expertise', 'AWS knowledge'],
        benefits: ['Health insurance', '401k', 'Remote work', 'Stock options'],
        salaryMin: 120000,
        salaryMax: 180000,
        currency: 'USD',
        location: 'San Francisco, CA',
        remote: 'HYBRID',
        type: 'FULL_TIME',
        status: 'OPEN',
        urgency: 'HIGH',
        openings: 2,
        createdBy: recruiter.id
      }
    }),
    prisma.job.create({
      data: {
        title: 'Product Manager',
        company: 'TechCorp Solutions',
        clientId: client.id,
        description: 'Seeking a strategic Product Manager to lead our product initiatives...',
        requirements: ['3+ years PM experience', 'Technical background', 'Strong communication'],
        benefits: ['Health insurance', 'Unlimited PTO', 'Learning budget'],
        salaryMin: 100000,
        salaryMax: 150000,
        currency: 'USD',
        location: 'New York, NY',
        remote: 'REMOTE',
        type: 'FULL_TIME',
        status: 'OPEN',
        urgency: 'NORMAL',
        openings: 1,
        createdBy: recruiter.id
      }
    })
  ])
  
  console.log(`✅ Created ${jobs.length} sample jobs`)
  
  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })