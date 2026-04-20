import { defineNuxtPlugin, navigateTo, useRuntimeConfig } from '#app'
import { ApiRoutes } from '~/constants/api.routes'
import { useAuthStore } from '~/stores/auth.store'
import type { AuthTokensResponse } from '~/types/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers = options.headers || {}
        ;(options.headers as Record<string, string>).Authorization = `Bearer ${authStore.accessToken}`
      }
    },
    async onResponseError({ request, response, options }) {
      if (response.status !== 401) {
        return
      }

      const requestUrl = String(request)
      const isAuthBoundaryRequest = [
        ApiRoutes.AUTH.REFRESH,
        ApiRoutes.AUTH.LOGIN,
        ApiRoutes.AUTH.LOGOUT,
      ].some((route) => requestUrl.includes(route))

      if (isAuthBoundaryRequest || !authStore.refreshToken) {
        authStore.clearAuth()
        await nuxtApp.runWithContext(() => navigateTo('/auth/login'))
        return
      }

      try {
        const refreshedAuth = await $fetch<AuthTokensResponse>(ApiRoutes.AUTH.REFRESH, {
          baseURL: config.public.apiBase as string,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.refreshToken}`,
          },
        })

        authStore.setAuth(refreshedAuth)
        options.headers = options.headers || {}
        ;(options.headers as Record<string, string>).Authorization = `Bearer ${refreshedAuth.accessToken}`

        return $fetch(request, options)
      } catch {
        authStore.clearAuth()
        await nuxtApp.runWithContext(() => navigateTo('/auth/login'))
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
