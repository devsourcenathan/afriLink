<script setup lang="ts">
import { useRoute, useHead, useRouter } from '#imports';
import { useI18n } from 'vue-i18n';
import { useApi } from '~/composables/useApi';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const providerId = route.params.id as string;

const { data: provider, pending, error } = await useApi<any>(`/providers/${providerId}`);

// Redirect if not found
if (error.value && error.value.statusCode === 404) {
  router.push('/providers');
}

const pageTitle = computed(() => {
  if (provider.value) {
    return `${provider.value.user.firstName} ${provider.value.user.lastName} - Afri-Link`;
  }
  return 'Provider Details';
});

useHead({
  title: pageTitle,
});

const onContact = () => {
  // To be implemented in Messaging feature
  alert('Contacting provider via Messaging is coming in Feature 9!');
};
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center h-96">
    <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-primary animate-spin" />
  </div>
  
  <UContainer v-else-if="provider" class="py-12 max-w-5xl">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Right/Sidebar: Profile Overview -->
      <div class="lg:col-span-1 space-y-6">
        <UCard class="text-center sticky top-8">
          <div class="relative inline-block mb-4">
            <UAvatar
              :src="provider.user.avatarUrl"
              :alt="provider.user.firstName"
              size="3xl"
              class="ring-4 ring-white dark:ring-gray-900 shadow-xl"
            />
            <span 
              class="absolute bottom-1 right-1 w-4 h-4 border-2 border-white dark:border-gray-900 rounded-full"
              :class="provider.availability === 'UNAVAILABLE' ? 'bg-gray-400' : 'bg-green-500'"
            ></span>
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ provider.user.firstName }} {{ provider.user.lastName }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {{ provider.location || t('common.unknownLocation', 'Location unknown') }}
          </p>

          <div class="flex justify-center flex-col gap-2 mt-6">
             <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
               <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('provider.hourlyRate', 'Rate') }}</span>
               <span class="font-bold text-lg text-primary-600 dark:text-primary-400">{{ provider.hourlyRate }} CFA/h</span>
             </div>
             <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
               <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('provider.availabilityLabel', 'Status') }}</span>
               <span class="font-medium text-sm">{{ provider.availability.replace('_', ' ') }}</span>
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
             <!-- Order/Hire feature coming later -->
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

      <!-- Left/Main: Deep details -->
      <div class="lg:col-span-2 space-y-8">
        
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('provider.aboutMe', 'About') }}
            </h2>
          </template>
          <div class="prose dark:prose-invert max-w-none">
            <p v-if="provider.bio" class="whitespace-pre-wrap">{{ provider.bio }}</p>
            <p v-else class="text-gray-500 italic">{{ t('provider.emptyBioDetail', 'Provider has not added a detailed bio yet.') }}</p>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('provider.skills', 'Skills & Capabilities') }}
            </h2>
          </template>
          
          <div v-if="provider.skills && provider.skills.length > 0" class="flex flex-wrap gap-2">
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
          <p v-else class="text-gray-500 italic">
            {{ t('provider.emptySkillsDetail', 'No specific skills listed.') }}
          </p>
        </UCard>
      </div>

    </div>
  </UContainer>
</template>
