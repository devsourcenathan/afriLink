<template>
  <div>
    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
      {{ $t('auth.reset_pass.title') }}
    </h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      Veuillez renseigner votre nouveau mot de passe.
    </p>

    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <UFormField :label="$t('auth.reset_pass.new_pass_label')" name="newPassword">
        <UInput 
          v-model="state.newPassword" 
          type="password" 
          icon="i-heroicons-lock-closed" 
          placeholder="••••••••" 
          size="lg"
        />
      </UFormField>

      <UFormField :label="$t('auth.reset_pass.confirm_pass_label')" name="confirmPassword">
        <UInput 
          v-model="state.confirmPassword" 
          type="password" 
          icon="i-heroicons-lock-closed" 
          placeholder="••••••••" 
          size="lg"
        />
      </UFormField>

      <UButton type="submit" color="primary" block size="lg" :loading="loading" class="mt-8 font-semibold shadow-md">
        {{ $t('auth.reset_pass.submit_btn') }}
      </UButton>
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
const route = useRoute()

const token = route.query.token as string

const schema = z.object({
  newPassword: z.string().min(6, t('auth.validation.min_password')),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: t('auth.validation.pass_mismatch'),
  path: ['confirmPassword']
})

const state = reactive({
  newPassword: '',
  confirmPassword: ''
})

async function onSubmit() {
  if (!token) {
    toast.add({ title: 'Erreur', description: t('auth.reset_pass.missing_token'), color: 'error' })
    return
  }

  loading.value = true
  try {
    await $api('/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        newPassword: state.newPassword
      }
    })
    
    toast.add({ 
      title: t('auth.reset_pass.success'), 
      description: t('auth.reset_pass.success_desc'),
      color: 'success' 
    })
    navigateTo('/auth/login')
  } catch (error: any) {
    toast.add({ 
      title: 'Erreur', 
      description: error.response?._data?.message || t('auth.reset_pass.error'), 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}
</script>
