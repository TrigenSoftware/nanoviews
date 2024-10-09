import type {
  EmptyValue,
  NonEmptyValue,
  NestedMaybeEmptyItem,
  Effect,
  Destroy,
  StrictEffect
} from './types/index.js'

export {
  isFunction,
  toArray,
  noop
} from '@nanoviews/stores'

export function isString(value: unknown): value is string {
  return typeof value === 'string'
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
    if (Array.isArray(item)) {
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
