import { $get } from 'kida'
import type { ClassValue } from '../types/index.js'

function join(parts: readonly ClassValue[]) {
  const len = parts.length
  let cls = ''

  if (len) {
    for (let i = 0, part: unknown; i < len; i++) {
      // A nested list, such as the `class` a component received, is joined in
      // place
      if (Array.isArray(part = $get(parts[i]))) {
        part = join(part)
      }

      if (part && typeof part === 'string') {
        cls += (cls && ' ') + part
      }
    }
  }

  return cls
}

/* @__NO_SIDE_EFFECTS__ */
export function cx(parts: readonly ClassValue[]) {
  return () => join(parts)
}
