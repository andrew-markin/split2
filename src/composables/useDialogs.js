import { markRaw, reactive, readonly } from 'vue'

let context

function useContext() {
  const stack = reactive([])

  function exec(component, props = {}) {
    return new Promise((resolve, reject) => {
      const id = Symbol('dialog')
      const instance = { id, component: markRaw(component), props, resolve, reject }
      stack.push(instance)
      instance.close = (result) => {
        const index = stack.findIndex((dialog) => dialog.id === id)
        if (index !== -1) {
          stack.splice(index, 1)
          resolve(result)
        }
      }
    })
  }

  function cancel() {
    const lastIndex = stack.length - 1
    if (lastIndex >= 0) stack[lastIndex].close()
  }

  return { stack: readonly(stack), exec, cancel }
}

export function useDialogs() {
  if (!context) context = useContext()
  return context
}
