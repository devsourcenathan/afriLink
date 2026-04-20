<script setup lang="ts">
import { z } from 'zod'
import type { CreateServicePayload } from '~/types/services'
import type { ServiceCategory, ServiceStatus } from '~/types/services-enums'

const props = defineProps<{
  initialValue?: Partial<CreateServicePayload>
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [payload: CreateServicePayload]
}>()

const categoryItems: { label: string; value: ServiceCategory }[] = [
  { label: 'IT Development', value: 'IT_DEVELOPMENT' },
  { label: 'Design Graphique', value: 'DESIGN_GRAPHIQUE' },
  { label: 'Marketing Digital', value: 'MARKETING_DIGITAL' },
  { label: 'Comptabilite Finance', value: 'COMPTABILITE_FINANCE' },
  { label: 'Juridique', value: 'JURIDIQUE' },
  { label: 'Conseil Strategie', value: 'CONSEIL_STRATEGIE' },
  { label: 'Batiment Travaux', value: 'BATIMENT_TRAVAUX' },
  { label: 'Transport Logistique', value: 'TRANSPORT_LOGISTIQUE' },
  { label: 'Sante Bien Etre', value: 'SANTE_BIEN_ETRE' },
  { label: 'Education Formation', value: 'EDUCATION_FORMATION' },
  { label: 'Autre', value: 'AUTRE' },
]

const statusItems: { label: string; value: ServiceStatus }[] = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

const schema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(5000),
  price: z.number().min(0),
  deliveryTimeInDays: z.number().int().min(1).max(365).nullable(),
  category: z.enum([
    'IT_DEVELOPMENT',
    'DESIGN_GRAPHIQUE',
    'MARKETING_DIGITAL',
    'COMPTABILITE_FINANCE',
    'JURIDIQUE',
    'CONSEIL_STRATEGIE',
    'BATIMENT_TRAVAUX',
    'TRANSPORT_LOGISTIQUE',
    'SANTE_BIEN_ETRE',
    'EDUCATION_FORMATION',
    'AUTRE',
  ]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  tags: z.string(),
})

const state = reactive({
  title: props.initialValue?.title ?? '',
  description: props.initialValue?.description ?? '',
  price: props.initialValue?.price ?? 0,
  deliveryTimeInDays: props.initialValue?.deliveryTimeInDays ?? null,
  category: props.initialValue?.category ?? 'IT_DEVELOPMENT',
  status: props.initialValue?.status ?? 'DRAFT',
  tags: props.initialValue?.tags?.join(', ') ?? '',
})

function onSubmit() {
  emit('submit', {
    title: state.title,
    description: state.description,
    price: state.price,
    deliveryTimeInDays: state.deliveryTimeInDays ?? undefined,
    category: state.category as ServiceCategory,
    status: state.status as ServiceStatus,
    tags: state.tags
      ? state.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [],
  })
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
    <UFormField label="Titre" name="title">
      <UInput v-model="state.title" />
    </UFormField>

    <UFormField label="Description" name="description">
      <UTextarea v-model="state.description" :rows="6" />
    </UFormField>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <UFormField label="Prix (CFA)" name="price">
        <UInput v-model.number="state.price" type="number" />
      </UFormField>

      <UFormField label="Delai (jours)" name="deliveryTimeInDays">
        <UInput v-model.number="state.deliveryTimeInDays" type="number" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <UFormField label="Categorie" name="category">
        <USelect v-model="state.category" :items="categoryItems" />
      </UFormField>

      <UFormField label="Statut" name="status">
        <USelect v-model="state.status" :items="statusItems" />
      </UFormField>
    </div>

    <UFormField label="Tags" name="tags">
      <UInput v-model="state.tags" placeholder="e.g. ecommerce, landing page, seo" />
    </UFormField>

    <UButton type="submit" color="primary" :loading="loading">
      {{ submitLabel ?? 'Enregistrer' }}
    </UButton>
  </UForm>
</template>
