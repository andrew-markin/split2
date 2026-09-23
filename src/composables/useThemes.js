import { useQuasar } from 'quasar'

import { useStorage } from '@/composables/useStorage'

const SPLIT_IS_DARK_STORAGE_KEY = 'split:dark'

export function useThemes() {
  const $q = useQuasar()
  const storage = useStorage()

  function systemIsDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  function init() {
    const splitIsDark = storage.get(SPLIT_IS_DARK_STORAGE_KEY)
    if (typeof splitIsDark === 'boolean') $q.dark.set(splitIsDark)
    else $q.dark.set('auto')
  }

  function toggle() {
    const splitIsDark = !$q.dark.isActive
    if (splitIsDark === systemIsDark()) storage.remove(SPLIT_IS_DARK_STORAGE_KEY)
    else storage.set(SPLIT_IS_DARK_STORAGE_KEY, splitIsDark)
    $q.dark.set(splitIsDark)
  }

  return { init, toggle }
}
