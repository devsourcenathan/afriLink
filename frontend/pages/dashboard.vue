<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-xl font-bold text-center">{{ $t('dashboard.title') }}</h2>
      </template>

      <div class="text-center space-y-4">
        <!-- Hack to dynamically translate using computed or v-t -->
        <p>{{ $t('dashboard.welcome', { name: authStore.currentUser?.firstName || 'Utilisateur' }) }}</p>
        
        <UButton color="error" variant="outline" @click="handleLogout" :loading="loading">
          {{ $t('dashboard.logout') }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { $api } = useNuxtApp()
const loading = ref(false)

async function handleLogout() {
  loading.value = true
  try {
    await $api('/auth/logout', { method: 'POST' })
  } catch (e: any) {
    console.error('Logout error', e)
  } finally {
    authStore.clearAuth()
    navigateTo('/auth/login')
    loading.value = false
  }
}
</script>
