import type { ServiceCategory, ServiceStatus } from './services-enums'

export interface ServiceProviderUser {
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export interface ServiceProvider {
  id: string
  bio: string | null
  location: string | null
  user: ServiceProviderUser
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  price: number
  deliveryTimeInDays: number | null
  category: ServiceCategory
  status: ServiceStatus
  tags: string[]
  createdAt: string
  updatedAt: string
  provider: ServiceProvider
}

export interface ServicesListResponse {
  data: ServiceItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateServicePayload {
  title: string
  description: string
  price: number
  deliveryTimeInDays?: number
  category: ServiceCategory
  status?: ServiceStatus
  tags?: string[]
}

export interface SearchServicesPayload {
  q?: string
  category?: ServiceCategory
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}
