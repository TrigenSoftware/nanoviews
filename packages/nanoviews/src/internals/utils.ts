import type {
  AnyFn,
  Store,
  EmptyValue,
  NonEmptyValue,
  NestedMaybeEmptyItem,
  Effect,
  Destroy,
  StrictEffect
} from './types/index.js'

export const { isArray } = Array

export const isReadonlyArray = isArray as unknown as (array: unknown) => array is readonly unknown[]

export function isFunction(value: unknown): value is AnyFn {
  return typeof value === 'function'
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Check if value is a store
 * @param value - Value to check
 * @returns True if value is a store
 */
export function isStore(value: unknown): value is Store {
  return (
    !!value
    && isFunction((value as Store).listen)
    && isFunction((value as Store).get)
    && isFunction((value as Store).set)
  )
}

/**
 * Check if value is empty
 * @param value - Value to check
 * @returns True if value is empty
 */
export function isEmpty(value: unknown): value is EmptyValue {
  return value === undefined || value === null
}

/**
 * Map nested non-empty items
 * @param items - Nested items to map
 * @param callback - Map callback
 * @returns Flattened non-empty results
 */
export function mapFlatNotEmpty<T, R>(
  items: NestedMaybeEmptyItem<T>[],
  callback: (item: T) => R
): NonEmptyValue<R>[] {
  return items.reduce<NonEmptyValue<R>[]>((results, item) => {
    if (isArray(item)) {
      results.push(...mapFlatNotEmpty(item, callback))
    } else if (!isEmpty(item)) {
      const result = callback(item)

      if (!isEmpty(result)) {
        results.push(result as NonEmptyValue<R>)
      }
    }

    return results
  }, [])
}

/**
 * Compose effects into a single effect
 * @param effects - Effects to compose
 * @returns Composed effect
 */
export function composeEffects<T>(
  ...effects: NestedMaybeEmptyItem<Effect<T>>[]
): StrictEffect<T> {
  return (value) => {
    let destroys: Destroy[] | null = mapFlatNotEmpty(effects, effect => effect(value))

    return () => {
      if (destroys) {
        destroys.forEach((destroy) => {
          destroy()
        })
        destroys = null
      }
    }
  }
}

/**
 * Convert value to array
 * @param value - Value to convert
 * @returns Array value
 */
export function toArray<T>(value: T | T[]): T[] {
  return isArray(value) ? value : [value]
}

/**
 * No operation function
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}
