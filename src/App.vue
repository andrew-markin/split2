<template>
  <scroll-area class="fullscreen bg-grey-2">
    <router-view />
  </scroll-area>
  <dialog-stack />
</template>

<script setup>
import DialogStack from '@/components/DialogStack.vue'
import ScrollArea from '@/components/ScrollArea.vue'
</script>
