<template>
  <q-card sclass="full-width" style="width: 600px; max-width: 80vw">
    <q-card-section class="q-pb-none">
      <div class="text-h5 text-primary">{{ title }}</div>
    </q-card-section>
    <q-card-section>
      <slot></slot>
      <div v-if="$slots.buttons" class="q-mt-lg">
        <div class="row q-gutter-sm">
          <q-space />
          <slot name="buttons"></slot>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  title: { type: String, default: undefined }
})
</script>
