<template>
  <span v-if="name">{{ name }}</span>
  <span v-else-if="placeholder" class="muted-2">{{ placeholder }}</span>
</template>

<script setup>
import { computed } from 'vue'

import { useSplit } from '@/composables/useSplit'

const { participant } = defineProps({
  participant: { type: String, default: undefined },
  placeholder: { type: String, default: undefined }
})

const { participantById } = useSplit()

const name = computed(() => (participant ? participantById(participant).value?.name : undefined))
</script>
