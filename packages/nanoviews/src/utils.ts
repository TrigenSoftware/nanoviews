export * from './internals/utils.js'

/**
 * Helper to throw error in expression
 * @param error - Error to throw
 */
export function throw$(error: Error) {
  throw error
}

/**
 * Create a class name string from parts
 * @param parts - Class name parts
 * @returns Class name string
 */
export function className(...parts: unknown[]) {
  const len = parts.length
  let cls = ''

  if (len) {
    for (let i = 0, part: unknown; i < len; i++) {
      if ((part = parts[i]) && typeof part === 'string') {
        cls += (cls && ' ') + part
      }
    }
  }

  return cls
}
