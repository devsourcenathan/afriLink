<template>
  <div>
    <h2 class="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
      {{ $t('auth.register.title') }}
    </h2>
    <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
      {{ $t('auth.register.subtitle') }}
    </p>

    <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
      <div class="grid grid-cols-2 gap-4">
        <UFormField :label="$t('auth.register.firstname_label')" name="firstName">
          <UInput
            v-model="state.firstName"
            icon="i-heroicons-user"
            :placeholder="$t('auth.register.firstname_placeholder')"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('auth.register.lastname_label')" name="lastName">
          <UInput
            v-model="state.lastName"
            :placeholder="$t('auth.register.lastname_placeholder')"
            size="lg"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField :label="$t('auth.login.email_label')" name="email">
        <UInput
          v-model="state.email"
          type="email"
          icon="i-heroicons-envelope"
          :placeholder="$t('auth.login.email_placeholder')"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="$t('auth.login.password_label')" name="password">
        <UInput
          v-model="state.password"
          type="password"
          icon="i-heroicons-lock-closed"
          placeholder="********"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="$t('auth.register.role_label')" name="role">
        <USelect
          v-model="state.role"
          :items="roleItems"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" color="primary" block size="lg" :loading="loading" class="mt-6 font-semibold shadow-md">
        {{ $t('auth.register.submit_btn') }}
      </UButton>

      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {{ $t('auth.register.already_account') }}
        <NuxtLink to="/auth/login" class="font-semibold text-primary-600 hover:text-primary-500">
          {{ $t('auth.register.login_link') }}
        </NuxtLink>
      </p>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { ApiRoutes } from '~/constants/api.routes'
import { useAuthStore } from '~/stores/auth.store'
import type { AuthTokensResponse, RegisterPayload } from '~/types/auth'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const toast = useToast()
const { t } = useI18n()
const loading = ref(false)

const roleItems = computed(() => [
  { label: t('auth.register.role_entreprise'), value: 'ENTREPRISE' },
  { label: t('auth.register.role_prestataire'), value: 'PRESTATAIRE' },
])

const schema = z.object({
  firstName: z.string().min(1, t('auth.validation.req_firstname')),
  lastName: z.string().min(1, t('auth.validation.req_lastname')),
  email: z.string().email(t('auth.validation.invalid_email')),
  password: z.string().min(8, t('auth.validation.min_password')),
  role: z.enum(['ENTREPRISE', 'PRESTATAIRE']),
})

const state = reactive<RegisterPayload>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'PRESTATAIRE',
})

async function onSubmit() {
  loading.value = true

  try {
    const response = await $api<AuthTokensResponse>(ApiRoutes.AUTH.REGISTER, {
      method: 'POST',
      body: state,
    })

    authStore.setAuth(response)
    toast.add({
      title: t('auth.register.success'),
      description: t('auth.register.success_desc'),
      color: 'success',
    })
    await navigateTo('/dashboard')
  } catch (error: unknown) {
    const message =
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { _data?: { message?: string } } }).response?._data?.message === 'string'
        ? (error as { response?: { _data?: { message?: string } } }).response?._data?.message
        : t('auth.register.error_default')

    toast.add({
      title: 'Erreur',
      description: message,
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
