<template>
  <div>
    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
      {{ $t('auth.login.title') }}
    </h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      {{ $t('auth.login.subtitle') }}
    </p>

    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
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
        <template #hint>
          <NuxtLink to="/auth/forgot-password" class="text-sm text-primary-600 hover:text-primary-500 font-medium">
            {{ $t('auth.login.forgot_password') }}
          </NuxtLink>
        </template>
        <UInput 
          v-model="state.password" 
          type="password" 
          icon="i-heroicons-lock-closed" 
          placeholder="••••••••" 
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" color="primary" block size="lg" :loading="loading" class="mt-8 font-semibold shadow-md">
        {{ $t('auth.login.submit_btn') }}
      </UButton>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        {{ $t('auth.login.no_account') }}
        <NuxtLink to="/auth/register" class="font-semibold text-primary-600 hover:text-primary-500">
          {{ $t('auth.login.register_link') }}
        </NuxtLink>
      </p>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({
  layout: 'auth'
})

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const toast = useToast()
const { t } = useI18n()
const loading = ref(false)

const schema = z.object({
  email: z.string().email(t('auth.validation.invalid_email')),
  password: z.string().min(1, t('auth.validation.req_password'))
})

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit() {
  loading.value = true
  try {
    const res = await $api<{ user: any; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: state
    })
    
    authStore.setAuth({
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken
    })
    
    toast.add({ title: t('auth.login.success'), color: 'success' })
    navigateTo('/dashboard')
  } catch (error: any) {
    toast.add({ 
      title: 'Erreur', 
      description: error.response?._data?.message || t('auth.login.error_default'), 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}
</script>
