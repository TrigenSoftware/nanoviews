import {
  type Accessor,
  type ReadableSignal,
  type WritableSignal,
  isAccessor
} from 'kida'
import {
  type Child,
  loop,
  fragment
} from '../internals/index.js'

/**
 * Create a tracker function for an item in a list
 * @param key - The key to track the item by
 * @returns A function that returns the value of the key in the item
 */
export function trackBy<T extends string>(key: T) {
  return (item: { [K in T]: unknown }) => item[key]
}

/**
 * Tracker function for an item in a list by its id
 * @param item - The item to track
 * @param item.id - The id of the item
 * @returns The id of the item
 */
export function trackById(item: { id: unknown }) {
  return item.id
}

type AnyEach = (
  item: Accessor<unknown>,
  index: ReadableSignal<number>
) => Child

type ReadableEach<T> = (
  item: Accessor<T>,
  index: ReadableSignal<number>
) => Child

type WritableEach<T> = (
  item: WritableSignal<T>,
  index: ReadableSignal<number>
) => Child

type StaticEach<T> = (
  item: T,
  index: number
) => Child

type UnknownTrack = (item: unknown, index: number) => unknown

export function for$<T>(
  $items: WritableSignal<T[]>,
  track?: (item: T, index: number) => unknown
): (
  each$: WritableEach<T>,
  $else?: () => Child
) => Child

export function for$<T>(
  $items: Accessor<T[]>,
  track?: (item: T, index: number) => unknown
): (
  each$: ReadableEach<T>,
  $else?: () => Child
) => Child

export function for$<T>(
  $items: T[]
): (
  each$: StaticEach<T>,
  $else?: () => Child
) => Child

/**
 * Iterate over items and render each item
 * @param $items - Target items
 * @param track - Tracker function to identify items
 * @returns Function to receive each$ and else$ functions
 */
export function for$(
  $items: unknown[] | Accessor<unknown[]>,
  track?: UnknownTrack
) {
  if (isAccessor($items)) {
    return (
      each$: AnyEach,
      else$?: () => Child
    ) => loop($items, each$, else$, track)
  }

  return (
    each$: StaticEach<unknown>,
    else$?: () => Child
  ) => ($items?.length ? fragment(...$items.map(each$)) : else$?.())
}
