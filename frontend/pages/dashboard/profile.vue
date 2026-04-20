<script setup lang="ts">
import { z } from 'zod'
import { ApiRoutes } from '~/constants/api.routes'
import { useAuthStore } from '~/stores/auth.store'
import type { AuthUser, UpdateProfilePayload } from '~/types/auth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const toast = useToast()
const { t } = useI18n()

const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const state = reactive<Required<UpdateProfilePayload>>({
  firstName: authStore.currentUser?.firstName ?? '',
  lastName: authStore.currentUser?.lastName ?? '',
  phone: authStore.currentUser?.phone ?? '',
})

const schema = z.object({
  firstName: z.string().min(2, t('profile.first_name')).max(80),
  lastName: z.string().min(2, t('profile.last_name')).max(80),
  phone: z.string().max(20).optional(),
})

function syncLocalState(user: AuthUser | null) {
  state.firstName = user?.firstName ?? ''
  state.lastName = user?.lastName ?? ''
  state.phone = user?.phone ?? ''
}

watch(() => authStore.currentUser, (user) => {
  syncLocalState(user)
}, { immediate: true })

async function onSubmit() {
  loading.value = true

  try {
    const updatedUser = await $api<AuthUser>(ApiRoutes.USERS.ME, {
      method: 'PATCH',
      body: state,
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

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const updatedUser = await $api<AuthUser>(ApiRoutes.USERS.AVATAR, {
      method: 'POST',
      body: formData,
    })

    authStore.updateUser(updatedUser)
    toast.add({ title: t('profile.success'), color: 'success' })
  } catch {
    toast.add({ title: t('profile.error'), color: 'error' })
  } finally {
    target.value = ''
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

    <div class="flex flex-col items-start gap-8 md:flex-row">
      <div class="flex w-full flex-col items-center space-y-4 md:w-1/3">
        <UAvatar :src="authStore.currentUser?.avatarUrl ?? undefined" :alt="authStore.currentUser?.firstName" size="3xl" class="ring-4 ring-primary-500/20" />
        <input ref="fileInput" type="file" class="hidden" accept=".png,.jpg,.jpeg,.webp" @change="onFileSelected" />
        <UButton variant="soft" color="primary" icon="i-heroicons-camera" @click="fileInput?.click()">
          {{ $t('profile.upload_avatar') }}
        </UButton>
        <span class="max-w-xs border-t border-gray-100 pt-3 text-center text-xs text-gray-500">JPG, PNG, WEBP (Max 5MB)</span>
      </div>

      <div class="w-full flex-1 rounded-lg bg-white dark:bg-gray-800">
        <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <UFormField :label="$t('profile.first_name')" name="firstName">
              <UInput v-model="state.firstName" icon="i-heroicons-user" />
            </UFormField>

            <UFormField :label="$t('profile.last_name')" name="lastName">
              <UInput v-model="state.lastName" icon="i-heroicons-user" />
            </UFormField>
          </div>

          <UFormField :label="$t('profile.phone')" name="phone">
            <UInput v-model="state.phone" placeholder="+237600000000" icon="i-heroicons-phone" />
          </UFormField>

          <UFormField label="Email address" name="email">
            <UInput :model-value="authStore.currentUser?.email" disabled icon="i-heroicons-envelope" />
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
