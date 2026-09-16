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
  color: color-mix(in srgb, currentColor 60%, transparent);
}
.muted-2 {
  color: color-mix(in srgb, currentColor 25%, transparent);
}
.q-markup-table {
  outline: none !important;
}
.q-markup-table thead th {
  font-size: 13px;
}
</style>
