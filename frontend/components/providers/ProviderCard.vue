<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  provider: any;
}>();

const initials = computed(() => {
  if (!props.provider?.user) return 'P';
  const first = props.provider.user.firstName?.charAt(0) || '';
  const last = props.provider.user.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'P';
});

const displayName = computed(() => {
  if (!props.provider?.user) return 'Unknown Provider';
  return `${props.provider.user.firstName} ${props.provider.user.lastName}`;
});

const bioPreview = computed(() => {
  const bio = props.provider?.bio || 'No description provided.';
  return bio.length > 120 ? bio.substring(0, 120) + '...' : bio;
});
</script>

<template>
  <UCard class="flex flex-col h-full hover:shadow-md transition-shadow duration-200 cursor-pointer" @click="$router.push(`/prestataires/${provider.id}`)">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-4">
        <UAvatar 
          :src="provider?.user?.avatarUrl" 
          :alt="initials" 
          size="lg"
          :ui="{ background: 'bg-primary-100 dark:bg-primary-900', text: 'text-primary-600 dark:text-primary-300' }"
        >
          {{ !provider?.user?.avatarUrl ? initials : '' }}
        </UAvatar>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-[200px]">
            {{ displayName }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
            {{ provider.location || 'Location not specified' }}
          </p>
        </div>
      </div>
      <div>
        <UBadge color="primary" variant="subtle" size="lg" class="font-bold">
          {{ provider.hourlyRate }} CFA / h
        </UBadge>
      </div>
    </div>

    <div class="mt-4 flex-1">
      <p class="text-sm text-gray-600 dark:text-gray-300">
        {{ bioPreview }}
      </p>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
      <UBadge 
        v-for="skill in provider.skills?.slice(0, 3)" 
        :key="skill"
        color="gray" 
        variant="solid" 
        size="sm"
      >
        {{ skill }}
      </UBadge>
      <UBadge v-if="provider.skills?.length > 3" color="gray" variant="soft" size="sm">
        +{{ provider.skills.length - 3 }} more
      </UBadge>
    </div>
  </UCard>
</template>
