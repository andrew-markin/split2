<template>
  <div class="header column justify-center text-white">
    <block-container class="text-h5 q-px-sm row no-wrap items-center">
      <div class="non-selectable cursor-pointer ellipsis" @click="edit()">
        <span class="text-weight-bold q-mr-sm">Split:</span>
        <span v-if="title">{{ title }}</span>
        <span v-else class="muted-2">Untitled</span>
      </div>
      <div class="relative-position full-height q-mx-md">
        <transition leave-active-class="animated zoomOut">
          <q-badge v-if="modified" color="negative" floating rounded />
        </transition>
      </div>
      <q-space />
      <q-btn unelevated icon="mdi-menu" class="q-pa-sm btn-menu">
        <split-menu />
      </q-btn>
    </block-container>
  </div>
  <scroll-area class="content bg-base" :vertical-offset="[60, 0]">
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
import { useMeta } from 'quasar'
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

useMeta(() => ({
  title: title.value,
  titleTemplate: (title) => `Split: ${title}`
}))

async function edit() {
  await exec(SplitDialog)
}
</script>

<style scoped lang="scss">
@mixin transparent-overlay($result-color, $bg-color, $alpha: 0.75) {
  $source-color: rgb(
    calc((red($result-color) - red($bg-color) * (1 - $alpha)) / $alpha),
    calc((green($result-color) - green($bg-color) * (1 - $alpha)) / $alpha),
    calc((blue($result-color) - blue($bg-color) * (1 - $alpha)) / $alpha)
  );
  background-color: rgba($source-color, $alpha);
}
.header {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  height: 60px;
  backdrop-filter: blur(8px);
  z-index: $z-side;
  @include transparent-overlay($primary, $base-color);
  .body--dark & {
    @include transparent-overlay($primary, $base-dark-color);
  }
}
.btn-menu {
  background-color: color-mix(in srgb, currentColor 10%, transparent);
}
.content {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: $base-color;
  .body--dark & {
    background-color: $base-dark-color;
  }
}
</style>
