<script setup lang="ts">
import type { ServiceItem } from '~/types/services'

const props = defineProps<{
  service: ServiceItem
  showStatus?: boolean
}>()

const providerName = computed(
  () => `${props.service.provider.user.firstName} ${props.service.provider.user.lastName}`,
)

const previewDescription = computed(() =>
  props.service.description.length > 140
    ? `${props.service.description.slice(0, 140)}...`
    : props.service.description,
)
</script>

<template>
  <UCard class="flex h-full flex-col">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ service.title }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ providerName }}
        </p>
      </div>

      <UBadge v-if="showStatus" color="neutral" variant="soft">
        {{ service.status }}
      </UBadge>
    </div>

    <p class="mt-4 flex-1 text-sm text-gray-600 dark:text-gray-300">
      {{ previewDescription }}
    </p>

    <div class="mt-4 flex flex-wrap gap-2">
      <UBadge color="primary" variant="soft">{{ service.category }}</UBadge>
      <UBadge
        v-for="tag in service.tags.slice(0, 3)"
        :key="tag"
        color="gray"
        variant="outline"
      >
        {{ tag }}
      </UBadge>
    </div>

    <div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
      <div>
        <p class="text-lg font-bold text-gray-900 dark:text-white">
          {{ service.price }} CFA
        </p>
        <p v-if="service.deliveryTimeInDays" class="text-xs text-gray-500">
          {{ service.deliveryTimeInDays }} jours de delai
        </p>
      </div>

      <UButton :to="`/services/${service.id}`" color="primary" variant="soft">
        Voir
      </UButton>
    </div>
  </UCard>
</template>
