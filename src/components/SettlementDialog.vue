<template>
  <dialog-frame title="Settlement">
    <q-form id="form" autofocus greedy class="column no-wrap q-gutter-md" @submit="submit()">
      <participant-select :model-value="form.sender" outlined stack-label label="Sender" readonly />
      <participant-select
        :model-value="form.receiver"
        outlined
        stack-label
        label="Receiver"
        readonly
      />
      <q-input
        :model-value="receiver.preferences"
        outlined
        stack-label
        label="Transfer Preferences"
        readonly
      />
      <q-input :model-value="form.amount" outlined stack-label label="Amount" readonly />
      <q-checkbox v-model="completed" label="Settlement completed (funds transferred)" autofocus />
      <date-input
        v-model="form.date"
        outlined
        clearable
        stack-label
        label="Date"
        :disable="!completed"
      />
      <q-input
        v-model.trim="form.comment"
        outlined
        counter
        stack-label
        label="Comment"
        :maxlength="128"
        autogrow
        no-error-icon
        :disable="!completed"
      />
    </q-form>
    <template #buttons>
      <q-btn outline color="primary" label="Cancel" @click="$emit('close')" />
      <q-btn
        unelevated
        type="submit"
        form="form"
        color="primary"
        label="Confirm"
        :disable="!completed"
      />
    </template>
  </dialog-frame>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useForm } from '@/composables/useForm'
import { useSplit } from '@/composables/useSplit'
import { getNonce } from '@/utils.js'

import DateInput from './DateInput.vue'
import DialogFrame from './DialogFrame.vue'
import ParticipantSelect from './ParticipantSelect.vue'

const { settlement } = defineProps({
  settlement: { type: Object, default: () => {} }
})

const emit = defineEmits(['close'])

const { form, changes, changed } = useForm(
  {},
  {
    init(form) {
      const { sender, receiver, amount } = settlement || {}
      Object.assign(form, { sender, receiver, amount, nonce: getNonce() })
    },
    transform(form) {
      if (form.amount !== undefined) form.amount = Number(form.amount).toFixed(2)
    }
  }
)

const { upsert, participantById } = useSplit()

const receiver = computed(() => settlement && participantById(settlement.receiver)?.value)
const completed = ref(false)

async function submit() {
  if (!changed.value) return
  await upsert({ transfers: [changes.value] })
  emit('close')
}
</script>
