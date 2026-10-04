<template>
  <section>
    <div class="row items-center muted-1">
      <span class="text-h6 q-mr-xs q-my-sm">{{ $t('expense.plural') }}</span>
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
          <th><q-checkbox v-model="selectAll" size="xs" :disable="expenses.length === 0" /></th>
          <th class="w-15ch text-left">{{ $t('date') }}</th>
          <th class="w-full text-left">{{ $t('expense.description') }}</th>
          <th class="w-15ch text-left">{{ $t('category') }}</th>
          <th class="w-15ch text-left">{{ $t('expense.payer') }}</th>
          <th class="w-10ch text-right">{{ $t('amount') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="expense in expenses"
          :key="expense.id"
          class="non-selectable cursor-pointer"
          @click="edit(expense)"
        >
          <td><q-checkbox v-model="selection" size="xs" :val="expense.id" /></td>
          <td class="text-left">
            <date-label :value="expense.date" :placeholder="$t('date.undefined')" />
          </td>
          <td class="text-left text-wrap">{{ expense.description }}</td>
          <td class="text-left">
            <category-label :id="expense.category" :placeholder="$t('category.common')" />
          </td>
          <td class="text-left">
            <participant-label :id="expense.payer" />
          </td>
          <td class="text-right">{{ expense.amount }}</td>
        </tr>
        <tr v-if="expenses.length === 0">
          <td colspan="6" class="muted-2 text-center q-td--no-hover">{{ $t('expense.none') }}</td>
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

import CategoryLabel from './CategoryLabel.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import DateLabel from './DateLabel.vue'
import ExpenseDialog from './ExpenseDialog.vue'
import ParticipantLabel from './ParticipantLabel.vue'

const { t } = useI18n()

const { expenses, upsert } = useSplit()
const { exec } = useDialogs()

const selection = ref([])

const selectAll = computed({
  get() {
    if (expenses.value.length === 0 || selection.value.length === 0) return false
    if (expenses.value.length === selection.value.length) return true
    return null
  },
  set(value) {
    selection.value = value ? expenses.value.map(({ id }) => id) : []
  }
})

async function edit(expense = {}) {
  await exec(ExpenseDialog, { expense })
}

async function remove() {
  if (selection.value.length === 0) return
  const confirmed = await exec(ConfirmationDialog, {
    message: t('expense.removal.confirmation', selection.value.length)
  })
  if (!confirmed) return
  await upsert({ expenses: selection.value.map((id) => ({ id, removed: true })) })
  selection.value = []
}
</script>
