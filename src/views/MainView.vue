<template>
  <block-container class="q-pa-sm">
    <div class="column q-gutter-md">
      <category-section />
      <participant-section />
      <expense-section />
    </div>
  </block-container>
</template>

<script setup>
import { watch } from 'vue'

import BlockContainer from '@/components/BlockContainer.vue'
import CategorySection from '@/components/CategorySection.vue'
import ExpenseSection from '@/components/ExpenseSection.vue'
import ParticipantSection from '@/components/ParticipantSection.vue'
import { useSplit } from '@/composables/useSplit'

const { secret } = defineProps({
  secret: { type: String, required: true }
})

const { connect } = useSplit()

watch(
  () => secret,
  (value) => connect(value),
  { immediate: true }
)
</script>
