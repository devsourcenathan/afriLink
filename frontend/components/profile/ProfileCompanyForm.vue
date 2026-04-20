<script setup lang="ts">
import { z } from 'zod'
import { ApiRoutes } from '~/constants/api.routes'
import { useAuthStore } from '~/stores/auth.store'
import type { AuthUser, UpdateCompanyProfilePayload } from '~/types/auth'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const toast = useToast()
const { t } = useI18n()

const loading = ref(false)

const state = reactive({
  companyName: '',
  description: '',
  website: '',
  industry: '',
  size: '',
})

const schema = z.object({
  companyName: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
})

function syncState(user: AuthUser | null) {
  const profile = user?.companyProfile
  state.companyName = profile?.companyName ?? ''
  state.description = profile?.description ?? ''
  state.website = profile?.website ?? ''
  state.industry = profile?.industry ?? ''
  state.size = profile?.size ?? ''
}

watch(() => authStore.currentUser, (user) => {
  syncState(user)
}, { immediate: true })

async function onSubmit() {
  loading.value = true

  try {
    const payload: UpdateCompanyProfilePayload = {
      companyName: state.companyName || undefined,
      description: state.description || undefined,
      website: state.website || undefined,
      industry: state.industry || undefined,
      size: state.size || undefined,
    }

    const updatedUser = await $api<AuthUser>(ApiRoutes.USERS.COMPANY_PROFILE, {
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
      <h3 class="font-semibold text-gray-900 dark:text-white">Company Profile</h3>
    </template>

    <div class="rounded-lg bg-white dark:bg-gray-800">
      <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
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

        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
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
