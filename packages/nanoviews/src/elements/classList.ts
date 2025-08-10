/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import {
  type ValueOrAccessor,
  get
} from 'kida'
import {
  type FalsyValue,
  createEffectAttribute,
  subscribeAccessor
} from '../internals/index.js'

export type ClassList = ValueOrAccessor<string | boolean | FalsyValue>[]

function cx(parts: unknown[]) {
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

/**
 * Effect attribute to set class list on element
 */
export const classList$ = /* @__PURE__ */ createEffectAttribute<'classList$', HTMLElement, ClassList>(
  'classList$',
  (element, parts) => {
    subscribeAccessor(
      () => cx(parts.map(get)),
      className => element.className = className
    )
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    classList$: ClassList
  }

  interface EffectAttributeTargets {
    classList$: HTMLElement
  }
}
