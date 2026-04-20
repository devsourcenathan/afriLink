<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, useHead } from '#imports'
import { ApiRoutes } from '~/constants/api.routes'
import { useApi } from '~/composables/useApi'
import type { ProvidersListResponse } from '~/types/providers'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

useHead({
  title: `${t('nav.providers', 'Providers')} - Afri-Link`,
})

const searchQuery = ref((route.query.q as string) || '')
const locationQuery = ref((route.query.location as string) || '')
const maxRate = ref<number | undefined>(
  route.query.maxRate ? Number(route.query.maxRate) : undefined,
)
const page = ref(route.query.page ? Number(route.query.page) : 1)

const { data: providersResponse, pending, refresh } = await useAsyncData(
  'providers-public-list',
  () => useApi<ProvidersListResponse>(ApiRoutes.PROVIDERS.LIST, {
    query: {
      q: searchQuery.value || undefined,
      location: locationQuery.value || undefined,
      maxRate: maxRate.value,
      page: page.value,
      limit: 12,
    },
  }).then((response) => response.data.value),
  { watch: [page] },
)

let timeout: ReturnType<typeof setTimeout> | undefined
const syncRoute = () => {
  if (timeout) {
    clearTimeout(timeout)
  }

  timeout = setTimeout(() => {
    page.value = 1
    void router.push({
      query: {
        q: searchQuery.value || undefined,
        location: locationQuery.value || undefined,
        maxRate: maxRate.value || undefined,
        page: page.value > 1 ? page.value : undefined,
      },
    })
    void refresh()
  }, 400)
}

watch([searchQuery, locationQuery, maxRate], syncRoute)
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-12 max-w-2xl text-center">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
        {{ t('provider.findProfessionals', 'Find Top Professionals') }}
      </h1>
      <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        {{ t('provider.directorySubtitle', 'Browse through vetted service providers, compare their skills, and hire the perfect match for your project.') }}
      </p>
    </div>

    <div class="mb-12 max-w-4xl">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          size="lg"
          :placeholder="t('provider.searchSkillsPlaceholder', 'Search skills, e.g., Plumbing, Node.js')"
        />
        <UInput
          v-model="locationQuery"
          icon="i-heroicons-map-pin"
          size="lg"
          :placeholder="t('provider.locationPlaceholder', 'Location')"
        />
        <UInput
          v-model.number="maxRate"
          type="number"
          icon="i-heroicons-currency-dollar"
          size="lg"
          placeholder="Max CFA / h"
        />
      </div>
    </div>

    <div v-if="pending" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard v-for="index in 6" :key="index" class="animate-pulse">
        <div class="flex items-start gap-4">
          <USkeleton class="h-12 w-12 rounded-full" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-4 w-3/4" />
            <USkeleton class="h-3 w-1/2" />
          </div>
        </div>
        <div class="mt-6 space-y-2">
          <USkeleton class="h-3 w-full" />
          <USkeleton class="h-3 w-4/5" />
        </div>
      </UCard>
    </div>

    <div v-else-if="providersResponse?.data?.length" class="space-y-8">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProviderCard
          v-for="provider in providersResponse.data"
          :key="provider.id"
          :provider="provider"
        />
      </div>

      <div v-if="providersResponse.meta.totalPages > 1" class="flex justify-center">
        <UPagination
          v-model="page"
          :page-count="providersResponse.meta.limit"
          :total="providersResponse.meta.total"
        />
      </div>
    </div>

    <UCard v-else class="bg-gray-50 py-16 text-center dark:bg-gray-900">
      <UIcon name="i-heroicons-users" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
        {{ t('provider.noProvidersFound', 'No providers found') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t('provider.tryAdjustingSearch', 'Try adjusting your search or filters to find what you are looking for.') }}
      </p>
      <div class="mt-6">
        <UButton
          v-if="searchQuery || locationQuery || maxRate"
          icon="i-heroicons-x-mark"
          variant="soft"
          @click="searchQuery = ''; locationQuery = ''; maxRate = undefined; syncRoute()"
        >
          {{ t('common.clearFilters', 'Clear Filters') }}
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>
