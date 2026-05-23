<template>
  <q-select v-model="model" :options="options" emit-value map-options>
    <template v-if="!model && placeholder" #selected>
      <div class="muted-1">{{ placeholder }}</div>
    </template>
    <template #option="{ itemProps, opt }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <q-item-label :class="{ 'muted-1': !opt.value }">
            {{ opt.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { computed } from 'vue'

import { useSplit } from '@/composables/useSplit'

const model = defineModel({ type: String })

const { exclude, placeholder } = defineProps({
  exclude: { type: String, default: undefined },
  placeholder: { type: String, default: undefined }
})

const { participants } = useSplit()

const options = computed(() => {
  const result = participants.value.map(({ name, id }) => ({ label: name, value: id }))
  if (exclude) {
    const index = result.findIndex(({ value }) => value === exclude)
    if (index !== -1) result.splice(index, 1)
  }
  if (placeholder) {
    result.unshift({
      label: placeholder,
      value: undefined
    })
  }
  return result
})
</script>
