<template>
  <dialog-frame :title="participant?.id ? 'Participant' : 'New Participant'">
    <q-form id="form" autofocus greedy class="column no-wrap q-gutter-md" @submit="submit()">
      <q-input
        v-model.trim="form.name"
        outlined
        counter
        stack-label
        label="Name"
        :maxlength="16"
        lazy-rules="ondemand"
        :rules="nameRules"
        no-error-icon
      />
      <participant-select
        v-model="form.patron"
        outlined
        stack-label
        label="Who pays"
        :exclude="form.id"
        placeholder="Themselves"
      />
      <q-input
        v-model.trim="form.comment"
        outlined
        counter
        stack-label
        label="Payment Comment"
        :maxlength="64"
      />
    </q-form>
    <participation-select
      :participant="form.id"
      @changes="(value) => (participationChanges = value)"
    />
    <template #buttons>
      <q-btn outline color="primary" label="Cancel" @click="$emit('close')" />
      <q-btn
        unelevated
        type="submit"
        form="form"
        color="primary"
        label="Save"
        :disable="!changesAvailable"
      />
    </template>
  </dialog-frame>
</template>

<script setup>
import { computed, ref } from 'vue'
import { z } from 'zod'

import { useForm } from '@/composables/useForm'
import { useSplit } from '@/composables/useSplit'
import { useValidator } from '@/composables/useValidator'

import DialogFrame from './DialogFrame.vue'
import ParticipantSelect from './ParticipantSelect.vue'
import ParticipationSelect from './ParticipationSelect.vue'

const { participant } = defineProps({ participant: { type: Object, default: () => {} } })
const emit = defineEmits(['close'])

const { form, changes, changed } = useForm({ ...participant })

const participationChanges = ref([])

const changesAvailable = computed(() => changed.value || participationChanges.value.length > 0)
const combinedChanges = computed(() => {
  const result = {}
  if (changed.value) result.participants = [changes.value]
  if (participationChanges.value.length > 0) result.participations = participationChanges.value
  return result
})

const nameSchema = z
  .string('Name is required')
  .min(1, 'Name is required')
  .regex(/^[\p{L}\p{P}\d\s]+$/u, 'Only letters, punctuation, hyphens, brackets and spaces allowed')

const nameRules = [useValidator(nameSchema)]

const { upsert } = useSplit()

async function submit() {
  if (!changesAvailable.value) return
  await upsert(combinedChanges.value)
  emit('close')
}
</script>
