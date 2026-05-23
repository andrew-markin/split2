<template>
  <dialog-frame :title="expense?.id ? 'Expense' : 'New Expense'">
    <q-form id="form" autofocus greedy class="column no-wrap q-gutter-md" @submit="submit()">
      <date-input v-model="form.date" outlined clearable stack-label label="Date" />
      <q-input
        v-model.trim="form.description"
        outlined
        counter
        stack-label
        label="Description"
        :maxlength="128"
        lazy-rules="ondemand"
        :rules="descriptionRules"
        no-error-icon
      />
      <category-select v-model="form.category" outlined stack-label label="Category" />
      <participant-select
        v-model="form.payer"
        outlined
        stack-label
        label="Payer"
        lazy-rules="ondemand"
        :rules="payerRules"
        no-error-icon
      />
      <q-input
        v-model.trim="form.amount"
        outlined
        stack-label
        label="Amount"
        lazy-rules="ondemand"
        :rules="amountRules"
        no-error-icon
      />
    </q-form>
    <template #buttons>
      <q-btn outline color="primary" label="Cancel" @click="$emit('close')" />
      <q-btn
        unelevated
        type="submit"
        form="form"
        color="primary"
        label="Save"
        :disable="!changed"
      />
    </template>
  </dialog-frame>
</template>

<script setup>
import { z } from 'zod'

import { useForm } from '@/composables/useForm'
import { useSplit } from '@/composables/useSplit'
import { useValidator } from '@/composables/useValidator'

import CategorySelect from './CategorySelect.vue'
import DateInput from './DateInput.vue'
import DialogFrame from './DialogFrame.vue'
import ParticipantSelect from './ParticipantSelect.vue'

const { expense } = defineProps({ expense: { type: Object, default: () => {} } })
const emit = defineEmits(['close'])

const { form, changes, changed } = useForm({ ...expense }, (form) => {
  if (form.amount !== undefined) form.amount = Number(form.amount).toFixed(2)
})

const descriptionSchema = z
  .string('Description is required')
  .min(1, 'Description is required')
  .regex(/^[\p{L}\p{P}\d\s]+$/u, 'Only letters, punctuation, hyphens, brackets and spaces allowed')

const descriptionRules = [useValidator(descriptionSchema)]

const payerRules = [(value) => !!value || 'Payer is required']

const amountSchema = z
  .string('Amount is required')
  .min(1, 'Amount is required')
  .regex(/^\d+(\.\d{1,2})?$/, {
    message: 'Amount must be a positive number with up to 2 decimal places'
  })
  .transform((value) => Number(value))
  .refine((value) => value > 0, 'Amount must be greater than 0')

const amountRules = [useValidator(amountSchema)]

const { upsert } = useSplit()

async function submit() {
  if (!changed.value) return
  await upsert({ expenses: [changes.value] })
  emit('close')
}
</script>
