import type { MaybeSignalValue } from 'kida'
import {
  type ValueOrSignal,
  type Child,
  decide
} from '../internals/index.js'

export type SwitchCase<T> = readonly [T | typeof default$, () => Child]

/**
 * Decide which child to render based on switch cases
 * @param $value - Static value or store
 * @returns Function that accepts cases and returns Block that renders decided child
 */
export function switch$<T>($value: ValueOrSignal<T>) {
  type Value = MaybeSignalValue<T>

  /**
   * Decide which child to render based on switch cases
   * @param cases - Cases to decide from
   * @returns Block that renders decided child
   */
  return (...cases: SwitchCase<Value>[]) => {
    const casesMap = new Map<unknown, () => Child>(cases)

    return decide($value, value => (
      casesMap.has(value)
        ? casesMap.get(value)!()
        : casesMap.get(default$)?.()
    ))
  }
}

export function case$<T>(value: T, then$: () => Child): SwitchCase<T> {
  return [value, then$]
}

export function default$(then$: () => Child): SwitchCase<typeof default$> {
  return [default$, then$]
}
