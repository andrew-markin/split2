<template>
  <q-field v-model="modelProxy" tag="div">
    <template #control>
      <div
        class="self-center full-width no-outline text-no-wrap"
        :class="{ 'muted-1': !modelProxy }"
      >
        {{ caption }}
      </div>
    </template>
    <q-popup-proxy ref="date-popup">
      <q-date v-model="modelProxy" minimal mask="YYYY-MM-DD" />
    </q-popup-proxy>
  </q-field>
</template>

<script setup>
import { date } from 'quasar'
import { computed, useTemplateRef, watch } from 'vue'

const model = defineModel({ type: String })

const modelProxy = computed({
  get() {
    return model.value ?? null
  },
  set(value) {
    model.value = value ?? undefined
  }
})

const caption = computed(() =>
  model.value ? date.formatDate(model.value, 'MMM D, YYYY') : 'Undefined'
)

const datePopup = useTemplateRef('date-popup')
watch(model, () => datePopup.value.hide())
</script>
