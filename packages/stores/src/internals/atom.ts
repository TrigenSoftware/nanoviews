import type {
  Store,
  AnyStore
} from './types/index.js'
import { LevelSymbol } from './types/index.js'
import {
  EventTargetSymbol,
  SET,
  NOTIFY,
  CHANGE,
  dispatch
} from './events/index.js'

/**
 * Create a store with atomic value.
 * @param initialValue - Initial value of the store.
 * @returns A store.
 */
export function atom<T>(
  ...initialValue: undefined extends T ? [] | [T] : [T]
): Store<T>

export function atom<T>(initialValue?: T) {
  let value = initialValue
  const $atom: Store<T> = {
    [LevelSymbol]: 0,
    [EventTargetSymbol]: new Map(),
    get() {
      return value as T
    },
    set(nextValue: T) {
      const prevValue = value
      const values = [nextValue, prevValue]

      if (prevValue !== nextValue && dispatch($atom, SET, values)) {
        value = nextValue

        if (dispatch($atom, NOTIFY, values)) {
          dispatch($atom, CHANGE, values)
        }
      }
    }
  }

  return $atom
}

/**
 * Set the priority level of the store.
 * @param $store
 * @param level
 * @returns The store.
 */
export function setLevel<T extends AnyStore>($store: T, level: number) {
  $store[LevelSymbol] = level
  return $store
}

/**
 * Update the value of the store.
 * @param $store
 * @param fn - Function to update the value.
 * @returns The store.
 */
export function update<T>($store: Store<T>, fn: (value: T) => T) {
  $store.set(fn($store.get()))
  return $store
}
