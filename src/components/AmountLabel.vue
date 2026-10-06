<template>
  <span class="text-amount">
    <slot>{{ value }}</slot>
  </span>
</template>

<script setup>
defineProps({
  value: { type: String, default: undefined }
})
</script>
