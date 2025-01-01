import {
  type WritableSignal,
  type ReadableSignal,
  at,
  update,
  assignIndex
} from './internals/index.js'

/**
 * Get writable item store at index from the list store.
 * @param $list - The list store.
 * @param index - The index to get.
 * @returns The writable item store at the index.
 */
export function atIndex<T>(
  $list: WritableSignal<T[]>,
  index: number | ReadableSignal<number>
): WritableSignal<T>

/**
 * Get readable item store at index from the list store.
 * @param $list - The list store.
 * @param index - The index to get.
 * @returns The readable item store at the index.
 */
export function atIndex<T>(
  $list: ReadableSignal<T[]>,
  index: number | ReadableSignal<number>
): ReadableSignal<T>

export function atIndex<T>(
  $list: ReadableSignal<T[]> | WritableSignal<T[]>,
  index: number | ReadableSignal<number>
) {
  return at($list, assignIndex, index)
}

/**
 * Update the value of the list store.
 * @param $list - The list store.
 * @param fn - Function to update the list.
 * @returns The result of the function.
 */
export function updateList<T, R>($list: WritableSignal<T[]>, fn: (state: T[]) => R): R {
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
export function push<T>($list: WritableSignal<T[]>, ...values: T[]) {
  return updateList($list, state => state.push(...values))
}

/**
 * Removes the last element from a list store and returns it.
 * @param $list - The list store.
 * @returns Removed element.
 */
export function pop<T>($list: WritableSignal<T[]>) {
  return updateList($list, state => state.pop())
}

/**
 * Removes the first element from a list store and returns it.
 * @param $list - The list store.
 * @returns Removed element.
 */
export function shift<T>($list: WritableSignal<T[]>) {
  return updateList($list, state => state.shift())
}

/**
 * Inserts new elements at the start of an list store, and returns the new length of the list.
 * @param $list - The list store.
 * @param values - Values to insert.
 * @returns The new length of the list.
 */
export function unshift<T>($list: WritableSignal<T[]>, ...values: T[]) {
  return updateList($list, state => state.unshift(...values))
}

/**
 * Get value at index from the list store.
 * @param $list - The list store.
 * @param index - The index to get.
 * @returns The value at the index.
 */
export function getIndex<T>($list: ReadableSignal<T[]>, index: number) {
  return $list.get()[index]
}

/**
 * Set value at index in the list store.
 * @param $list - The list store.
 * @param index - The index to set.
 * @param value - The value to set.
 * @returns The new value.
 */
export function setIndex<T>($list: WritableSignal<T[]>, index: number, value: T) {
  return updateList($list, state => state[index] = value)
}

/**
 * Delete element at index from the list store.
 * @param $list - The list store.
 * @param index - The index to delete.
 * @returns The removed value.
 */
export function deleteIndex<T>($list: WritableSignal<T[]>, index: number) {
  return updateList($list, state => state.splice(index, 1)[0])
}

/**
 * Clear the list store.
 * @param $list - The list store.
 * @returns The cleared list store.
 */
export function clearList<T>($list: WritableSignal<T[]>) {
  $list.set([])
  return $list
}

/**
 * Check if the list store includes a value.
 * @param $list - The list store.
 * @param value - The value to check.
 * @returns Whether the list store includes the value.
 */
export function includes<T>($list: ReadableSignal<T[]>, value: T) {
  return $list.get().includes(value)
}
