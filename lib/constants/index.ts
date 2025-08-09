export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'TransEra Solutions CRM'
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || 'R'
export const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'ZA'

export const WORKFLOW_PHASES = {
  PHASE_1: 'Client & Sourcing',
  PHASE_2: 'Screening & Submission',
  PHASE_3: 'Placement & Invoicing'
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  CONSULTANT: 'consultant',
  MANAGER: 'manager'
} as const