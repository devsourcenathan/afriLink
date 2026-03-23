<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useApi } from '~/composables/useApi';

definePageMeta({
  layout: 'dashboard' // using dashboard layout for consistent styling or custom layout
});

const route = useRoute();
const id = route.params.id as string;

const { data: provider, pending, error } = await useAsyncData(
  `provider-${id}`,
  () => useApi(`/providers/${id}`).then(res => res.data.value)
);

const initials = computed(() => {
  if (!provider.value?.user) return 'P';
  const first = provider.value.user.firstName?.charAt(0) || '';
  const last = provider.value.user.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'P';
});
</script>

<template>
  <div v-if="pending" class="flex justify-center py-20">
    <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary-500" />
  </div>

  <div v-else-if="error || !provider" class="text-center py-20">
    <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Prestataire introuvable</h2>
    <p class="text-gray-500 mt-2">Ce profil n'existe pas ou n'est plus disponible.</p>
    <UButton to="/dashboard/search" class="mt-6" variant="soft">Retour à la recherche</UButton>
  </div>

  <div v-else class="max-w-4xl mx-auto space-y-8 pb-12">
    <!-- Header Card -->
    <UCard class="mt-6 border-t-4 border-t-primary-500">
      <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div class="flex items-center gap-6">
          <UAvatar 
            :src="provider.user?.avatarUrl" 
            :alt="initials" 
            size="3xl"
            :ui="{ background: 'bg-primary-100', text: 'text-primary-600' }"
          >
            {{ !provider.user?.avatarUrl ? initials : '' }}
          </UAvatar>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ provider.user?.firstName }} {{ provider.user?.lastName }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                {{ provider.location || 'Localisation non définie' }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                {{ provider.availability === 'FULL_TIME' ? 'Temps plein' : provider.availability === 'PART_TIME' ? 'Temps partiel' : 'Contrat' }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col gap-3 w-full md:w-auto">
          <div class="text-center md:text-right">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ provider.hourlyRate }} CFA</span>
            <span class="text-gray-500"> / heure</span>
          </div>
          <UButton size="lg" color="primary" block icon="i-heroicons-chat-bubble-left-ellipsis">
            Contacter
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Content Split -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Left Column: Bio & Experience -->
      <div class="md:col-span-2 space-y-8">
        <UCard>
          <template #header>
            <h3 class="font-semibold text-lg flex items-center gap-2">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-primary-500" />
              À propos
            </h3>
          </template>
          <div class="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-line">
            {{ provider.bio || 'Aucune biographie fournie.' }}
          </div>
        </UCard>
      </div>

      <!-- Right Column: Skills & Details -->
      <div class="space-y-8">
        <UCard>
          <template #header>
            <h3 class="font-semibold text-lg flex items-center gap-2">
              <UIcon name="i-heroicons-wrench" class="w-5 h-5 text-primary-500" />
              Compétences
            </h3>
          </template>
          <div v-if="provider.skills?.length" class="flex flex-wrap gap-2">
            <UBadge 
              v-for="skill in provider.skills" 
              :key="skill"
              color="primary" 
              variant="subtle" 
              size="md"
            >
              {{ skill }}
            </UBadge>
          </div>
          <p v-else class="text-gray-500 italic">Aucune compétence renseignée.</p>
        </UCard>
      </div>
      
    </div>
  </div>
</template>
