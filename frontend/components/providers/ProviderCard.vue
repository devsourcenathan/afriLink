<script setup lang="ts">
import { computed } from 'vue'
import type { ProviderSummary } from '~/types/providers'

const props = defineProps<{
  provider: ProviderSummary
}>()

const initials = computed(() => {
  const first = props.provider.user.firstName.charAt(0) || ''
  const last = props.provider.user.lastName.charAt(0) || ''
  return (first + last).toUpperCase() || 'P'
})

const displayName = computed(() => `${props.provider.user.firstName} ${props.provider.user.lastName}`)

const bioPreview = computed(() => {
  const bio = props.provider.bio || 'No description provided.'
  return bio.length > 120 ? `${bio.substring(0, 120)}...` : bio
})
</script>

<template>
  <UCard class="flex h-full cursor-pointer flex-col transition-shadow duration-200 hover:shadow-md" @click="$router.push(`/providers/${provider.id}`)">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-4">
        <UAvatar
          :src="provider.user.avatarUrl ?? undefined"
          :alt="initials"
          size="lg"
          :ui="{ background: 'bg-primary-100 dark:bg-primary-900', text: 'text-primary-600 dark:text-primary-300' }"
        >
          {{ !provider.user.avatarUrl ? initials : '' }}
        </UAvatar>
        <div>
          <h3 class="max-w-[200px] truncate font-semibold text-gray-900 dark:text-white">
            {{ displayName }}
          </h3>
          <p class="mt-0.5 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <UIcon name="i-heroicons-map-pin" class="h-4 w-4" />
            {{ provider.location || 'Location not specified' }}
          </p>
        </div>
      </div>
      <UBadge color="primary" variant="subtle" size="lg" class="font-bold">
        {{ provider.hourlyRate }} CFA / h
      </UBadge>
    </div>

    <div class="mt-4 flex-1">
      <p class="text-sm text-gray-600 dark:text-gray-300">
        {{ bioPreview }}
      </p>
    </div>

    <div class="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
      <UBadge
        v-for="skill in provider.skills.slice(0, 3)"
        :key="skill"
        color="gray"
        variant="solid"
        size="sm"
      >
        {{ skill }}
      </UBadge>
      <UBadge v-if="provider.skills.length > 3" color="gray" variant="soft" size="sm">
        +{{ provider.skills.length - 3 }} more
      </UBadge>
    </div>
  </UCard>
</template>
