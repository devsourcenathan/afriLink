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
const fileInput = ref<HTMLInputElement | null>(null);

const state = reactive({
  firstName: authStore.currentUser?.firstName || '',
  lastName: authStore.currentUser?.lastName || '',
  phone: authStore.currentUser?.phone || '',
});

const schema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  phone: z.string().max(20).optional(),
});

async function onSubmit() {
  loading.value = true;
  try {
    const { data } = await useApi<any>(ApiRoutes.USERS.ME, {
      method: 'PATCH',
      body: state,
    });
    if (data.value) authStore.updateUser(data.value);
    toast.add({ title: t('profile.success'), color: 'success' });
  } catch (error: any) {
    toast.add({ title: t('profile.error'), description: error.message, color: 'error' });
  } finally {
    loading.value = false;
  }
}

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;
  const file = target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file as Blob);

  try {
    const { data } = await useApi<any>(ApiRoutes.USERS.AVATAR, {
      method: 'POST',
      body: formData,
    });
    if (data.value) authStore.updateUser(data.value);
    toast.add({ title: t('profile.success'), color: 'success' });
  } catch (error) {
    toast.add({ title: t('profile.error'), color: 'error' });
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white">{{ $t('profile.subtitle') }}</h3>
      </div>
    </template>
    
    <div class="flex flex-col md:flex-row gap-8 items-start">
      <!-- Avatar Upload Section -->
      <div class="flex flex-col items-center space-y-4 w-full md:w-1/3">
        <UAvatar :src="authStore.currentUser?.avatarUrl" :alt="authStore.currentUser?.firstName" size="3xl" class="ring-4 ring-primary-500/20" />
        <input type="file" ref="fileInput" class="hidden" accept=".png,.jpg,.jpeg,.webp" @change="onFileSelected" />
        <UButton variant="soft" color="primary" icon="i-heroicons-camera" @click="fileInput?.click()">
          {{ $t('profile.upload_avatar') }}
        </UButton>
        <span class="text-xs text-gray-500 max-w-xs text-center border-t border-gray-100 pt-3">JPG, PNG, WEBP (Max 5MB)</span>
      </div>

      <!-- Form Section -->
      <div class="flex-1 w-full bg-white dark:bg-gray-800 rounded-lg">
        <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <UFormField :label="$t('profile.first_name')" name="firstName">
              <UInput v-model="state.firstName" icon="i-heroicons-user" />
            </UFormField>

            <UFormField :label="$t('profile.last_name')" name="lastName">
              <UInput v-model="state.lastName" icon="i-heroicons-user" />
            </UFormField>
          </div>

          <UFormField :label="$t('profile.phone')" name="phone">
            <UInput v-model="state.phone" placeholder="+237 60000000" icon="i-heroicons-phone" />
          </UFormField>

          <UFormField label="Email address" name="email">
            <UInput :value="authStore.currentUser?.email" disabled icon="i-heroicons-envelope" />
          </UFormField>

          <div class="pt-6">
            <UButton type="submit" color="primary" :loading="loading" class="w-full sm:w-auto" size="lg">
              {{ $t('profile.save') }}
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </UCard>

  <ProfileProviderForm v-if="authStore.currentUser?.role === 'PRESTATAIRE'" />
  <ProfileCompanyForm v-if="authStore.currentUser?.role === 'ENTREPRISE'" />
</template>
