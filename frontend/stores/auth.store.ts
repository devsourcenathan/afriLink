import { useCookie } from '#app'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthTokensResponse, AuthUser } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const cookieOptions = {
    default: () => null,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  }

  const user = ref<AuthUser | null>(null)
  const accessToken = useCookie<string | null>('access_token', cookieOptions)
  const refreshToken = useCookie<string | null>('refresh_token', cookieOptions)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const currentUser = computed(() => user.value)

  function setAuth(data: AuthTokensResponse) {
    user.value = data.user
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
  }

  function updateUser(data: AuthUser) {
    user.value = data
  }

  function clearAuth() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    currentUser,
    setAuth,
    updateUser,
    clearAuth,
  }
})
