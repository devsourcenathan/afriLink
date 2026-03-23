<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store';
import { useToast } from '#imports';
import { useApi } from '~/composables/useApi';

const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);

async function handleLogout() {
  loading.value = true;
  try {
    await useApi('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error', error);
  } finally {
    authStore.clearAuth();
    toast.add({ title: 'Logged out', description: 'You have been logged out successfully.', color: 'neutral' });
    navigateTo('/auth/login');
    loading.value = false;
  }
}

const items = [
  [
    {
      label: 'Profil',
      icon: 'i-heroicons-user',
      to: '/dashboard/profile'
    }
  ],
  [
    {
      label: 'Déconnexion',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: handleLogout
    }
  ]
];
</script>

<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 w-full h-16 flex items-center justify-between px-6">
    <div class="flex items-center gap-4">
      <!-- Mettre un bouton "menu" pour mobile ici si nécessaire -->
      <slot name="left"></slot>
    </div>
    
    <div class="flex items-center gap-4">
      <!-- Dark mode toggle example can go here if present in app -->
      <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
        <UButton color="neutral" variant="ghost" class="shrink-0">
          <UAvatar :src="authStore.currentUser?.avatarUrl" :alt="authStore.currentUser?.firstName" size="sm" />
          <span class="ml-2 hidden sm:block text-sm font-medium">{{ authStore.currentUser?.firstName }}</span>
          <UIcon name="i-heroicons-chevron-down-20-solid" class="w-5 h-5 ml-1 text-gray-400" />
        </UButton>
      </UDropdown>
    </div>
  </header>
</template>
