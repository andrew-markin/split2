<template>
  <section>
    <div class="row items-center">
      <span class="text-h5 text-primary q-mr-xs q-my-sm">Settlements</span>
      <q-btn flat round color="primary" icon="mdi-content-copy" @click="copy()" />
    </div>
    <q-markup-table separator="cell" flat bordered>
      <thead>
        <tr>
          <th><q-checkbox v-model="selectAll" size="xs" :disable="settlements.length === 0" /></th>
          <th class="text-left">Sender</th>
          <th class="text-left">Receiver</th>
          <th class="text-left w-100">Receiver Transfer Preferences</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(settlement, index) in settlements" :key="index" @click="edit(settlement)">
          <td><q-checkbox v-model="selection" size="xs" :val="settlement" /></td>
          <td class="text-left">
            <participant-label :id="settlement.sender" />
          </td>
          <td class="text-left">
            <participant-label :id="settlement.receiver" />
          </td>
          <td class="text-left">
            <participant-label :id="settlement.receiver">
              <template #default="{ participant }">
                {{ participant.preferences }}
              </template>
            </participant-label>
          </td>
          <td class="text-right">
            {{ settlement.amount }}
          </td>
        </tr>
        <tr v-if="settlements.length === 0">
          <td colspan="5" class="muted-1 text-center q-td--no-hover">No settlements</td>
        </tr>
      </tbody>
    </q-markup-table>
  </section>
</template>

<script setup>
import copyToClipboard from 'copy-to-clipboard'
import { computed, ref, watch } from 'vue'

import { useDialogs } from '@/composables/useDialogs'
import { useSplit } from '@/composables/useSplit'

import ParticipantLabel from './ParticipantLabel.vue'
import SettlementDialog from './SettlementDialog.vue'

const { settlements, participantById } = useSplit()
const { exec } = useDialogs()

const selection = ref([])

const selectAll = computed({
  get() {
    if (settlements.value.length === 0 || selection.value.length === 0) return false
    if (settlements.value.length === selection.value.length) return true
    return null
  },
  set(value) {
    selection.value = value ? [...settlements.value] : []
  }
})

watch(settlements, () => (selection.value = []))

async function edit(settlement = {}) {
  await exec(SettlementDialog, { settlement })
}

async function copy() {
  const scope = selection.value.length > 0 ? selection.value : settlements.value
  await copyToClipboard(
    scope
      .map((settlement) => {
        const sender = participantById(settlement.sender).value
        const receiver = participantById(settlement.receiver).value
        let sentence = `${sender.name} --> ${receiver.name}: ${settlement.amount}`
        const preferences = receiver.preferences
        if (preferences && preferences.length > 0) sentence += ` (${preferences})`
        return sentence
      })
      .join('\n')
  )
}
</script>
