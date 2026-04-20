<script setup lang="ts">
import { ApiRoutes } from '~/constants/api.routes'
import { useServicesApi } from '~/composables/useServices'

const route = useRoute()
const servicesApi = useServicesApi()

const service = await servicesApi.getPublic(route.params.id as string)
</script>

<template>
  <UContainer class="max-w-4xl py-12">
    <UCard>
      <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <UBadge color="primary" variant="soft">{{ service.category }}</UBadge>
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{{ service.title }}</h1>
          <p class="mt-2 text-sm text-gray-500">
            Par {{ service.provider.user.firstName }} {{ service.provider.user.lastName }}
          </p>
        </div>

        <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
          <p class="text-2xl font-bold">{{ service.price }} CFA</p>
          <p v-if="service.deliveryTimeInDays" class="text-sm text-gray-500">
            Delai: {{ service.deliveryTimeInDays }} jours
          </p>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-semibold">Description</h2>
        <p class="mt-3 whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ service.description }}</p>
      </div>

      <div v-if="service.tags.length" class="mt-8">
        <h2 class="text-lg font-semibold">Tags</h2>
        <div class="mt-3 flex flex-wrap gap-2">
          <UBadge v-for="tag in service.tags" :key="tag" color="gray" variant="soft">
            {{ tag }}
          </UBadge>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
