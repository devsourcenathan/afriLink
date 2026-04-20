<script setup lang="ts">
import { useServicesApi } from '~/composables/useServices'
import { useServicesStore } from '~/stores/services.store'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const servicesApi = useServicesApi()
const servicesStore = useServicesStore()
const toast = useToast()

const loading = ref(true)

async function loadServices() {
  loading.value = true
  try {
    const services = await servicesApi.listMine()
    servicesStore.setMyServices(services)
  } finally {
    loading.value = false
  }
}

async function archiveService(id: string) {
  try {
    await servicesApi.archive(id)
    await loadServices()
    toast.add({ title: 'Service archive', color: 'success' })
  } catch {
    toast.add({ title: 'Echec de l archivage', color: 'error' })
  }
}

await loadServices()
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Mes Services</h1>
        <p class="mt-1 text-sm text-gray-500">Creez, modifiez et archivez vos offres.</p>
      </div>

      <UButton to="/dashboard/services/create" color="primary" icon="i-heroicons-plus">
        Nouveau service
      </UButton>
    </div>

    <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <UCard v-for="index in 4" :key="index" class="animate-pulse">
        <USkeleton class="h-6 w-1/2" />
        <USkeleton class="mt-4 h-16 w-full" />
      </UCard>
    </div>

    <div v-else-if="servicesStore.myServices.length" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <UCard v-for="service in servicesStore.myServices" :key="service.id">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold">{{ service.title }}</h3>
            <p class="mt-2 text-sm text-gray-500">{{ service.category }}</p>
          </div>
          <UBadge>{{ service.status }}</UBadge>
        </div>

        <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {{ service.description.slice(0, 140) }}{{ service.description.length > 140 ? '...' : '' }}
        </p>

        <div class="mt-6 flex gap-3">
          <UButton :to="`/dashboard/services/${service.id}/edit`" variant="soft">Modifier</UButton>
          <UButton color="error" variant="outline" @click="archiveService(service.id)">Archiver</UButton>
        </div>
      </UCard>
    </div>

    <UCard v-else class="py-16 text-center">
      <h3 class="text-lg font-semibold">Aucun service</h3>
      <p class="mt-2 text-sm text-gray-500">Creez votre premiere offre pour commencer.</p>
    </UCard>
  </div>
</template>
