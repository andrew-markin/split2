export function useStorage() {
  function get(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (err) {
      console.log('Unable to get storage value:', err.message)
    }
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  return { get, set }
}
