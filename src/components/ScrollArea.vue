<template>
  <q-scroll-area :thumb-style="thumbStyle">
    <slot></slot>
  </q-scroll-area>
</template>

<script setup>
import { colors } from 'quasar'
import { computed } from 'vue'

const thumbStyle = computed(() => ({
  borderRadius: '0px',
  backgroundColor: colors.getPaletteColor('primary'),
  width: '5px',
  opacity: '0.75'
}))
</script>
