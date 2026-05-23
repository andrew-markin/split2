<template>
  <div v-if="options.length > 0" class="column q-gutter-y-sm">
    <div class="text-h6 text-primary">{{ title }}</div>
    <div v-for="option in options" :key="option.id" class="row q-col-gutter-x-sm items-center">
      <q-checkbox v-model="option.active" :label="option.label" class="col-5" />
      <q-slider
        v-model="option.rate"
        :min="0"
        :max="200"
        :step="5"
        :disable="!option.active"
        class="col"
      />
      <div class="col-1 text-body1 text-right q-mx-md" :class="{ 'muted-2': !option.active }">
        {{ option.rate }}%
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRaw, watch } from 'vue'

import { useSplit } from '@/composables/useSplit'
import { getComposedId } from '@/utils'

const { participants, categories, participations } = useSplit()

const { participant, category } = defineProps({
  participant: { type: String, default: undefined },
  category: { type: String, default: undefined }
})

const emit = defineEmits(['changes'])

const options = ref([])

const participantsSnapshot = toRaw(participants.value)
const categoriesSnapshot = toRaw(categories.value)
const participationsSnapshot = toRaw(participations.value)
const participationsMap = new Map(participationsSnapshot.map((item) => [item.id, item]))

const title = computed(() => {
  if (participant) return 'Categories'
  if (category) return 'Participants'
  return undefined
})

watch(
  () => participant || category,
  async () => {
    if (participant) {
      const participantId = toRaw(participant)
      options.value = await Promise.all(
        categoriesSnapshot.map(async (category) => {
          const id = await getComposedId(participantId, category.id)
          const base = participationsMap.get(id)
          return {
            id,
            base,
            participant: participantId,
            category: category.id,
            label: category.name,
            active: base?.active ?? false,
            rate: base?.rate === undefined ? 100 : base.rate
          }
        })
      )
    } else if (category) {
      const categoryId = toRaw(category)
      options.value = await Promise.all(
        participantsSnapshot.map(async (participant) => {
          const id = await getComposedId(participant.id, categoryId)
          const base = participationsMap.get(id)
          return {
            id,
            base,
            participant: participant.id,
            category: categoryId,
            label: participant.name,
            active: base?.active || false,
            rate: base?.rate === undefined ? 100 : base.rate
          }
        })
      )
    } else {
      options.value = []
    }
  },
  { immediate: true }
)

const changes = computed(() => {
  const result = []
  for (const { id, base, participant, category, active, rate } of options.value) {
    if (base) {
      const change = {}
      if (active !== base.active) change.active = active
      if (rate !== base.rate) change.rate = rate
      if (Object.keys(change).length > 0) result.push({ id, ...change })
    } else if (active || rate !== 100) {
      result.push({ id, participant, category, active, rate })
    }
  }
  return result
})

watch(changes, () => emit('changes', changes.value))
</script>
