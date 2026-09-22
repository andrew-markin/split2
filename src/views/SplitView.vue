<template>
  <div class="header column justify-center">
    <block-container class="text-h5 text-primary q-px-sm row no-wrap items-center">
      <div class="non-selectable cursor-pointer ellipsis" @click="edit()">
        <span class="text-weight-bold q-mr-xs">Split:</span>
        <span v-if="title">{{ title }}</span>
        <span v-else class="muted-1">Untitled</span>
      </div>
      <div class="relative-position full-height q-mx-md">
        <transition leave-active-class="animated zoomOut">
          <q-badge v-if="modified" color="negative" floating rounded />
        </transition>
      </div>
      <q-space />
      <q-btn unelevated color="grey-2" text-color="primary" icon="mdi-menu" class="q-pa-sm">
        <split-menu />
      </q-btn>
    </block-container>
  </div>
  <scroll-area class="content bg-grey-2" :vertical-offset="[60, 0]">
    <block-container class="q-pa-sm" style="margin-top: 60px">
      <div class="column q-gutter-sm q-mb-lg">
        <category-section />
        <participant-section />
        <expense-section />
        <transfer-section />
        <settlement-section />
      </div>
    </block-container>
  </scroll-area>
</template>

<script setup>
import { watch } from 'vue'

import BlockContainer from '@/components/BlockContainer.vue'
import CategorySection from '@/components/CategorySection.vue'
import ExpenseSection from '@/components/ExpenseSection.vue'
import ParticipantSection from '@/components/ParticipantSection.vue'
import ScrollArea from '@/components/ScrollArea.vue'
import SettlementSection from '@/components/SettlementSection.vue'
import SplitDialog from '@/components/SplitDialog.vue'
import SplitMenu from '@/components/SplitMenu.vue'
import TransferSection from '@/components/TransferSection.vue'
import { useDialogs } from '@/composables/useDialogs'
import { useSplit } from '@/composables/useSplit'

const { secret } = defineProps({
  secret: { type: String, required: true }
})

const { connect, title, modified } = useSplit()
const { exec } = useDialogs()

watch(
  () => secret,
  (value) => connect(value),
  { immediate: true }
)

async function edit() {
  await exec(SplitDialog)
}
</script>

<style scoped lang="scss">
.header {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  height: 60px;
  padding-bottom: 1;
  border-bottom: 1px solid $separator-color;
  backdrop-filter: blur(8px);
  background-color: oklab(1 0 5.96046e-8 / 0.75);
  z-index: 2;
}
.content {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
}
</style>
