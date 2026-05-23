export function useValidator(schema) {
  return (value) => {
    const { success, error } = schema.safeParse(value)
    return success || error.issues[0].message
  }
}
