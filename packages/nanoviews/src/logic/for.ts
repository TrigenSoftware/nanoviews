import {
  type ReadableSignal,
  type WritableSignal,
  type AnySignal,
  isSignal
} from 'kida'
import {
  type Child,
  loop
} from '../internals/index.js'

type AnyEach = (
  item: AnySignal,
  index: ReadableSignal<number>
) => Child

type ReadableEach<T> = (
  item: ReadableSignal<T>,
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
  $items: ReadableSignal<T[]>,
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
  $items: unknown[] | AnySignal,
  track?: UnknownTrack
) {
  if (isSignal($items)) {
    return (
      each$: AnyEach,
      else$?: () => Child
    ) => loop($items as WritableSignal<unknown[]>, each$, else$, track)
  }

  return (
    each$: StaticEach<unknown>,
    else$?: () => Child
  ) => ($items?.length ? $items.map(each$) : else$?.())
}
