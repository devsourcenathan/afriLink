<template>
  <div>
    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
      {{ $t('auth.register.title') }}
    </h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
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
          placeholder="••••••••" 
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="$t('auth.register.role_label')" name="role">
        <USelect 
          v-model="state.role" 
          :items="[ 
            { label: $t('auth.register.role_entreprise'), value: 'ENTREPRISE' }, 
            { label: $t('auth.register.role_prestataire'), value: 'PRESTATAIRE' } 
          ]" 
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" color="primary" block size="lg" :loading="loading" class="mt-6 font-semibold shadow-md">
        {{ $t('auth.register.submit_btn') }}
      </UButton>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
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

definePageMeta({
  layout: 'auth'
})

const { $api } = useNuxtApp()
const toast = useToast()
const { t } = useI18n()
const loading = ref(false)

const schema = z.object({
  firstName: z.string().min(1, t('auth.validation.req_firstname')),
  lastName: z.string().min(1, t('auth.validation.req_lastname')),
  email: z.string().email(t('auth.validation.invalid_email')),
  password: z.string().min(6, t('auth.validation.min_password')),
  role: z.enum(['ENTREPRISE', 'PRESTATAIRE'])
})

const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'PRESTATAIRE' as 'ENTREPRISE' | 'PRESTATAIRE'
})

async function onSubmit() {
  loading.value = true
  try {
    await $api('/auth/register', {
      method: 'POST',
      body: state
    })
    
    toast.add({ 
      title: t('auth.register.success'), 
      description: t('auth.register.success_desc'),
      color: 'success' 
    })
    navigateTo('/dashboard')
  } catch (error: any) {
    toast.add({ 
      title: 'Erreur', 
      description: error.response?._data?.message || t('auth.register.error_default'), 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}
</script>
