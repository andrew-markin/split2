<template>
  <q-scroll-area :thumb-style="thumbStyle">
    <slot></slot>
  </q-scroll-area>
</template>

<script setup>
import { computed } from 'vue'

const thumbStyle = computed(() => ({
  borderRadius: '0px',
  backgroundColor: '#808080',
  width: '5px',
  opacity: '0.5'
}))
</script>
