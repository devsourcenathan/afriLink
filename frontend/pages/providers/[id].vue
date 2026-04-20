<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useHead, navigateTo } from '#imports'
import { useI18n } from 'vue-i18n'
import { ApiRoutes } from '~/constants/api.routes'
import { useApi } from '~/composables/useApi'
import type { ProviderSummary } from '~/types/providers'

const route = useRoute()
const { t } = useI18n()

const providerId = route.params.id as string

const { data: provider, pending, error } = await useApi<ProviderSummary>(ApiRoutes.PROVIDERS.DETAIL(providerId))

if (error.value?.statusCode === 404) {
  await navigateTo('/providers')
}

const pageTitle = computed(() =>
  provider.value
    ? `${provider.value.user.firstName} ${provider.value.user.lastName} - Afri-Link`
    : 'Provider Details',
)

useHead({
  title: pageTitle,
})

const onContact = () => {
  alert('Contacting provider via Messaging is coming in Feature 9!')
}
</script>

<template>
  <div v-if="pending" class="flex h-96 items-center justify-center">
    <UIcon name="i-heroicons-arrow-path" class="h-12 w-12 animate-spin text-primary" />
  </div>

  <UContainer v-else-if="provider" class="max-w-5xl py-12">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-1">
        <UCard class="sticky top-8 text-center">
          <div class="relative mb-4 inline-block">
            <UAvatar
              :src="provider.user.avatarUrl ?? undefined"
              :alt="provider.user.firstName"
              size="3xl"
              class="ring-4 ring-white shadow-xl dark:ring-gray-900"
            />
            <span
              class="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-900"
              :class="provider.availability === 'UNAVAILABLE' ? 'bg-gray-400' : 'bg-green-500'"
            />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ provider.user.firstName }} {{ provider.user.lastName }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ provider.location || t('common.unknownLocation', 'Location unknown') }}
          </p>

          <div class="mt-6 flex flex-col justify-center gap-2">
            <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('provider.hourlyRate', 'Rate') }}</span>
              <span class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ provider.hourlyRate }} CFA/h</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('provider.availabilityLabel', 'Status') }}</span>
              <span class="text-sm font-medium">{{ provider.availability.replace('_', ' ') }}</span>
            </div>
          </div>

          <div class="mt-8 space-y-3">
            <UButton
              block
              size="lg"
              icon="i-heroicons-chat-bubble-left-ellipsis"
              @click="onContact"
            >
              {{ t('provider.contactMe', 'Contact Provider') }}
            </UButton>
            <UButton
              block
              variant="outline"
              color="neutral"
              size="lg"
              icon="i-heroicons-briefcase"
            >
              {{ t('provider.hireMe', 'Hire for Project') }}
            </UButton>
          </div>
        </UCard>
      </div>

      <div class="space-y-8 lg:col-span-2">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('provider.aboutMe', 'About') }}
            </h2>
          </template>
          <div class="prose max-w-none dark:prose-invert">
            <p v-if="provider.bio" class="whitespace-pre-wrap">{{ provider.bio }}</p>
            <p v-else class="italic text-gray-500">{{ t('provider.emptyBioDetail', 'Provider has not added a detailed bio yet.') }}</p>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('provider.skills', 'Skills & Capabilities') }}
            </h2>
          </template>

          <div v-if="provider.skills.length > 0" class="flex flex-wrap gap-2">
            <UBadge
              v-for="skill in provider.skills"
              :key="skill"
              size="md"
              color="primary"
              variant="soft"
            >
              {{ skill }}
            </UBadge>
          </div>
          <p v-else class="italic text-gray-500">
            {{ t('provider.emptySkillsDetail', 'No specific skills listed.') }}
          </p>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
