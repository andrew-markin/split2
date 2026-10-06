import { useQuasar } from 'quasar'
import { computed } from 'vue'

export function useScreen() {
  const $q = useQuasar()
  const desktop = computed(() => $q.screen.gt.xs)
  const mobile = computed(() => !desktop.value)
  return { desktop, mobile }
}
