<template>
  <router-view />
  <dialog-stack />
</template>

<script setup>
import { onMounted } from 'vue'

import DialogStack from '@/components/DialogStack.vue'
import { useThemes } from '@/composables/useThemes'

const themes = useThemes()
onMounted(() => themes.init())
</script>
