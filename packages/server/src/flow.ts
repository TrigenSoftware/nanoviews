import {
  type Accessor,
  type ReadableSignal,
  type WritableSignal,
  type EmptyValue,
  type Signalish,
  type SignalishValue,
  $get,
  isAccessor
} from 'kida'
import {
  type Child,
  type LazyChild,
  type SwitchCase,
  type AnyMatchCase,
  type TruthySignalish,
  type FalsySignalish,
  default_
} from 'nanoviews'
import { renderChild } from './internals/render.js'

export {
  trackBy,
  trackById,
  as_,
  case_,
  default_,
  when_,
  throw_
} from 'nanoviews'

// A block reads its value once, when it is built, and writes what the value
// decides: there is nothing for it to follow on the server. A static value
// decides the same way, so the child is built in its place, under the
// injection context of where the block is put, as on the client

function renderSwap<T>(this: (value: T) => Child, $value: Signalish<T>) {
  return this($get($value))
}

/**
 * Render a child decided by a value
 * @param $value - Static value or store
 * @param render - Function that returns child for the value
 * @returns Block that renders the child
 */
export function swap_<T>(
  $value: Signalish<T>,
  render: (value: T) => Child
): Child {
  return (renderSwap<T>).bind(render, $value) as LazyChild
}

/**
 * Decide which child to render based on condition
 * @param $value - Static value or store
 * @returns Function that accepts then and else functions and returns Block that renders decided child
 */
/* @__NO_SIDE_EFFECTS__ */
export function if_<T>($value: T) {
  return (
    then_: (value: TruthySignalish<T>) => Child,
    else_?: (value: FalsySignalish<T>) => Child
  ) => swap_($value as Signalish<unknown>, value => (
    value
      ? then_($value as TruthySignalish<T>)
      : else_?.($value as FalsySignalish<T>)
  ))
}

/**
 * Decide which child to render based on switch cases
 * @param $value - Static value or store
 * @returns Function that accepts cases and returns Block that renders decided child
 */
/* @__NO_SIDE_EFFECTS__ */
export function switch_<T>($value: Signalish<T>) {
  // The value is decided once, so the cases are walked rather than put in a
  // map: from the last, which is the case a map keeps for a repeated key
  return (...cases: SwitchCase<SignalishValue<T>>[]) => swap_($value, (value) => {
    let fallback: (() => Child) | undefined

    for (let i = cases.length - 1, matchCase, key; i >= 0; i--) {
      matchCase = cases[i]
      key = matchCase[0]

      if (key === value) {
        return matchCase[1]()
      }

      if (key === default_) {
        fallback ??= matchCase[1]
      }
    }

    return fallback?.()
  })
}

// One walk, as on the client: the first case that holds wins, the first
// `default_` answers when none does, and no case below the winner is read
function renderMatch(this: AnyMatchCase[]) {
  let fallback: AnyMatchCase | undefined

  for (let i = 0, len = this.length, matchCase, condition: unknown; i < len; i++) {
    matchCase = this[i]
    condition = matchCase[0]

    if (condition === default_) {
      fallback ??= matchCase
    } else if ($get(condition)) {
      return matchCase[1](condition)
    }
  }

  return fallback?.[1](fallback[0])
}

/**
 * Render the child of the first case that holds
 * @param cases - Cases to decide from
 * @returns Block that renders the child of the case that holds
 */
/* @__NO_SIDE_EFFECTS__ */
export function match_(...cases: AnyMatchCase[]) {
  return renderMatch.bind(cases) as LazyChild
}

/**
 * Render a child that is shown while the value is truthy
 * @param $value - Static value or store
 * @param render - Function that returns the child
 * @returns Block that renders the child
 */
export function show_($value: Signalish<unknown>, render: () => Child) {
  return swap_($value, value => (value ? render() : null))
}

// The client builds every case once and parks all but the shown one out of
// the document: the shown one is what is written
export const show_switch_ = switch_
export const show_match_ = match_

type AnyEach = (
  item: Accessor<unknown>,
  index: ReadableSignal<number>,
  key: unknown
) => Child

type ReadableEach<T, K> = (
  item: Accessor<T>,
  index: ReadableSignal<number>,
  key: K
) => Child

type WritableEach<T, K> = (
  item: WritableSignal<T>,
  index: ReadableSignal<number>,
  key: K
) => Child

type StaticEach<T> = (
  item: T,
  index: number,
  key: number
) => Child

type UnknownTrack = (item: unknown, index: number) => unknown

function renderReactiveItems(
  this: Accessor<unknown[] | EmptyValue>,
  track: UnknownTrack | undefined,
  each_: AnyEach,
  else_: (() => Child) | undefined
) {
  const items = this()

  if (!items?.length) {
    return else_?.()
  }

  // The render function reads the item and its index, and nothing writes them
  // on the server: an accessor of each is all it takes, lighter than the
  // signals of the client, and `record` takes it the same
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i]

    renderChild(each_(() => item, (() => i) as ReadableSignal<number>, track ? track(item, i) : i))
  }
}

// The items of a static array are built in their place all the same, and
// written one by one, as reactive items are
function renderStaticItems(
  this: StaticEach<unknown>,
  items: unknown[] | EmptyValue,
  else_: (() => Child) | undefined
) {
  if (!items?.length) {
    return else_?.()
  }

  for (let i = 0, len = items.length; i < len; i++) {
    renderChild(this(items[i], i, i))
  }
}

export function for_<T, K = number>(
  $items: WritableSignal<T[]> | WritableSignal<T[] | EmptyValue>,
  track?: (item: T, index: number) => K
): (
  each_: WritableEach<T, K>,
  else_?: () => Child
) => Child

export function for_<T, K = number>(
  $items: Accessor<T[] | EmptyValue>,
  track?: (item: T, index: number) => K
): (
  each_: ReadableEach<T, K>,
  else_?: () => Child
) => Child

export function for_<T>(
  $items: T[] | EmptyValue
): (
  each_: StaticEach<T>,
  else_?: () => Child
) => Child

/**
 * Iterate over items and render each item
 * @param $items - Target items
 * @param track - Tracker function to identify items
 * @returns Function to receive each_ and else_ functions
 */
export function for_(
  $items: unknown[] | EmptyValue | Accessor<unknown[] | EmptyValue>,
  track?: UnknownTrack
) {
  if (isAccessor($items)) {
    return (
      each_: AnyEach,
      else_?: () => Child
    ): Child => renderReactiveItems.bind($items, track, each_, else_) as LazyChild
  }

  return (
    each_: StaticEach<unknown>,
    else_?: () => Child
  ): Child => renderStaticItems.bind(each_, $items, else_) as LazyChild
}
