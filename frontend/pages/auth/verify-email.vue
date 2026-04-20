<template>
  <div class="text-center">
    <div
      class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
      :class="status === 'success'
        ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
        : status === 'error'
          ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
          : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'"
    >
      <UIcon v-if="status === 'loading'" name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin" />
      <UIcon v-else-if="status === 'success'" name="i-heroicons-check" class="h-8 w-8" />
      <UIcon v-else name="i-heroicons-x-mark" class="h-8 w-8" />
    </div>

    <h2 class="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
      {{ status === 'loading' ? $t('auth.verify.title') : status === 'success' ? $t('auth.verify.success') : $t('auth.verify.error_title') }}
    </h2>
    <p class="mb-8 text-base text-gray-500 dark:text-gray-400">
      {{ status === 'loading' ? $t('auth.verify.loading') : status === 'success' ? $t('auth.verify.success_desc') : errorMessage }}
    </p>

    <div v-if="status !== 'loading'" class="mt-8">
      <UButton to="/auth/login" color="primary" block size="lg" class="font-semibold shadow-md">
        {{ $t('auth.verify.btn_back') || 'Retourner a la connexion' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ApiRoutes } from '~/constants/api.routes'
import type { AuthMessageResponse } from '~/types/auth'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const route = useRoute()
const { t } = useI18n()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')

onMounted(async () => {
  const token = String(route.query.token ?? '')

  if (!token) {
    status.value = 'error'
    errorMessage.value = t('auth.verify.missing_token')
    return
  }

  try {
    await $api<AuthMessageResponse>(ApiRoutes.AUTH.VERIFY_EMAIL, {
      method: 'POST',
      body: { token },
    })

    status.value = 'success'
    setTimeout(() => {
      void navigateTo('/auth/login')
    }, 3000)
  } catch (error: unknown) {
    status.value = 'error'
    errorMessage.value =
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { _data?: { message?: string } } }).response?._data?.message === 'string'
        ? (error as { response?: { _data?: { message?: string } } }).response?._data?.message
        : t('auth.verify.invalid_token')
  }
})
</script>
