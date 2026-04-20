<script setup lang="ts">
import { useRequestsApi } from '~/composables/useRequests'
import { useRequestsStore } from '~/stores/requests.store'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const requestsApi = useRequestsApi()
const requestsStore = useRequestsStore()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)

async function loadRequests() {
  loading.value = true
  try {
    if (authStore.currentUser?.role === 'ENTREPRISE') {
      const requests = await requestsApi.listMine()
      requestsStore.setMyRequests(requests)
    }
  } finally {
    loading.value = false
  }
}

async function cancelRequest(id: string) {
  try {
    await requestsApi.cancel(id)
    await loadRequests()
    toast.add({ title: 'Demande annulee', color: 'success' })
  } catch {
    toast.add({ title: 'Echec de l annulation', color: 'error' })
  }
}

await loadRequests()
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Mes demandes</h1>
        <p class="mt-1 text-sm text-gray-500">Publiez et gerez vos besoins.</p>
      </div>

      <UButton v-if="authStore.currentUser?.role === 'ENTREPRISE'" to="/dashboard/requests/create" color="primary" icon="i-heroicons-plus">
        Nouvelle demande
      </UButton>
    </div>

    <UCard v-if="authStore.currentUser?.role !== 'ENTREPRISE'" class="py-16 text-center">
      <h3 class="text-lg font-semibold">Espace entreprise uniquement</h3>
      <p class="mt-2 text-sm text-gray-500">Cette section est reservee aux entreprises.</p>
    </UCard>

    <div v-else-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <UCard v-for="index in 4" :key="index" class="animate-pulse">
        <USkeleton class="h-6 w-1/2" />
        <USkeleton class="mt-4 h-16 w-full" />
      </UCard>
    </div>

    <div v-else-if="requestsStore.myRequests.length" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <UCard v-for="request in requestsStore.myRequests" :key="request.id">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold">{{ request.title }}</h3>
            <p class="mt-2 text-sm text-gray-500">{{ request.category }}</p>
          </div>
          <UBadge>{{ request.status }}</UBadge>
        </div>

        <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {{ request.description.slice(0, 140) }}{{ request.description.length > 140 ? '...' : '' }}
        </p>

        <div class="mt-6 flex gap-3">
          <UButton :to="`/dashboard/requests/${request.id}/edit`" variant="soft">Modifier</UButton>
          <UButton color="error" variant="outline" @click="cancelRequest(request.id)">Annuler</UButton>
        </div>
      </UCard>
    </div>

    <UCard v-else class="py-16 text-center">
      <h3 class="text-lg font-semibold">Aucune demande</h3>
      <p class="mt-2 text-sm text-gray-500">Creez votre premiere demande de service.</p>
    </UCard>
  </div>
</template>
