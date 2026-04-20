import type { RequestStatus, RequestUrgency } from './requests-enums'
import type { ServiceCategory } from './services-enums'

export interface RequestCompanyUser {
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export interface RequestCompany {
  id: string
  user: RequestCompanyUser
  companyProfile: {
    companyName: string | null
  } | null
}

export interface ServiceRequestItem {
  id: string
  title: string
  description: string
  category: ServiceCategory
  budgetMin: number | null
  budgetMax: number | null
  location: string | null
  urgency: RequestUrgency
  deadlineAt: string | null
  status: RequestStatus
  tags: string[]
  createdAt: string
  updatedAt: string
  company: RequestCompany
}

export interface RequestsListResponse {
  data: ServiceRequestItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateRequestPayload {
  title: string
  description: string
  category: ServiceCategory
  budgetMin?: number
  budgetMax?: number
  location?: string
  urgency?: RequestUrgency
  deadlineAt?: string
  status?: RequestStatus
  tags?: string[]
}
