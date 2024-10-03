import type {
  Store,
  ListStore,
  CollectionValueStore
} from './types/index.js'
import {
  collection,
  update,
  accessKey,
  assignIndex,
  toStore,
  atom
} from './internals/index.js'

/**
 * Create a list collection store.
 * @param source - Initial value of the store or source store.
 * @param itemType - Function to create a store for each item.
 * @returns A list collection store.
 */
export function list<
  T,
  S extends T[] | Store<T[]> = Store<T[]>,
  I extends CollectionValueStore<S> = CollectionValueStore<S>
>(
  source?: S,
  itemType?: ($store: CollectionValueStore<S>) => I
) {
  return collection(
    toStore(source || [], atom),
    accessKey,
    assignIndex,
    itemType
  ) as unknown as ListStore<S, I>
}

/**
 * Update the value of the list store.
 * @param $list - The list store.
 * @param fn - Function to update the list.
 * @returns The result of the function.
 */
export function updateList<T, R>($list: Store<T[]>, fn: (state: T[]) => R): R {
  let result

  update($list, (state) => {
    const nextState = state.slice()

    result = fn(nextState)

    return nextState
  })

  return result as R
}

/**
 * Add values to the list store.
 * @param $list - The list store.
 * @param values - Values to push.
 * @returns The new length of the list.
 */
export function push<T>($list: Store<T[]>, ...values: T[]) {
  return updateList($list, state => state.push(...values))
}

/**
 * Removes the last element from a list store and returns it.
 * @param $list - The list store.
 * @returns Removed element.
 */
export function pop<T>($list: Store<T[]>) {
  return updateList($list, state => state.pop())
}

/**
 * Removes the first element from a list store and returns it.
 * @param $list - The list store.
 * @returns Removed element.
 */
export function shift<T>($list: Store<T[]>) {
  return updateList($list, state => state.shift())
}

/**
 * Inserts new elements at the start of an list store, and returns the new length of the list.
 * @param $list - The list store.
 * @param values - Values to insert.
 * @returns The new length of the list.
 */
export function unshift<T>($list: Store<T[]>, ...values: T[]) {
  return updateList($list, state => state.unshift(...values))
}

/**
 * Get value at index from the list store.
 * @param $list - The list store.
 * @param index - The index to get.
 * @returns The value at the index.
 */
export function getIndex<T>($list: Store<T[]>, index: number) {
  return $list.get()[index]
}

/**
 * Set value at index in the list store.
 * @param $list - The list store.
 * @param index - The index to set.
 * @param value - The value to set.
 * @returns The new value.
 */
export function setIndex<T>($list: Store<T[]>, index: number, value: T) {
  // eslint-disable-next-line no-return-assign
  return updateList($list, state => state[index] = value)
}

/**
 * Delete element at index from the list store.
 * @param $list - The list store.
 * @param index - The index to delete.
 * @returns The removed value.
 */
export function deleteIndex<T>($list: Store<T[]>, index: number) {
  return updateList($list, state => state.splice(index, 1)[0])
}

/**
 * Clear the list store.
 * @param $list - The list store.
 * @returns The cleared list store.
 */
export function clearList<T>($list: Store<T[]>) {
  $list.set([])
  return $list
}

/**
 * Check if the list store includes a value.
 * @param $list - The list store.
 * @param value - The value to check.
 * @returns Whether the list store includes the value.
 */
export function includes<T>($list: Store<T[]>, value: T) {
  return $list.get().includes(value)
}
