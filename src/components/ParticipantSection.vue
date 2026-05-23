<template>
  <section>
    <div class="row items-center q-mb-xs">
      <span class="text-h5 text-primary q-mr-xs">Participants</span>
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
          <th><q-checkbox v-model="selectAll" :disable="participants.length === 0" /></th>
          <th class="text-left">Name</th>
          <th class="text-left">Who pays</th>
          <th class="text-left w-100">Categories</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="participant in participants" :key="participant.id" @click="edit(participant)">
          <td><q-checkbox v-model="selection" :val="participant.id" /></td>
          <td class="text-left">{{ participant.name }}</td>
          <td class="text-left">
            <participant-name :participant="participant.patron" placeholder="Themselves" />
          </td>
          <td class="text-left">
            <participation-list :participant="participant.id" />
          </td>
        </tr>
        <tr v-if="participants.length === 0">
          <td colspan="4" class="muted-1 text-center q-td--no-hover">No participants</td>
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
import ParticipantDialog from './ParticipantDialog.vue'
import ParticipantName from './ParticipantName.vue'
import ParticipationList from './ParticipationList.vue'

const { participants, upsert } = useSplit()

const { exec } = useDialogs()

const selection = ref([])

const selectAll = computed({
  get() {
    if (participants.value.length === 0 || selection.value.length === 0) return false
    if (participants.value.length === selection.value.length) return true
    return null
  },
  set(value) {
    selection.value = value ? participants.value.map(({ id }) => id) : []
  }
})

async function edit(participant = {}) {
  await exec(ParticipantDialog, { participant })
}

async function remove() {
  if (selection.value.length === 0) return
  const confirmed = await exec(ConfirmationDialog, {
    message: 'Are you sure you want to remove selected participants?'
  })
  if (!confirmed) return
  await upsert({ participants: selection.value.map((id) => ({ id, removed: true })) })
  selection.value = []
}
</script>
