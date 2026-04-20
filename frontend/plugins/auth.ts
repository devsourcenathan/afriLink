import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { ApiRoutes } from '~/constants/api.routes'
import { useAuthStore } from '~/stores/auth.store'
import type { AuthTokensResponse, AuthUser } from '~/types/auth'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  if (!authStore.accessToken || authStore.user) {
    return
  }

  try {
    const user = await $fetch<AuthUser>(ApiRoutes.USERS.ME, {
      baseURL: config.public.apiBase as string,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    authStore.updateUser(user)
  } catch (error: unknown) {
    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode
        : undefined

    if (statusCode === 401 && authStore.refreshToken) {
      try {
        const refreshedAuth = await $fetch<AuthTokensResponse>(ApiRoutes.AUTH.REFRESH, {
          baseURL: config.public.apiBase as string,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.refreshToken}`,
          },
        })

        authStore.setAuth(refreshedAuth)
      } catch {
        authStore.clearAuth()
      }

      return
    }

    authStore.clearAuth()
  }
})
