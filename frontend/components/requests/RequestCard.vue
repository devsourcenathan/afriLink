<script setup lang="ts">
import type { ServiceRequestItem } from '~/types/requests'

const props = defineProps<{
  request: ServiceRequestItem
  showStatus?: boolean
}>()

const companyName = computed(
  () =>
    props.request.company.companyProfile?.companyName ||
    `${props.request.company.user.firstName} ${props.request.company.user.lastName}`,
)

const descriptionPreview = computed(() =>
  props.request.description.length > 140
    ? `${props.request.description.slice(0, 140)}...`
    : props.request.description,
)
</script>

<template>
  <UCard class="flex h-full flex-col">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ request.title }}</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ companyName }}</p>
      </div>

      <UBadge v-if="showStatus" variant="soft">{{ request.status }}</UBadge>
    </div>

    <p class="mt-4 flex-1 text-sm text-gray-600 dark:text-gray-300">{{ descriptionPreview }}</p>

    <div class="mt-4 flex flex-wrap gap-2">
      <UBadge color="primary" variant="soft">{{ request.category }}</UBadge>
      <UBadge color="warning" variant="soft">{{ request.urgency }}</UBadge>
      <UBadge v-for="tag in request.tags.slice(0, 3)" :key="tag" color="gray" variant="outline">
        {{ tag }}
      </UBadge>
    </div>

    <div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
      <div>
        <p class="font-bold text-gray-900 dark:text-white">
          {{ request.budgetMin ?? 0 }} - {{ request.budgetMax ?? 0 }} CFA
        </p>
        <p v-if="request.location" class="text-xs text-gray-500">{{ request.location }}</p>
      </div>

      <UButton :to="`/requests/${request.id}`" color="primary" variant="soft">Voir</UButton>
    </div>
  </UCard>
</template>
