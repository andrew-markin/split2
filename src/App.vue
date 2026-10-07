<template>
  <div class="fullscreen loading" :class="{ ready }">
    <router-view />
    <dialog-stack />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import DialogStack from '@/components/DialogStack.vue'
import { useThemes } from '@/composables/useThemes'

const ready = ref(false)

const themes = useThemes()
onMounted(() => {
  themes.init()
  setTimeout(() => (ready.value = true), 100)
})
</script>

<style scoped>
.loading {
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0, 0, 0.2, 1);
}
.loading.ready {
  opacity: 1;
}
</style>
