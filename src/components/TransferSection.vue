<template>
  <section>
    <div class="row items-center">
      <span class="text-h5 text-primary q-mr-xs q-my-sm">Transfers</span>
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
          <th><q-checkbox v-model="selectAll" :disable="transfers.length === 0" /></th>
          <th class="text-left">Date</th>
          <th class="text-left">Sender</th>
          <th class="text-left">Receiver</th>
          <th class="text-left w-100">Comment</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transfer in transfers" :key="transfer.id" @click="edit(transfer)">
          <td><q-checkbox v-model="selection" :val="transfer.id" /></td>
          <td class="text-left">
            <date-label :value="transfer.date" placeholder="Undefined" />
          </td>
          <td class="text-left">
            <participant-label :id="transfer.sender" />
          </td>
          <td class="text-left">
            <participant-label :id="transfer.receiver" />
          </td>
          <td class="text-left">{{ transfer.comment }}</td>
          <td class="text-right">{{ transfer.amount }}</td>
        </tr>
        <tr v-if="transfers.length === 0">
          <td colspan="6" class="muted-1 text-center q-td--no-hover">No transfers</td>
        </tr>
      </tbody>
    </q-markup-table>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useDialogs } from '@/composables/useDialogs'
import { useSplit } from '@/composables/useSplit'

import ConfirmationDialog from './ConfirmationDialog.vue'
import DateLabel from './DateLabel.vue'
import ParticipantLabel from './ParticipantLabel.vue'
import TransferDialog from './TransferDialog.vue'

const { transfers, upsert } = useSplit()
const { exec } = useDialogs()

const selection = ref([])

const selectAll = computed({
  get() {
    if (transfers.value.length === 0 || selection.value.length === 0) return false
    if (transfers.value.length === selection.value.length) return true
    return null
  },
  set(value) {
    selection.value = value ? transfers.value.map(({ id }) => id) : []
  }
})

async function edit(transfer = {}) {
  await exec(TransferDialog, { transfer })
}

async function remove() {
  if (selection.value.length === 0) return
  const confirmed = await exec(ConfirmationDialog, {
    message: 'Are you sure you want to remove selected transfers?'
  })
  if (!confirmed) return
  await upsert({ transfers: selection.value.map((id) => ({ id, removed: true })) })
  selection.value = []
}
</script>
