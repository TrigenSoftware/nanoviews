import type { Effect } from './block.js'
import type { UnknownAttributes } from './attributes.js'

declare module 'nanoviews' {
  interface EffectAttributeValues {
  }

  interface EffectAttributeTargets {
  }
}

export type GetEffectAttributeValue<T extends string> = T extends keyof import('nanoviews').EffectAttributeValues
  ? import('nanoviews').EffectAttributeValues[T]
  : never

export type PickEffectAttributesByTarget<Target extends Element> = {
  [K in keyof import('nanoviews').EffectAttributeTargets]?: Target extends import('nanoviews').EffectAttributeTargets[K]
    ? GetEffectAttributeValue<K>
    : never
}

export type EffectAttributeId = symbol | string

export type EffectAttributeCallback<Target extends Element = Element, Value = unknown> = (
  target: Target,
  value: Value,
  attributes: UnknownAttributes
) => Effect<void> | void | undefined
