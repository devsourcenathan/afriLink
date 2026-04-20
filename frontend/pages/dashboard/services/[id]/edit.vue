<script setup lang="ts">
import { useServicesApi } from '~/composables/useServices'
import type { CreateServicePayload } from '~/types/services'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const route = useRoute()
const servicesApi = useServicesApi()
const toast = useToast()
const loading = ref(false)

const service = await servicesApi.getMine(route.params.id as string)

async function handleSubmit(payload: CreateServicePayload) {
  loading.value = true
  try {
    await servicesApi.update(route.params.id as string, payload)
    toast.add({ title: 'Service mis a jour', color: 'success' })
  } catch {
    toast.add({ title: 'Echec de mise a jour', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Modifier le service</h1>
      <p class="mt-1 text-sm text-gray-500">Ajustez votre offre en toute simplicite.</p>
    </div>

    <UCard>
      <ServiceForm
        :initial-value="service"
        :loading="loading"
        submit-label="Enregistrer les modifications"
        @submit="handleSubmit"
      />
    </UCard>
  </div>
</template>
