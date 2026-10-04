<template>
  <section>
    <div class="row items-center muted-1">
      <span class="text-h6 q-mr-xs q-my-sm">{{ $t('category.plural') }}</span>
      <q-btn flat round icon="mdi-plus" @click="edit()" />
      <q-btn
        v-if="selection.length > 0"
        flat
        round
        color="negative"
        icon="mdi-trash-can-outline"
        @click="remove()"
      />
    </div>
    <q-markup-table separator="cell" flat bordered class="muted-1">
      <thead>
        <tr>
          <th><q-checkbox v-model="selectAll" size="xs" :disable="categories.length === 0" /></th>
          <th class="w-15ch text-left">{{ $t('category.name') }}</th>
          <th class="w-full text-left">{{ $t('participant.plural') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="category in categories"
          :key="category.id"
          class="non-selectable cursor-pointer"
          @click="edit(category)"
        >
          <td><q-checkbox v-model="selection" size="xs" :val="category.id" /></td>
          <td class="text-left">{{ category.name }}</td>
          <td class="text-left text-wrap"><participation-list :category="category.id" /></td>
        </tr>
        <tr v-if="categories.length === 0">
          <td colspan="3" class="muted-2 text-center q-td--no-hover">{{ $t('category.none') }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDialogs } from '@/composables/useDialogs'
import { useSplit } from '@/composables/useSplit'

import CategoryDialog from './CategoryDialog.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import ParticipationList from './ParticipationList.vue'

const { t } = useI18n()

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
    message: t('category.removal.confirmation', selection.value.length)
  })
  if (!confirmed) return
  await upsert({ categories: selection.value.map((id) => ({ id, removed: true })) })
  selection.value = []
}
</script>
