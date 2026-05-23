import { computed } from 'vue'

import { useDataset } from '@/composables/useDataset'

let context

function useContext() {
  const { constrain, connect, modified, select, upsert } = useDataset()

  constrain({
    participations: {
      category: { scope: 'categories', fix: 'remove' }
    },
    participants: {
      patron: { scope: 'participants', fix: 'unset' }
    },
    expenses: {
      payer: { scope: 'participants', fix: 'remove' },
      category: { scope: 'categories', fix: 'unset' }
    }
  })

  const categories = select('categories', ['name', 'id'])
  const participants = select('participants', ['name', 'id'])
  const participations = select('participations')
  const expenses = select('expenses', ['date', 'id'])

  const activeParticipations = computed(() => {
    return participations.value.filter(({ active, rate }) => active && rate > 0)
  })

  const categoriesMap = computed(() => {
    return new Map(categories.value.map((item) => [item.id, item]))
  })

  const participantsMap = computed(() => {
    return new Map(participants.value.map((item) => [item.id, item]))
  })

  function categoryById(id) {
    return computed(() => categoriesMap.value.get(id))
  }

  function participantById(id) {
    return computed(() => participantsMap.value.get(id))
  }

  return {
    activeParticipations,
    categories,
    categoryById,
    connect,
    expenses,
    modified,
    participantById,
    participants,
    participations,
    upsert
  }
}

export function useSplit() {
  if (!context) context = useContext()
  return context
}
