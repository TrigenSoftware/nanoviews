import {
  $get,
  isAccessor
} from 'kida'
import type { ClassValue } from '../types/index.js'

function join(parts: readonly ClassValue[]) {
  let cls = ''

  for (let i = 0, len = parts.length, part: unknown; i < len; i++) {
    // A nested list, such as the `class` a component received, is joined in
    // place
    if (Array.isArray(part = $get(parts[i]))) {
      part = join(part)
    }

    if (part && typeof part === 'string') {
      cls += (cls && ' ') + part
    }
  }

  return cls
}

// A list with no accessor in it, the nested lists included, never changes: it
// is joined once, with no effect to carry it
function isDynamic(parts: readonly ClassValue[]): boolean {
  for (let i = 0, len = parts.length, part: unknown; i < len; i++) {
    part = parts[i]

    if (isAccessor(part) || Array.isArray(part) && isDynamic(part as readonly ClassValue[])) {
      return true
    }
  }

  return false
}

/* @__NO_SIDE_EFFECTS__ */
export function cx(parts: readonly ClassValue[]) {
  return isDynamic(parts)
    ? () => join(parts)
    : join(parts)
}
