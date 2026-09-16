import { computed, reactive } from 'vue'

import { getRandomId } from '@/utils'

export function useForm(seed, options = {}) {
  const base = reactive({ ...seed })
  const form = reactive({ ...seed })

  if (typeof options.init === 'function') options.init(form)
  if (!form.id) form.id = getRandomId()

  const changes = computed(() => {
    const result = {}

    const formCopy = { ...form }
    if (typeof options.transform === 'function') options.transform(formCopy)

    Object.entries(formCopy).forEach(([key, value]) => {
      if (key === 'id' || value !== base[key]) result[key] = value
    })

    Object.keys(base).forEach((key) => {
      if (!Object.hasOwn(formCopy, key)) result[key] = undefined
    })

    return result
  })

  const changed = computed(
    () => Object.keys(changes.value).filter((key) => key !== 'id').length > 0
  )

  return { form, changes, changed }
}
