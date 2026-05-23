<template>
  <q-select v-model="model" :options="options" emit-value map-options>
    <template v-if="!model" #selected>
      <div class="muted-1">Common</div>
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

const { categories } = useSplit()

const options = computed(() => [
  {
    label: 'Common',
    value: undefined
  },
  ...categories.value.map(({ name, id }) => ({ label: name, value: id }))
])
</script>
