<template>
  <div>
    <h2 class="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
      {{ $t('auth.forgot_pass.title') }}
    </h2>
    <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
      {{ $t('auth.forgot_pass.desc') }}
    </p>

    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <UFormField :label="$t('auth.login.email_label')" name="email">
        <UInput
          v-model="state.email"
          type="email"
          icon="i-heroicons-envelope"
          :placeholder="$t('auth.login.email_placeholder')"
          size="lg"
        />
      </UFormField>

      <UButton type="submit" color="primary" block size="lg" :loading="loading" class="mt-8 font-semibold shadow-md">
        {{ $t('auth.forgot_pass.submit_btn') }}
      </UButton>

      <div class="mt-6 text-center">
        <NuxtLink to="/auth/login" class="flex items-center justify-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-500">
          <UIcon name="i-heroicons-arrow-left" class="h-4 w-4" />
          {{ $t('auth.forgot_pass.back_to_login') }}
        </NuxtLink>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { ApiRoutes } from '~/constants/api.routes'
import type { AuthMessageResponse } from '~/types/auth'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const toast = useToast()
const { t } = useI18n()
const loading = ref(false)

const schema = z.object({
  email: z.string().email(t('auth.validation.invalid_email')),
})

const state = reactive({
  email: '',
})

async function onSubmit() {
  loading.value = true

  try {
    await $api<AuthMessageResponse>(ApiRoutes.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: state,
    })

    toast.add({
      title: t('auth.forgot_pass.success'),
      description: t('auth.forgot_pass.success_desc'),
      color: 'success',
    })
  } catch {
    toast.add({
      title: t('auth.forgot_pass.error'),
      description: t('auth.forgot_pass.error_desc'),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
