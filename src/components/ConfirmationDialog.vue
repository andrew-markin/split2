<template>
  <dialog-frame title="Confirmation required">
    <div>{{ message }}</div>
    <template #buttons>
      <q-btn outline color="primary" label="Cancel" @click="$emit('close')" />
      <q-btn unelevated color="primary" label="Confirm" @click="$emit('close', true)" />
    </template>
  </dialog-frame>
</template>

<script setup>
import DialogFrame from './DialogFrame.vue'

const { message } = defineProps({ message: { type: String, default: undefined } })

defineEmits(['close'])
</script>
