<script setup lang="ts">
import { z } from 'zod';
import { ApiRoutes } from '~/constants/api.routes';
import { useAuthStore } from '~/stores/auth.store';
import { useToast, ref, reactive } from '#imports';
import { useI18n } from 'vue-i18n';
import { useApi } from '~/composables/useApi';

const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

const loading = ref(false);

const profile = authStore.currentUser?.providerProfile || {};

const state = reactive({
  bio: profile.bio || '',
  hourlyRate: profile.hourlyRate || 0,
  skills: profile.skills ? profile.skills.join(', ') : '',
  availability: profile.availability || 'FULL_TIME',
  location: profile.location || '',
});

const schema = z.object({
  bio: z.string().max(1000).optional(),
  hourlyRate: z.number().min(0).max(10000).optional(),
  skills: z.string().optional(),
  availability: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'UNAVAILABLE']).optional(),
  location: z.string().max(100).optional(),
});

const availabilityOptions = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'UNAVAILABLE', label: 'Unavailable' }
];

async function onSubmit() {
  loading.value = true;
  try {
    const payload = {
      ...state,
      skills: state.skills ? state.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };

    const { data } = await useApi<any>(ApiRoutes.USERS.PROVIDER_PROFILE, {
      method: 'PATCH',
      body: payload,
    });

    if (data.value) authStore.updateUser(data.value);
    toast.add({ title: t('profile.success') || 'Profile updated successfully', color: 'success' });
  } catch (error: any) {
    toast.add({ title: t('profile.error') || 'Error', description: error.message, color: 'error' });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UCard class="mt-8">
    <template #header>
      <h3 class="font-semibold text-gray-900 dark:text-white">Provider Profile</h3>
    </template>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg">
      <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        
        <UFormField label="Bio" name="bio">
          <UTextarea v-model="state.bio" :rows="4" />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormField label="Hourly Rate ($)" name="hourlyRate">
            <UInput v-model.number="state.hourlyRate" type="number" icon="i-heroicons-currency-dollar" />
          </UFormField>

          <UFormField label="Location" name="location">
            <UInput v-model="state.location" icon="i-heroicons-map-pin" />
          </UFormField>
        </div>

        <UFormField label="Skills (comma separated)" name="skills">
          <UInput v-model="state.skills" placeholder="e.g. React, Node.js, Graphic Design" icon="i-heroicons-wrench" />
        </UFormField>

        <UFormField label="Availability" name="availability">
          <USelect v-model="state.availability" :options="availabilityOptions" />
        </UFormField>

        <div class="pt-6">
          <UButton type="submit" color="primary" :loading="loading" size="lg">
            Save Provider Profile
          </UButton>
        </div>
      </UForm>
    </div>
  </UCard>
</template>
