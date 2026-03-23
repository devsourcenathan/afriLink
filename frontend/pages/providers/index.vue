<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter, useHead } from '#imports';
import { useApi } from '~/composables/useApi';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

useHead({
  title: t('nav.providers', 'Providers') + ' - Afri-Link',
});

// Search State
const searchQuery = ref((route.query.q as string) || '');
const locationQuery = ref((route.query.location as string) || '');

const { data: providers, pending, refresh } = await useApi<any[]>('/providers', {
  query: {
    skills: searchQuery,
    location: locationQuery,
  },
  watch: [searchQuery, locationQuery],
});

// Filter triggers
let timeout: any;
const onSearchInput = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    router.push({
      query: {
        ...route.query,
        q: searchQuery.value || undefined,
        location: locationQuery.value || undefined,
      },
    });
  }, 500);
};
</script>

<template>
  <UContainer class="py-12">
    <!-- Header -->
    <div class="max-w-2xl mx-auto text-center mb-12">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
        {{ t('provider.findProfessionals', 'Find Top Professionals') }}
      </h1>
      <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        {{ t('provider.directorySubtitle', 'Browse through vetted service providers, compare their skills, and hire the perfect match for your project.') }}
      </p>
    </div>

    <!-- Search / Filter Bar -->
    <div class="max-w-3xl mx-auto mb-12">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            size="lg"
            :placeholder="t('provider.searchSkillsPlaceholder', 'Search skills, e.g., Plomberie, Node.js')"
            @input="onSearchInput"
          />
        </div>
        <div class="sm:w-64">
           <UInput
            v-model="locationQuery"
            icon="i-heroicons-map-pin"
            size="lg"
            :placeholder="t('provider.locationPlaceholder', 'Location')"
            @input="onSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-primary-500 animate-spin" />
    </div>

    <!-- Results Grid -->
    <div v-else-if="providers && providers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="provider in providers"
        :key="provider.id"
        class="flex flex-col cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg"
        @click="router.push(`/providers/${provider.id}`)"
      >
        <div class="flex items-start gap-4 mb-4">
          <UAvatar
            :src="provider.user.avatarUrl"
            :alt="provider.user.firstName"
            size="lg"
            class="ring-2 ring-primary-500"
          />
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ provider.user.firstName }} {{ provider.user.lastName }}
            </h3>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
              {{ provider.location || t('common.unknown', 'Unknown location') }}
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-grow">
          {{ provider.bio || t('provider.noBio', 'This provider has not added a bio yet.') }}
        </p>

        <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ provider.hourlyRate }} CFA / hr
            </span>
            <UBadge
              :color="provider.availability === 'FULL_TIME' ? 'success' : provider.availability === 'PART_TIME' ? 'info' : 'neutral'"
              variant="subtle"
            >
              {{ provider.availability.replace('_', ' ') }}
            </UBadge>
          </div>
          
          <div class="flex flex-wrap gap-1">
            <UBadge
              v-for="skill in (provider.skills || []).slice(0, 3)"
              :key="skill"
              color="primary"
              variant="outline"
              size="xs"
            >
              {{ skill }}
            </UBadge>
            <span v-if="(provider.skills?.length || 0) > 3" class="text-xs text-gray-500">
              +{{ provider.skills.length - 3 }} {{ t('common.more', 'more') }}
            </span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <UCard v-else class="text-center py-16 bg-gray-50 dark:bg-gray-900">
      <UIcon name="i-heroicons-users" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
        {{ t('provider.noProvidersFound', 'No providers found') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t('provider.tryAdjustingSearch', 'Try adjusting your search or filters to find what you are looking for.') }}
      </p>
      <div class="mt-6">
        <UButton
          v-if="searchQuery || locationQuery"
          icon="i-heroicons-x-mark"
          variant="soft"
          @click="searchQuery = ''; locationQuery = ''; onSearchInput()"
        >
          {{ t('common.clearFilters', 'Clear Filters') }}
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>
