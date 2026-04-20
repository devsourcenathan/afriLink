<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { t } = useI18n()

const role = computed(() => authStore.currentUser?.role)

const links = computed(() => {
  const baseLinks = [
    { label: 'Dashboard', icon: 'i-heroicons-home', to: '/dashboard' },
  ]

  if (role.value === 'PRESTATAIRE') {
    return [
      ...baseLinks,
      { label: 'Mes Services', icon: 'i-heroicons-briefcase', to: '/dashboard/services' },
      { label: 'Demandes', icon: 'i-heroicons-inbox-arrow-down', to: '/requests' },
      { label: 'Messagerie', icon: 'i-heroicons-chat-bubble-left-right', to: '/dashboard/messages' },
      { label: 'Profil', icon: 'i-heroicons-user', to: '/dashboard/profile' },
    ]
  }

  if (role.value === 'ENTREPRISE') {
    return [
      ...baseLinks,
      { label: 'Rechercher', icon: 'i-heroicons-magnifying-glass', to: '/dashboard/search' },
      { label: 'Mes demandes', icon: 'i-heroicons-clipboard-document-list', to: '/dashboard/requests' },
      { label: 'Services', icon: 'i-heroicons-briefcase', to: '/services' },
      { label: 'Messagerie', icon: 'i-heroicons-chat-bubble-left-right', to: '/dashboard/messages' },
      { label: 'Profil Entreprise', icon: 'i-heroicons-building-office', to: '/dashboard/profile' },
    ]
  }

  if (role.value === 'ADMIN') {
    return [
      ...baseLinks,
      { label: 'Gestion Utilisateurs', icon: 'i-heroicons-users', to: '/dashboard/admin/users' },
      { label: 'Validation Profils', icon: 'i-heroicons-check-badge', to: '/dashboard/admin/verifications' },
    ]
  }

  return [
    ...baseLinks,
    { label: 'Profil', icon: 'i-heroicons-user', to: '/dashboard/profile' },
  ]
})
</script>

<template>
  <div class="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-center border-b border-gray-200 p-6 dark:border-gray-800">
      <NuxtLink to="/dashboard" class="flex items-center gap-2">
        <UIcon name="i-heroicons-link" class="h-8 w-8 text-primary-500" />
        <span class="tracking-tight text-xl font-bold text-gray-900 dark:text-white">Afri-Link</span>
      </NuxtLink>
    </div>

    <div class="flex-1 overflow-y-auto px-3 py-4">
      <UVerticalNavigation :links="links" />
    </div>

    <div class="border-t border-gray-200 p-4 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <UAvatar :src="authStore.currentUser?.avatarUrl ?? undefined" :alt="authStore.currentUser?.firstName" size="sm" />
        <div class="overflow-hidden whitespace-nowrap text-ellipsis text-sm">
          <p class="font-medium text-gray-900 dark:text-gray-100">{{ authStore.currentUser?.firstName }} {{ authStore.currentUser?.lastName }}</p>
          <p class="truncate text-xs text-gray-500">{{ authStore.currentUser?.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
