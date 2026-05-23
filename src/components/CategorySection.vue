<template>
  <section>
    <div class="row items-center q-mb-xs">
      <span class="text-h5 text-primary q-mr-xs">Categories</span>
      <q-btn flat round color="primary" icon="mdi-plus" @click="edit()" />
      <q-btn
        v-if="selection.length > 0"
        flat
        round
        color="negative"
        icon="mdi-trash-can-outline"
        @click="remove()"
      />
    </div>
    <q-markup-table separator="cell" flat bordered>
      <thead>
        <tr>
          <th><q-checkbox v-model="selectAll" :disable="categories.length === 0" /></th>
          <th class="text-left">Name</th>
          <th class="text-left w-100">Participants</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id" @click="edit(category)">
          <td><q-checkbox v-model="selection" :val="category.id" /></td>
          <td class="text-left">{{ category.name }}</td>
          <td class="text-left"><participation-list :category="category.id" /></td>
        </tr>
        <tr v-if="categories.length === 0">
          <td colspan="3" class="muted-1 text-center q-td--no-hover">No categories</td>
        </tr>
      </tbody>
    </q-markup-table>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useDialogs } from '@/composables/useDialogs'
import { useSplit } from '@/composables/useSplit'

import CategoryDialog from './CategoryDialog.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import ParticipationList from './ParticipationList.vue'

const { categories, upsert } = useSplit()

const { exec } = useDialogs()

const selection = ref([])

const selectAll = computed({
  get() {
    if (categories.value.length === 0 || selection.value.length === 0) return false
    if (categories.value.length === selection.value.length) return true
    return null
  },
  set(value) {
    selection.value = value ? categories.value.map(({ id }) => id) : []
  }
})

async function edit(category = {}) {
  await exec(CategoryDialog, { category })
}

async function remove() {
  if (selection.value.length === 0) return
  const confirmed = await exec(ConfirmationDialog, {
    message: 'Are you sure you want to remove selected categories?'
  })
  if (!confirmed) return
  await upsert({ categories: selection.value.map((id) => ({ id, removed: true })) })
  selection.value = []
}
</script>
