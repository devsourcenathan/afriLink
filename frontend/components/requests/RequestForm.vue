<script setup lang="ts">
import { z } from 'zod'
import type { CreateRequestPayload } from '~/types/requests'
import type { RequestStatus, RequestUrgency } from '~/types/requests-enums'
import type { ServiceCategory } from '~/types/services-enums'

const props = defineProps<{
  initialValue?: Partial<CreateRequestPayload>
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [payload: CreateRequestPayload]
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

const urgencyItems: { label: string; value: RequestUrgency }[] = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' },
]

const statusItems: { label: string; value: RequestStatus }[] = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Closed', value: 'CLOSED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const schema = z.object({
  title: z.string().min(5).max(140),
  description: z.string().min(20).max(5000),
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
  budgetMin: z.number().min(0).nullable(),
  budgetMax: z.number().min(0).nullable(),
  location: z.string().max(120).optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  deadlineAt: z.string().optional(),
  status: z.enum(['DRAFT', 'OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED']),
  tags: z.string(),
})

const state = reactive({
  title: props.initialValue?.title ?? '',
  description: props.initialValue?.description ?? '',
  category: props.initialValue?.category ?? 'IT_DEVELOPMENT',
  budgetMin: props.initialValue?.budgetMin ?? null,
  budgetMax: props.initialValue?.budgetMax ?? null,
  location: props.initialValue?.location ?? '',
  urgency: props.initialValue?.urgency ?? 'MEDIUM',
  deadlineAt: props.initialValue?.deadlineAt ?? '',
  status: props.initialValue?.status ?? 'DRAFT',
  tags: props.initialValue?.tags?.join(', ') ?? '',
})

function onSubmit() {
  emit('submit', {
    title: state.title,
    description: state.description,
    category: state.category as ServiceCategory,
    budgetMin: state.budgetMin ?? undefined,
    budgetMax: state.budgetMax ?? undefined,
    location: state.location || undefined,
    urgency: state.urgency as RequestUrgency,
    deadlineAt: state.deadlineAt || undefined,
    status: state.status as RequestStatus,
    tags: state.tags ? state.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
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
      <UFormField label="Categorie" name="category">
        <USelect v-model="state.category" :items="categoryItems" />
      </UFormField>

      <UFormField label="Urgence" name="urgency">
        <USelect v-model="state.urgency" :items="urgencyItems" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <UFormField label="Budget min (CFA)" name="budgetMin">
        <UInput v-model.number="state.budgetMin" type="number" />
      </UFormField>

      <UFormField label="Budget max (CFA)" name="budgetMax">
        <UInput v-model.number="state.budgetMax" type="number" />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <UFormField label="Localisation" name="location">
        <UInput v-model="state.location" />
      </UFormField>

      <UFormField label="Date limite" name="deadlineAt">
        <UInput v-model="state.deadlineAt" type="date" />
      </UFormField>
    </div>

    <UFormField label="Statut" name="status">
      <USelect v-model="state.status" :items="statusItems" />
    </UFormField>

    <UFormField label="Tags" name="tags">
      <UInput v-model="state.tags" placeholder="e.g. urgent, website, multilingual" />
    </UFormField>

    <UButton type="submit" color="primary" :loading="loading">
      {{ submitLabel ?? 'Enregistrer' }}
    </UButton>
  </UForm>
</template>
