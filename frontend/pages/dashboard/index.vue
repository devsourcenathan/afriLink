<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});

const authStore = useAuthStore();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <UCard>
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">Profile Overview</h3>
      </template>
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <UAvatar :src="authStore.currentUser?.avatarUrl" :alt="authStore.currentUser?.firstName" size="lg" />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ authStore.currentUser?.firstName }} {{ authStore.currentUser?.lastName }}</p>
            <p class="text-sm text-gray-500">{{ authStore.currentUser?.email }}</p>
          </div>
        </div>
        <UAlert title="Role" :description="authStore.currentUser?.role" color="primary" variant="subtle" />
        <UAlert title="Status" :description="authStore.currentUser?.status" color="success" variant="subtle" />
      </div>
    </UCard>
    
    <UCard class="md:col-span-2">
      <template #header>
        <h3 class="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </template>
      <div class="flex items-center justify-center h-48 text-gray-400">
        <p>No recent activity.</p>
      </div>
    </UCard>
  </div>
</template>
