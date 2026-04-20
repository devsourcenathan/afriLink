<script setup lang="ts">
import { ApiRoutes } from '~/constants/api.routes'
import { useServicesApi } from '~/composables/useServices'
import type { ServiceCategory } from '~/types/services-enums'

const servicesApi = useServicesApi()

const q = ref('')
const category = ref<ServiceCategory | undefined>(undefined)
const maxPrice = ref<number | undefined>(undefined)
const page = ref(1)

const { data: response, pending, refresh } = await useAsyncData(
  'services-public',
  () => servicesApi.listPublic({
    q: q.value || undefined,
    category: category.value,
    maxPrice: maxPrice.value,
    page: page.value,
    limit: 12,
  }),
  { watch: [page] },
)

let debounceTimeout: ReturnType<typeof setTimeout> | undefined
watch([q, category, maxPrice], () => {
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
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-10">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Services</h1>
      <p class="mt-2 text-gray-500">Parcourez les offres publiees par nos prestataires.</p>
    </div>

    <UCard class="mb-8">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <UInput v-model="q" icon="i-heroicons-magnifying-glass" placeholder="Rechercher un service" />
        <USelect v-model="category" :items="categoryItems" />
        <UInput v-model.number="maxPrice" type="number" placeholder="Prix max (CFA)" />
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
        <ServiceCard v-for="service in response.data" :key="service.id" :service="service" />
      </div>

      <div v-if="response.meta.totalPages > 1" class="flex justify-center">
        <UPagination v-model="page" :page-count="response.meta.limit" :total="response.meta.total" />
      </div>
    </div>

    <UCard v-else class="py-16 text-center">
      <h3 class="text-lg font-semibold">Aucun service trouve</h3>
      <p class="mt-2 text-sm text-gray-500">Essayez de modifier vos filtres.</p>
    </UCard>
  </UContainer>
</template>
