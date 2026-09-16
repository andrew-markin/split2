<template>
  <section>
    <div class="row items-center">
      <span class="text-h5 text-primary q-mr-xs q-my-sm">Settlements</span>
    </div>
    <q-markup-table separator="cell" flat bordered>
      <thead>
        <tr>
          <th class="text-left">Sender</th>
          <th class="text-left">Receiver</th>
          <th class="text-left w-100">Receiver Transfer Preferences</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="settlement in settlementsExtended"
          :key="settlement.id"
          @click="edit(settlement)"
        >
          <td class="text-left">
            <participant-label :id="settlement.sender" />
          </td>
          <td class="text-left">
            <participant-label :id="settlement.receiver" />
          </td>
          <td>
            {{ settlement.preferences }}
          </td>
          <td class="text-right">
            {{ settlement.amount }}
          </td>
        </tr>
        <tr v-if="settlements.length === 0">
          <td colspan="4" class="muted-1 text-center q-td--no-hover">No settlements</td>
        </tr>
      </tbody>
    </q-markup-table>
  </section>
</template>

<script setup>
import { computed } from 'vue'

import { useDialogs } from '@/composables/useDialogs'
import { useSplit } from '@/composables/useSplit'

import ParticipantLabel from './ParticipantLabel.vue'
import SettlementDialog from './SettlementDialog.vue'

const { settlements, participantById } = useSplit()
const { exec } = useDialogs()

const settlementsExtended = computed(() =>
  settlements.value.map((settlement) => ({
    ...settlement,
    preferences: participantById(settlement.receiver).value.preferences
  }))
)

async function edit(settlement = {}) {
  await exec(SettlementDialog, { settlement })
}
</script>
