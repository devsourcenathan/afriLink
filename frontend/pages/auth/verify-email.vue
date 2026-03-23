<template>
  <div class="text-center">
    <div class="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6" 
         :class="status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : (status === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600')">
      <UIcon v-if="status === 'loading'" name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
      <UIcon v-else-if="status === 'success'" name="i-heroicons-check" class="w-8 h-8" />
      <UIcon v-else name="i-heroicons-x-mark" class="w-8 h-8" />
    </div>

    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
      {{ status === 'loading' ? $t('auth.verify.title') : (status === 'success' ? $t('auth.verify.success') : $t('auth.verify.error_title')) }}
    </h2>
    <p class="text-base text-gray-500 dark:text-gray-400 mb-8">
      {{ status === 'loading' ? $t('auth.verify.loading') : (status === 'success' ? $t('auth.verify.success_desc') : errorMessage) }}
    </p>

    <div v-if="status !== 'loading'" class="mt-8">
      <UButton to="/auth/login" color="primary" block size="lg" class="font-semibold shadow-md">
        {{ $t('auth.verify.btn_back') || 'Retourner à la connexion' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { $api } = useNuxtApp()
const route = useRoute()
const { t } = useI18n()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    status.value = 'error'
    errorMessage.value = t('auth.verify.missing_token')
    return
  }

  try {
    await $api('/auth/verify-email', {
      method: 'POST',
      body: { token }
    })
    
    status.value = 'success'
    
    // Redirect to login after 3 seconds on success
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 3000)
    
  } catch (error: any) {
    status.value = 'error'
    errorMessage.value = error.response?._data?.message || t('auth.verify.invalid_token')
  }
})
</script>
