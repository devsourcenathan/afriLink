<script setup lang="ts">
import { useRequestsApi } from '~/composables/useRequests'

const route = useRoute()
const requestsApi = useRequestsApi()

const request = await requestsApi.getPublic(route.params.id as string)
</script>

<template>
  <UContainer class="max-w-4xl py-12">
    <UCard>
      <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <UBadge color="primary" variant="soft">{{ request.category }}</UBadge>
          <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{{ request.title }}</h1>
          <p class="mt-2 text-sm text-gray-500">
            Par
            {{ request.company.companyProfile?.companyName || `${request.company.user.firstName} ${request.company.user.lastName}` }}
          </p>
        </div>

        <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
          <p class="text-sm font-medium text-gray-500">Budget</p>
          <p class="text-2xl font-bold">{{ request.budgetMin ?? 0 }} - {{ request.budgetMax ?? 0 }} CFA</p>
          <p class="mt-2 text-sm text-gray-500">Urgence: {{ request.urgency }}</p>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-semibold">Description</h2>
        <p class="mt-3 whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ request.description }}</p>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <UAlert title="Localisation" :description="request.location || 'Non precisee'" color="neutral" variant="soft" />
        <UAlert title="Date limite" :description="request.deadlineAt || 'Non precisee'" color="neutral" variant="soft" />
      </div>

      <div v-if="request.tags.length" class="mt-8">
        <h2 class="text-lg font-semibold">Tags</h2>
        <div class="mt-3 flex flex-wrap gap-2">
          <UBadge v-for="tag in request.tags" :key="tag" color="gray" variant="soft">{{ tag }}</UBadge>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
