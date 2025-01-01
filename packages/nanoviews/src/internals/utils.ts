import type { EmptyValue } from './types/index.js'

export {
  isFunction,
  noop
} from 'kida'

/**
 * Check if value is empty
 * @param value - Value to check
 * @returns True if value is empty
 */
export function isEmpty(value: unknown): value is EmptyValue {
  return value === undefined || value === null
}
