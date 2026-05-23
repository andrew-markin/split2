<template>
  <span v-if="labels.length > 0">{{ labels.join(', ') }}</span>
  <span v-else class="muted-2">None</span>
</template>

<script setup>
import { computed } from 'vue'

import { useSplit } from '@/composables/useSplit'

const { participant, category } = defineProps({
  participant: { type: String, default: undefined },
  category: { type: String, default: undefined }
})

const { activeParticipations, categoryById, participantById } = useSplit()

const labels = computed(() => {
  let result
  if (participant) {
    result = activeParticipations.value
      .filter((participation) => participation.participant === participant)
      .map(({ category, rate }) => ({ name: categoryById(category).value?.name, rate }))
      .filter(({ name }) => !!name)
  } else if (category) {
    result = activeParticipations.value
      .filter((participation) => participation.category === category)
      .map(({ participant, rate }) => ({ name: participantById(participant).value?.name, rate }))
      .filter(({ name }) => !!name)
  } else return []
  return result.map(({ name, rate }) => (rate === 100 ? name : `${name} (${rate}%)`)).sort()
})
</script>
