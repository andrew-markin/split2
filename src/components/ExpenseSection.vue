<template>
  <section>
    <div class="row items-center q-mb-xs">
      <span class="text-h5 text-primary q-mr-xs">Expenses</span>
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
          <th><q-checkbox v-model="selectAll" :disable="expenses.length === 0" /></th>
          <th class="text-left">Date</th>
          <th class="text-left w-100">Description</th>
          <th class="text-left">Category</th>
          <th class="text-left">Payer</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in expenses" :key="expense.id" @click="edit(expense)">
          <td><q-checkbox v-model="selection" :val="expense.id" /></td>
          <td class="text-left">
            <date-label :value="expense.date" placeholder="Undefined" />
          </td>
          <td class="text-left">{{ expense.description }}</td>
          <td class="text-left">
            <category-name :category="expense.category" placeholder="Common" />
          </td>
          <td class="text-left">
            <participant-name :participant="expense.payer" placeholder="Undefined" />
          </td>
          <td class="text-right">{{ expense.amount }}</td>
        </tr>
        <tr v-if="expenses.length === 0">
          <td colspan="6" class="muted-1 text-center q-td--no-hover">No expenses</td>
        </tr>
      </tbody>
    </q-markup-table>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useDialogs } from '@/composables/useDialogs'
import { useSplit } from '@/composables/useSplit'

import CategoryName from './CategoryName.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import DateLabel from './DateLabel.vue'
import ExpenseDialog from './ExpenseDialog.vue'
import ParticipantName from './ParticipantName.vue'

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
    message: 'Are you sure you want to remove selected expenses?'
  })
  if (!confirmed) return
  await upsert({ expenses: selection.value.map((id) => ({ id, removed: true })) })
  selection.value = []
}
</script>
