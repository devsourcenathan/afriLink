<script setup lang="ts">
import { useRequestsApi } from '~/composables/useRequests'
import type { RequestUrgency } from '~/types/requests-enums'
import type { ServiceCategory } from '~/types/services-enums'

const requestsApi = useRequestsApi()

const q = ref('')
const category = ref<ServiceCategory | undefined>(undefined)
const urgency = ref<RequestUrgency | undefined>(undefined)
const page = ref(1)

const { data: response, pending, refresh } = await useAsyncData(
  'requests-public',
  () =>
    requestsApi.listPublic({
      q: q.value || undefined,
      category: category.value,
      urgency: urgency.value,
      page: page.value,
      limit: 12,
    }),
  { watch: [page] },
)

let debounceTimeout: ReturnType<typeof setTimeout> | undefined
watch([q, category, urgency], () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    page.value = 1
    void refresh()
  }, 400)
})

const categoryItems = [
  { label: 'Toutes', value: undefined },
  { label: 'IT Development', value: 'IT_DEVELOPMENT' },
  { label: 'Design Graphique', value: 'DESIGN_GRAPHIQUE' },
  { label: 'Marketing Digital', value: 'MARKETING_DIGITAL' },
  { label: 'Autre', value: 'AUTRE' },
]

const urgencyItems = [
  { label: 'Toutes', value: undefined },
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' },
]
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-10">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Demandes de services</h1>
      <p class="mt-2 text-gray-500">Explorez les besoins publies par les entreprises.</p>
    </div>

    <UCard class="mb-8">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <UInput v-model="q" icon="i-heroicons-magnifying-glass" placeholder="Rechercher une demande" />
        <USelect v-model="category" :items="categoryItems" />
        <USelect v-model="urgency" :items="urgencyItems" />
      </div>
    </UCard>

    <div v-if="pending" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard v-for="index in 6" :key="index" class="animate-pulse">
        <USkeleton class="h-5 w-2/3" />
        <USkeleton class="mt-4 h-20 w-full" />
      </UCard>
    </div>

    <div v-else-if="response?.data?.length" class="space-y-8">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RequestCard v-for="request in response.data" :key="request.id" :request="request" />
      </div>

      <div v-if="response.meta.totalPages > 1" class="flex justify-center">
        <UPagination v-model="page" :page-count="response.meta.limit" :total="response.meta.total" />
      </div>
    </div>

    <UCard v-else class="py-16 text-center">
      <h3 class="text-lg font-semibold">Aucune demande trouvee</h3>
      <p class="mt-2 text-sm text-gray-500">Essayez de modifier vos filtres.</p>
    </UCard>
  </UContainer>
</template>
