<script setup lang="ts">
import { useRequestsApi } from '~/composables/useRequests'
import type { CreateRequestPayload } from '~/types/requests'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const route = useRoute()
const requestsApi = useRequestsApi()
const toast = useToast()
const loading = ref(false)

const request = await requestsApi.getMine(route.params.id as string)

async function handleSubmit(payload: CreateRequestPayload) {
  loading.value = true
  try {
    await requestsApi.update(route.params.id as string, payload)
    toast.add({ title: 'Demande mise a jour', color: 'success' })
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
      <h1 class="text-3xl font-bold">Modifier la demande</h1>
      <p class="mt-1 text-sm text-gray-500">Ajustez votre demande de service.</p>
    </div>

    <UCard>
      <RequestForm
        :initial-value="request"
        :loading="loading"
        submit-label="Enregistrer les modifications"
        @submit="handleSubmit"
      />
    </UCard>
  </div>
</template>
