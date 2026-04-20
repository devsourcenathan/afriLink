<script setup lang="ts">
import { useServicesApi } from '~/composables/useServices'
import type { CreateServicePayload } from '~/types/services'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const servicesApi = useServicesApi()
const toast = useToast()
const loading = ref(false)

async function handleSubmit(payload: CreateServicePayload) {
  loading.value = true
  try {
    const service = await servicesApi.create(payload)
    toast.add({ title: 'Service cree', color: 'success' })
    await navigateTo(`/dashboard/services/${service.id}/edit`)
  } catch (error: unknown) {
    toast.add({ title: 'Echec de creation', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Nouveau service</h1>
      <p class="mt-1 text-sm text-gray-500">Publiez une nouvelle offre.</p>
    </div>

    <UCard>
      <ServiceForm :loading="loading" submit-label="Creer le service" @submit="handleSubmit" />
    </UCard>
  </div>
</template>
