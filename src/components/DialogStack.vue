<template>
  <div class="fullscreen no-pointer-events">
    <transition-group
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut faster"
    >
      <dialog-layer v-for="dialog in stack" :key="dialog.id" :dialog="dialog" />
    </transition-group>
  </div>
</template>

<script setup>
import { onUnmounted } from 'vue'

import { useDialogs } from '@/composables/useDialogs'

import DialogLayer from './DialogLayer.vue'

const { stack, cancel } = useDialogs()

function onKeyup(event) {
  if (event.key === 'Escape') cancel()
}

window.addEventListener('keyup', onKeyup)

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})
</script>
