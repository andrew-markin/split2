<template>
  <dialog-frame :title="$t('confirmation.title')">
    <div>{{ message }}</div>
    <template #buttons>
      <q-btn outline color="primary" :label="$t('cancel')" @click="$emit('close')" />
      <q-btn unelevated color="primary" :label="$t('confirm')" @click="$emit('close', true)" />
    </template>
  </dialog-frame>
</template>

<script setup>
import DialogFrame from './DialogFrame.vue'

const { message } = defineProps({
  message: { type: String, default: undefined }
})

defineEmits(['close'])
</script>
