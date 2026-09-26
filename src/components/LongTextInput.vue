<template>
  <q-input v-bind="$attrs" autogrow @keydown.enter.exact.prevent="requestSubmit" />
</template>

<script setup>
function requestSubmit(event) {
  event.target?.closest('form')?.requestSubmit()
}
</script>
