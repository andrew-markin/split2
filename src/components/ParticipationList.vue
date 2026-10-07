<template>
  <template v-if="participations.length > 0">
    <span
      v-for="(participation, index) in participations"
      :key="index"
      class="label inline-block q-mr-xs"
    >
      <participation-label :name="participation.name" :rate="participation.rate" />
    </span>
  </template>
  <span v-else class="text-special">{{ $t('participation.none') }}</span>
</template>

<script setup>
import { computed } from 'vue'

import { useSplit } from '@/composables/useSplit'

import ParticipationLabel from './ParticipationLabel.vue'

const { participant, category } = defineProps({
  participant: { type: String, default: undefined },
  category: { type: String, default: undefined }
})

const { activeParticipations, categoryById, participantById } = useSplit()

const participations = computed(() => {
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
  return result.sort((left, right) => left.name.localeCompare(right.name))
})
</script>

<style scoped lang="scss">
.label {
  &:not(:last-child)::after {
    content: ', ';
  }
}
</style>
