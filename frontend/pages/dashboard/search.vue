<script setup lang="ts">
import { ref, watch } from 'vue';
import { useApi } from '~/composables/useApi';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});

const searchQuery = ref('');
const searchLocation = ref('');
const maxRate = ref<number | undefined>(undefined);
const page = ref(1);

const { data: response, pending, error, refresh } = await useAsyncData(
  'providers-search',
  () => useApi('/providers', {
    method: 'GET',
    query: {
      q: searchQuery.value || undefined,
      location: searchLocation.value || undefined,
      maxRate: maxRate.value || undefined,
      page: page.value,
      limit: 12
    }
  }).then(res => res.data.value),
  { watch: [page] }
);

// We debounce the search to avoid too many requests while typing
let debounceTimeout: any;
const triggerSearch = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    page.value = 1; // reset to first page on new search
    refresh();
  }, 500);
};

watch([searchQuery, searchLocation, maxRate], () => {
  triggerSearch();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Trouver un prestataire
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Recherchez parmi notre annuaire de professionnels qualifiés.
        </p>
      </div>
    </div>

    <!-- Filters Section -->
    <UCard class="bg-gray-50 dark:bg-gray-900/50">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Recherche libre" name="search">
          <UInput 
            v-model="searchQuery" 
            icon="i-heroicons-magnifying-glass" 
            placeholder="Nom, mot-clé, compétence..." 
          />
        </UFormGroup>
        
        <UFormGroup label="Localisation" name="location">
          <UInput 
            v-model="searchLocation" 
            icon="i-heroicons-map-pin" 
            placeholder="Ex: Douala, Yaoundé..." 
          />
        </UFormGroup>

        <UFormGroup label="Taux horaire max (CFA)" name="maxRate">
          <UInput 
            v-model.number="maxRate" 
            type="number"
            icon="i-heroicons-currency-dollar" 
            placeholder="Max CFA / h" 
          />
        </UFormGroup>
      </div>
    </UCard>

    <!-- Results Section -->
    <div>
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="i in 6" :key="i" class="animate-pulse">
          <div class="flex items-start gap-4">
            <USkeleton class="h-12 w-12 rounded-full" />
            <div class="space-y-2 flex-1">
              <USkeleton class="h-4 w-3/4" />
              <USkeleton class="h-3 w-1/2" />
            </div>
          </div>
          <div class="mt-6 space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-3 w-4/5" />
          </div>
        </UCard>
      </div>

      <div v-else-if="error" class="p-4 text-center text-red-500">
        Une erreur est survenue lors du chargement des prestataires.
      </div>

      <div v-else-if="response?.data?.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aucun prestataire trouvé</h3>
        <p class="mt-2 text-sm text-gray-500">Essayez de modifier vos filtres de recherche.</p>
      </div>

      <div v-else class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProviderCard 
            v-for="provider in response?.data" 
            :key="provider.id" 
            :provider="provider" 
          />
        </div>

        <div v-if="response?.meta?.totalPages > 1" class="flex justify-center">
          <UPagination 
            v-model="page" 
            :page-count="response.meta.limit" 
            :total="response.meta.total" 
          />
        </div>
      </div>
    </div>
  </div>
</template>
