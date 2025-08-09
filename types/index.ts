export interface User {
  id: string
  email: string
  role: 'admin' | 'consultant' | 'manager'
  firstName: string
  lastName: string
  organizationId: string
}

export interface Organization {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Job {
  id: string
  title: string
  clientId: string
  status: 'open' | 'closed'
  phase: 1 | 2 | 3
  createdAt: Date
  updatedAt: Date
}

export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}