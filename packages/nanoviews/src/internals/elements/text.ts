import type { EmptyValue } from '../types/index.js'
import { isEmpty } from '../utils.js'

// An empty child renders nothing. The booleans are empty next to the nullish
// values, the way a React reader expects: `cond && child` needs no `: null`
export function isEmptyChild(value: unknown): value is EmptyValue | boolean {
  return isEmpty(value) || typeof value === 'boolean'
}
