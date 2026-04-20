<script setup lang="ts">
import { z } from 'zod'
import { ApiRoutes } from '~/constants/api.routes'
import { useAuthStore } from '~/stores/auth.store'
import type { AuthUser, AvailabilityStatus, UpdateProviderProfilePayload } from '~/types/auth'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const toast = useToast()
const { t } = useI18n()

const loading = ref(false)

const state = reactive({
  bio: '',
  hourlyRate: 0,
  skills: '',
  availability: 'FULL_TIME' as AvailabilityStatus,
  location: '',
})

const schema = z.object({
  bio: z.string().max(1000).optional(),
  hourlyRate: z.number().min(0).max(10000),
  skills: z.string().optional(),
  availability: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'UNAVAILABLE']),
  location: z.string().max(100).optional(),
})

const availabilityOptions = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'UNAVAILABLE', label: 'Unavailable' },
]

function syncState(user: AuthUser | null) {
  const profile = user?.providerProfile
  state.bio = profile?.bio ?? ''
  state.hourlyRate = profile?.hourlyRate ?? 0
  state.skills = profile?.skills.join(', ') ?? ''
  state.availability = profile?.availability ?? 'FULL_TIME'
  state.location = profile?.location ?? ''
}

watch(() => authStore.currentUser, (user) => {
  syncState(user)
}, { immediate: true })

async function onSubmit() {
  loading.value = true

  try {
    const payload: UpdateProviderProfilePayload = {
      bio: state.bio || undefined,
      hourlyRate: state.hourlyRate,
      skills: state.skills
        ? state.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
        : [],
      availability: state.availability,
      location: state.location || undefined,
    }

    const updatedUser = await $api<AuthUser>(ApiRoutes.USERS.PROVIDER_PROFILE, {
      method: 'PATCH',
      body: payload,
    })

    authStore.updateUser(updatedUser)
    toast.add({ title: t('profile.success'), color: 'success' })
  } catch (error: unknown) {
    const message =
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { _data?: { message?: string } } }).response?._data?.message === 'string'
        ? (error as { response?: { _data?: { message?: string } } }).response?._data?.message
        : t('profile.error')

    toast.add({ title: t('profile.error'), description: message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="mt-8">
    <template #header>
      <h3 class="font-semibold text-gray-900 dark:text-white">Provider Profile</h3>
    </template>

    <div class="rounded-lg bg-white dark:bg-gray-800">
      <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        <UFormField label="Bio" name="bio">
          <UTextarea v-model="state.bio" :rows="4" />
        </UFormField>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <UFormField label="Hourly Rate (CFA)" name="hourlyRate">
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
          <USelect v-model="state.availability" :items="availabilityOptions" />
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
