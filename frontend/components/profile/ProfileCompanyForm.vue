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

const profile = authStore.currentUser?.companyProfile || {};

const state = reactive({
  companyName: profile.companyName || '',
  description: profile.description || '',
  website: profile.website || '',
  industry: profile.industry || '',
  size: profile.size || '',
});

const schema = z.object({
  companyName: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
});

async function onSubmit() {
  loading.value = true;
  try {
    const { data } = await useApi<any>(ApiRoutes.USERS.COMPANY_PROFILE, {
      method: 'PATCH',
      body: state,
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
      <h3 class="font-semibold text-gray-900 dark:text-white">Company Profile</h3>
    </template>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg">
      <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormField label="Company Name" name="companyName">
            <UInput v-model="state.companyName" icon="i-heroicons-building-office-2" />
          </UFormField>

          <UFormField label="Industry" name="industry">
            <UInput v-model="state.industry" icon="i-heroicons-briefcase" />
          </UFormField>
        </div>

        <UFormField label="Description" name="description">
          <UTextarea v-model="state.description" :rows="4" />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormField label="Website" name="website">
            <UInput v-model="state.website" placeholder="https://..." icon="i-heroicons-globe-alt" />
          </UFormField>

          <UFormField label="Company Size" name="size">
            <UInput v-model="state.size" placeholder="e.g. 1-10, 11-50" icon="i-heroicons-user-group" />
          </UFormField>
        </div>

        <div class="pt-6">
          <UButton type="submit" color="primary" :loading="loading" size="lg">
            Save Company Profile
          </UButton>
        </div>
      </UForm>
    </div>
  </UCard>
</template>
