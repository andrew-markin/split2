<template>
  <span v-if="label">{{ label }}</span>
  <span v-else-if="placeholder" class="muted-2">{{ placeholder }}</span>
</template>

<script setup>
import { date } from 'quasar'
import { computed } from 'vue'

const { value } = defineProps({
  value: { type: String, default: undefined },
  placeholder: { type: String, default: undefined }
})

const label = computed(() => (value ? date.formatDate(value, 'MMM D, YYYY') : undefined))
</script>
