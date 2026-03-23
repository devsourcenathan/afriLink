<script setup lang="ts">
import { z } from 'zod';
// ApiRoutes removed - not needed here
import { useAuthStore } from '~/stores/auth.store';

// We import explicit composables for stability
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from '#imports';
import { useApi } from '~/composables/useApi';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const { t } = useI18n();
const authStore = useAuthStore();
const toast = useToast();

const isProvider = computed(() => authStore.currentUser?.role === 'PRESTATAIRE');

const schema = z.object({
  bio: z.string().max(1000, 'Bio too long').optional(),
  hourlyRate: z.number().min(0, 'Hourly rate cannot be negative').optional(),
  availability: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'UNAVAILABLE']).optional(),
  location: z.string().max(100, 'Location too long').optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  bio: '',
  hourlyRate: 0,
  availability: 'UNAVAILABLE',
  location: '',
});

// We need a specific reactive array for skills to play nicely with UInput and badges
const skillsParam = ref<string>('');
const skillsArray = ref<string[]>([]);

const addSkill = () => {
  if (skillsParam.value.trim() && !skillsArray.value.includes(skillsParam.value.trim())) {
    skillsArray.value.push(skillsParam.value.trim());
    skillsParam.value = '';
  }
};

const removeSkill = (index: number) => {
  skillsArray.value.splice(index, 1);
};

const isLoading = ref(true);
const isSaving = ref(false);

const loadProfile = async () => {
  if (!isProvider.value) {
    isLoading.value = false;
    return;
  }
  
  try {
    const { data } = await useApi<any>('/providers/me/profile');
    if (data.value) {
      state.bio = data.value.bio || '';
      state.hourlyRate = data.value.hourlyRate || 0;
      state.availability = data.value.availability || 'UNAVAILABLE';
      state.location = data.value.location || '';
      skillsArray.value = data.value.skills || [];
    }
  } catch (e) {
    console.error('Failed to load provider profile', e);
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async () => {
  isSaving.value = true;
  try {
    const payload = {
      ...state,
      skills: skillsArray.value,
    };
    const { error } = await useApi('/providers/me/profile', {
      method: 'POST',
      body: payload,
    });
    
    if (error.value) {
      toast.add({ title: t('profile.updateError', 'Update failed'), color: 'error' });
    } else {
      toast.add({ title: t('profile.updateSuccess', 'Profile updated'), color: 'success' });
    }
  } catch (e) {
    toast.add({ title: t('profile.updateError', 'Update failed'), color: 'error' });
  } finally {
    isSaving.value = false;
  }
};

// Initialization hook
loadProfile();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        {{ t('nav.providerProfile', 'Provider Profile') }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t('provider.subtitle', 'Manage your professional services presence') }}
      </p>
    </div>

    <UCard v-if="!isProvider" class="bg-yellow-50 dark:bg-yellow-900/20">
      <div class="text-center py-6">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-200">
          {{ t('provider.notAProvider', 'Not a Provider Account') }}
        </h3>
        <p class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
          {{ t('provider.notAProviderDesc', 'This page is exclusively for service providers.') }}
        </p>
      </div>
    </UCard>

    <div v-else-if="isLoading" class="flex justify-center p-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
    </div>

    <UForm v-else :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ t('provider.professionalInfo', 'Professional Information') }}
          </h3>
        </template>

        <div class="space-y-4">
          <UFormField :label="t('provider.bio', 'Professional Bio')" name="bio">
            <UTextarea
              v-model="state.bio"
              :rows="4"
              :placeholder="t('provider.bioPlaceholder', 'Describe your expertise and experience...')"
            />
          </UFormField>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField :label="t('provider.hourlyRate', 'Hourly Rate (CFA)')" name="hourlyRate">
              <UInput
                v-model.number="state.hourlyRate"
                type="number"
                min="0"
                icon="i-heroicons-currency-dollar"
              />
            </UFormField>

            <UFormField :label="t('provider.availability', 'Availability')" name="availability">
              <USelect
                v-model="state.availability"
                :options="[
                  { label: 'Full Time', value: 'FULL_TIME' },
                  { label: 'Part Time', value: 'PART_TIME' },
                  { label: 'Contract', value: 'CONTRACT' },
                  { label: 'Unavailable', value: 'UNAVAILABLE' }
                ]"
              />
            </UFormField>
          </div>

          <UFormField :label="t('provider.location', 'Primary Location')" name="location">
             <UInput
                v-model="state.location"
                icon="i-heroicons-map-pin"
                :placeholder="t('provider.locationPlaceholder', 'e.g., Douala, Cameroon')"
              />
          </UFormField>

          <UFormField :label="t('provider.skills', 'Skills & Capabilities')">
            <div class="flex gap-2">
              <UInput
                v-model="skillsParam"
                class="flex-1"
                :placeholder="t('provider.skillPlaceholder', 'Add a skill (e.g., Plomberie)')"
                @keyup.enter.prevent="addSkill"
              />
              <UButton
                color="neutral"
                variant="solid"
                icon="i-heroicons-plus"
                @click="addSkill"
              />
            </div>
            
            <div class="mt-3 flex flex-wrap gap-2">
              <UBadge
                v-for="(skill, index) in skillsArray"
                :key="index"
                color="primary"
                variant="subtle"
                class="flex items-center gap-1"
              >
                {{ skill }}
                <UIcon 
                  name="i-heroicons-x-mark" 
                  class="w-3 h-3 cursor-pointer hover:text-red-500" 
                  @click="removeSkill(index)" 
                />
              </UBadge>
              <p v-if="skillsArray.length === 0" class="text-sm text-gray-500 italic">
                {{ t('provider.noSkills', 'No skills added yet.') }}
              </p>
            </div>
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              type="submit"
              color="primary"
              :loading="isSaving"
            >
              {{ t('common.save', 'Save Changes') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UForm>
  </div>
</template>
