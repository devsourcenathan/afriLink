export type UserRole = 'ENTREPRISE' | 'PRESTATAIRE' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'
export type AvailabilityStatus = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'UNAVAILABLE'

export interface ProviderProfile {
  id: string
  userId: string
  bio: string | null
  hourlyRate: number
  skills: string[]
  availability: AvailabilityStatus
  location: string | null
  createdAt: string
  updatedAt: string
}

export interface CompanyProfile {
  id: string
  userId: string
  companyName: string
  description: string | null
  website: string | null
  industry: string | null
  size: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  avatarUrl: string | null
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  providerProfile: ProviderProfile | null
  companyProfile: CompanyProfile | null
}

export interface PublicUserProfile {
  id: string
  firstName: string
  lastName: string
  role: UserRole
  avatarUrl: string | null
  providerProfile: ProviderProfile | null
  companyProfile: CompanyProfile | null
}

export interface AuthTokensResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface AuthMessageResponse {
  message: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  role: Extract<UserRole, 'ENTREPRISE' | 'PRESTATAIRE'>
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  phone?: string
}

export interface UpdateProviderProfilePayload {
  bio?: string
  hourlyRate?: number
  skills?: string[]
  availability?: AvailabilityStatus
  location?: string
}

export interface UpdateCompanyProfilePayload {
  companyName?: string
  description?: string
  website?: string
  industry?: string
  size?: string
}
