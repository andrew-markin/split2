<template>
  <div class="fixed-full backdrop" @mousedown.left="dialog.close()">
    <scroll-area class="fixed-full">
      <div class="flex justify-center q-pa-md">
        <transition enter-active-class="animated slideInDown faster">
          <component
            :is="dialog.component"
            v-if="ready"
            v-bind="dialog.props"
            @close="(result) => dialog.close(result)"
            @mousedown.left.stop
          />
        </transition>
      </div>
    </scroll-area>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import ScrollArea from './ScrollArea.vue'

defineProps({
  dialog: { type: Object, default: undefined }
})

const ready = ref(false)
setTimeout(() => (ready.value = true), 0)
</script>

<style scoped>
.backdrop {
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: all;
  z-index: -1;
}
</style>
