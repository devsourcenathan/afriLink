import type { AvailabilityStatus } from './auth'

export interface ProviderUserSummary {
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export interface ProviderSummary {
  id: string
  userId: string
  bio: string | null
  hourlyRate: number
  skills: string[]
  availability: AvailabilityStatus
  location: string | null
  createdAt: string
  updatedAt: string
  user: ProviderUserSummary
}

export interface ProvidersListResponse {
  data: ProviderSummary[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
