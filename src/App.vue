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

<style>
.w-100 {
  width: 100%;
}
.muted-1 {
  opacity: 0.6;
}
.muted-2 {
  opacity: 0.25;
}
</style>
