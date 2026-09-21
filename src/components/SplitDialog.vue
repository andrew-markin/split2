<template>
  <dialog-frame title="Split">
    <q-form id="form" greedy class="column no-wrap q-gutter-md" @submit="submit()">
      <q-input
        v-model.trim="form.title"
        outlined
        counter
        stack-label
        label="Title"
        placeholder="Untitled"
        :maxlength="164"
        lazy-rules="ondemand"
        :rules="titleRules"
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
import { computed, reactive } from 'vue'
import { z } from 'zod'

import { useSplit } from '@/composables/useSplit'
import { useValidator } from '@/composables/useValidator'

import DialogFrame from './DialogFrame.vue'

const emit = defineEmits(['close'])

const { title } = useSplit()

const form = reactive({
  title: title.value
})

const changed = computed(() => form.title !== title.value)

const titleSchema = z
  .string()
  .regex(/^[\p{L}\p{P}\d\s]*$/u, 'Only letters, punctuation, hyphens, brackets and spaces allowed')

const titleRules = [useValidator(titleSchema)]

async function submit() {
  if (!changed.value) return
  title.value = form.title
  emit('close')
}
</script>
