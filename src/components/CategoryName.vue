<template>
  <span v-if="name">{{ name }}</span>
  <span v-else-if="placeholder" class="muted-2">{{ placeholder }}</span>
</template>

<script setup>
import { computed } from 'vue'

import { useSplit } from '@/composables/useSplit'

const { category } = defineProps({
  category: { type: String, default: undefined },
  placeholder: { type: String, default: undefined }
})

const { categoryById } = useSplit()

const name = computed(() => (category ? categoryById(category).value?.name : undefined))
</script>
