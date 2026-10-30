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
  type ShowMatchCase,
  type TruthySignalish,
  type FalsySignalish,
  default_
} from 'nanoviews'
import {
  state,
  renderChild
} from './internals/render.js'

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
// decides: there is nothing for it to follow on the server. On the client a
// block of a reactive value stands between two anchors, which hydration
// takes from the markers written around its content. A static value decides
// with no block, its child built in its place, as on the client
const START = '<!--[-->'
const END = '<!--]-->'

function renderReactiveSwap<T>(this: (value: T) => Child, $value: Accessor<T>) {
  state.html += START
  renderChild(this($value()))
  state.html += END
}

function renderStaticSwap<T>(this: (value: T) => Child, value: T) {
  return this(value)
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
  return isAccessor($value)
    ? (renderReactiveSwap<T>).bind(render, $value)
    : (renderStaticSwap<T>).bind(render, $value) as LazyChild
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

// The value is decided once, so the cases are walked rather than put in a
// map: from the last, which is the case a map keeps for a repeated key
function findCase(cases: SwitchCase<unknown>[], value: unknown) {
  let fallback: SwitchCase<unknown> | undefined

  for (let i = cases.length - 1, matchCase, key; i >= 0; i--) {
    matchCase = cases[i]
    key = matchCase[0]

    if (key === value) {
      return matchCase
    }

    if (key === default_) {
      fallback ??= matchCase
    }
  }

  return fallback
}

/**
 * Decide which child to render based on switch cases
 * @param $value - Static value or store
 * @returns Function that accepts cases and returns Block that renders decided child
 */
/* @__NO_SIDE_EFFECTS__ */
export function switch_<T>($value: Signalish<T>) {
  return (...cases: SwitchCase<SignalishValue<T>>[]) => swap_($value, value => findCase(cases, value)?.[1]())
}

// One walk, as on the client: the first case that holds wins, the first
// `default_` answers when none does, and no case below the winner is read
function findMatch<C extends AnyMatchCase | ShowMatchCase>(cases: C[]) {
  let fallback: C | undefined

  for (let i = 0, len = cases.length, matchCase: C, condition: unknown; i < len; i++) {
    matchCase = cases[i]
    condition = matchCase[0]

    if (condition === default_) {
      fallback ??= matchCase
    } else if ($get(condition)) {
      return matchCase
    }
  }

  return fallback
}

// The client follows the cases in a computed, so the block is reactive
// whatever the cases are
function renderMatch(this: AnyMatchCase[]) {
  const matched = findMatch(this)

  state.html += START

  if (matched !== undefined) {
    renderChild(matched[1](matched[0]))
  }

  state.html += END
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

// The client builds every case once, each in a block of its own, and parks
// all but the shown one out of the document: the markup has the blocks of
// all the cases and the content of the shown one. The cases are keyed as
// the map of the client keys them: a repeated key keeps its first place and
// its last child
function renderShowSwitch(this: SwitchCase<unknown>[], $value: Accessor<unknown>) {
  const shown = findCase(this, $value())

  for (let i = 0, len = this.length, key, j; i < len; i++) {
    key = this[i][0]
    j = 0

    // The first case of the key, this one at the latest
    while (this[j][0] !== key) {
      j++
    }

    if (j === i) {
      state.html += START

      if (shown !== undefined && key === shown[0]) {
        renderChild(shown[1]())
      }

      state.html += END
    }
  }
}

/**
 * Show the child of the case that matches the value, keeping the others
 * @param $value - Static value or store
 * @returns Function that accepts cases and returns Block that shows decided child
 */
/* @__NO_SIDE_EFFECTS__ */
export function show_switch_<T>($value: Signalish<T>) {
  return (...cases: SwitchCase<SignalishValue<T>>[]): Child => (
    isAccessor($value)
      ? renderShowSwitch.bind(cases as SwitchCase<unknown>[], $value)
      : switch_($value)(...cases)
  )
}

// Every case is a block of its own, as in `show_switch_`
function renderShowMatch(this: ShowMatchCase[]) {
  const matched = findMatch(this)

  for (let i = 0, len = this.length, matchCase; i < len; i++) {
    matchCase = this[i]
    state.html += START

    if (matchCase === matched) {
      renderChild(matchCase[1]())
    }

    state.html += END
  }
}

/**
 * Show the child of the first case that holds, keeping the others
 * @param cases - Cases to decide from
 * @returns Block that shows the child of the case that holds
 */
/* @__NO_SIDE_EFFECTS__ */
export function show_match_(...cases: ShowMatchCase[]) {
  return renderShowMatch.bind(cases) as LazyChild
}

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

  state.html += START

  if (items?.length) {
    // The render function reads the item and its index, and nothing writes
    // them on the server: an accessor of each is all it takes, lighter than
    // the signals of the client, and `record` takes it the same
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i]

      renderChild(each_(() => item, (() => i) as ReadableSignal<number>, track ? track(item, i) : i))
    }
  } else {
    renderChild(else_?.())
  }

  state.html += END
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
    ): Child => renderReactiveItems.bind($items, track, each_, else_)
  }

  return (
    each_: StaticEach<unknown>,
    else_?: () => Child
  ): Child => renderStaticItems.bind(each_, $items, else_) as LazyChild
}

// The child needs the browser, so the server writes the fallback in its
// place, in a block that hydration takes and clears to build the child in
function renderFallback(this: () => Child) {
  state.html += START
  renderChild(this())
  state.html += END
}

function renderEmptyBlock() {
  state.html += START + END
}

/**
 * Render a child in the browser only: the server never calls render, and
 * writes the fallback in its place, such as a skeleton
 * @param render - Function that returns the child
 * @param fallback - Function that returns what the server writes instead
 * @returns Block that writes the fallback
 */
export function browser_(render: () => Child, fallback?: () => Child): Child

/* @__NO_SIDE_EFFECTS__ */
export function browser_(_render: () => Child, fallback?: () => Child) {
  return fallback === undefined
    ? renderEmptyBlock
    : renderFallback.bind(fallback)
}
