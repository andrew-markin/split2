<template>
  <span v-if="label">{{ label }}</span>
  <span v-else-if="placeholder" class="text-special">{{ placeholder }}</span>
</template>

<script setup>
import { date } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { value } = defineProps({
  value: { type: String, default: undefined },
  placeholder: { type: String, default: undefined }
})

const label = computed(() => (value ? date.formatDate(value, t('date.format')) : undefined))
</script>
