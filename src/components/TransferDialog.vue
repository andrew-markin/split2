<template>
  <dialog-frame :title="transfer?.id ? 'Transfer' : 'New Transfer'">
    <q-form id="form" autofocus greedy class="column no-wrap q-gutter-md" @submit="submit()">
      <date-input v-model="form.date" outlined clearable stack-label label="Date" />
      <participant-select
        v-model="form.sender"
        outlined
        stack-label
        label="Sender"
        :rules="senderRules"
        lazy-rules="ondemand"
        no-error-icon
      />
      <participant-select
        v-model="form.receiver"
        outlined
        stack-label
        label="Receiver"
        :rules="receiverRules"
        lazy-rules="ondemand"
        no-error-icon
      />
      <q-input
        v-model.trim="form.comment"
        outlined
        counter
        stack-label
        label="Comment"
        :maxlength="128"
        no-error-icon
      />
      <q-input
        v-model.trim="form.amount"
        outlined
        stack-label
        label="Amount"
        :rules="amountRules"
        lazy-rules="ondemand"
        no-error-icon
      />
    </q-form>
    <template #buttons>
      <q-btn outline color="primary" label="Cancel" @click="$emit('close')" />
      <q-btn
        unelevated
        type="submit"
        form="form"
        color="primary"
        label="Save"
        :disable="!changed"
      />
    </template>
  </dialog-frame>
</template>

<script setup>
import { useForm } from '@/composables/useForm'
import { useSplit } from '@/composables/useSplit'
import { useValidator } from '@/composables/useValidator'
import { amountSchema } from '@/schemas.js'
import { getNonce } from '@/utils.js'

import DateInput from './DateInput.vue'
import DialogFrame from './DialogFrame.vue'
import ParticipantSelect from './ParticipantSelect.vue'

const { transfer } = defineProps({
  transfer: { type: Object, default: () => {} }
})

const emit = defineEmits(['close'])

const { form, changes, changed } = useForm(
  { ...transfer },
  {
    transform(form) {
      if (form.amount !== undefined) form.amount = Number(form.amount).toFixed(2)
    }
  }
)

const senderRules = [
  (value) => !!value || 'Sender is required',
  (value) => value !== form.receiver || 'Sender and Receiver cannot be the same'
]

const receiverRules = [
  (value) => !!value || 'Receiver is required',
  (value) => value !== form.sender || 'Receiver and Sender cannot be the same'
]

const amountRules = [useValidator(amountSchema)]

const { upsert } = useSplit()

async function submit() {
  if (!changed.value) return
  if (!form.nonce) form.nonce = getNonce()
  await upsert({ transfers: [changes.value] })
  emit('close')
}
</script>
