import {
  type ReadableSignal,
  type WritableSignal,
  type AnySignal,
  isSignal
} from 'kida'
import {
  type PrimitiveChild,
  LoopBlock,
  Block,
  noop,
  childToBlock,
  createFragment
} from '../internals/index.js'

type AnyEach = (
  item: AnySignal,
  index: ReadableSignal<number>
) => PrimitiveChild

type ReadableEach<T> = (
  item: ReadableSignal<T>,
  index: ReadableSignal<number>
) => PrimitiveChild

type WritableEach<T> = (
  item: WritableSignal<T>,
  index: ReadableSignal<number>
) => PrimitiveChild

type StaticEach<T> = (
  item: T,
  index: number
) => PrimitiveChild

type UnknownTrack = (item: unknown, index: number) => unknown

export function for$<T>(
  $items: WritableSignal<T[]>,
  track?: (item: T, index: number) => unknown
): (
  each$: WritableEach<T>,
  $else?: () => PrimitiveChild
) => Block

export function for$<T>(
  $items: ReadableSignal<T[]>,
  track?: (item: T, index: number) => unknown
): (
  each$: ReadableEach<T>,
  $else?: () => PrimitiveChild
) => Block

export function for$<T>(
  $items: T[]
): (
  each$: StaticEach<T>,
  $else?: () => PrimitiveChild
) => Block

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
      else$: () => PrimitiveChild = noop
    ): Block => new LoopBlock($items as WritableSignal<unknown[]>, each$, else$, track)
  }

  return (
    each$: StaticEach<unknown>,
    else$: () => PrimitiveChild = noop
  ) => {
    if ($items?.length) {
      return createFragment($items.map(each$))
    }

    return childToBlock(else$())
  }
}
