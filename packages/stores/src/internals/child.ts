import type {
  AnyStore,
  AnyObject,
  EmptyValue
} from './types/index.js'
import { computed } from './computed.js'

/**
 * Create a store that is a child of another store.
 * @param $root - The root store.
 * @param $parent - The parent store.
 * @param get - Function to get value from the parent.
 * @param set - Function to set value to the parent.
 * @returns A store.
 */
export function child(
  $root: AnyStore,
  $parent: AnyStore,
  get: (state: AnyObject | EmptyValue) => any,
  set: (state: AnyObject | EmptyValue, value: any) => AnyObject
): AnyStore {
  return {
    ...computed($root, () => get($parent.get())),
    set(value: any) {
      $parent.set(set($parent.get(), value))
    }
  }
}
