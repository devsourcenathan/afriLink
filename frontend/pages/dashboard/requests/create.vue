<script setup lang="ts">
import { useRequestsApi } from '~/composables/useRequests'
import type { CreateRequestPayload } from '~/types/requests'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const requestsApi = useRequestsApi()
const toast = useToast()
const loading = ref(false)

async function handleSubmit(payload: CreateRequestPayload) {
  loading.value = true
  try {
    const request = await requestsApi.create(payload)
    toast.add({ title: 'Demande creee', color: 'success' })
    await navigateTo(`/dashboard/requests/${request.id}/edit`)
  } catch {
    toast.add({ title: 'Echec de creation', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Nouvelle demande</h1>
      <p class="mt-1 text-sm text-gray-500">Publiez votre besoin pour recevoir des propositions.</p>
    </div>

    <UCard>
      <RequestForm :loading="loading" submit-label="Creer la demande" @submit="handleSubmit" />
    </UCard>
  </div>
</template>
