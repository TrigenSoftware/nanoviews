import {
  type ReadableSignal,
  type WritableSignal,
  type AnySignal,
  signal,
  effectScope,
  atIndex,
  startBatch,
  endBatch
} from 'kida'
import type {
  Destroy,
  Child,
  Children
} from '../types/index.js'
import {
  createEffectScopeWithContext,
  effectScopeSwapper
} from '../effects.js'
import { createTextNode } from '../elements/text.js'
import {
  insertChildBeforeAnchor,
  insertChildrenBeforeAnchor,
  childFilter,
  remove,
  removeBetween
} from '../elements/child.js'

interface LoopItem {
  k: unknown
  i: WritableSignal<number>
  f: ChildNode
  l: ChildNode
  c: ChildNode[] | undefined
  n: LoopItem | undefined
  p: LoopItem | undefined
  d: Destroy
}

interface LoopItemsList {
  f: LoopItem | undefined
}

type LookupMap = Map<unknown, LoopItem>

type AnyEach = (
  item: AnySignal,
  index: ReadableSignal<number>
) => Child

type UnknownTrack = (item: unknown, index: number) => unknown

function getAnchor(
  item: LoopItem | undefined,
  fallback: ChildNode
) {
  return item === undefined ? fallback : item.f
}

function link(
  itemsList: LoopItemsList,
  prev: LoopItem | undefined,
  next: LoopItem | undefined,
  insert?: LoopItem | undefined
): void {
  if (prev === undefined) {
    itemsList.f = insert || next
  } else {
    prev.n = insert || next
  }

  if (next !== undefined) {
    next.p = insert || prev
  }
}

function move(
  item: LoopItem,
  anchor: ChildNode
) {
  const nextStart = item.l.nextSibling!
  let node = item.f

  while (node !== nextStart) {
    const next = node.nextSibling!

    anchor.before(node)

    node = next
  }
}

// test with condition in reconcile
function createItems(
  itemsList: LoopItemsList,
  lookupMap: LookupMap,
  $items: WritableSignal<unknown[]>,
  each$: AnyEach,
  track: UnknownTrack,
  nextItems: unknown[]
) {
  const { length } = nextItems
  const children = Array(length) as Children
  let prev: LoopItem | undefined

  for (let i = 0, value: unknown, key: unknown, item: LoopItem | undefined; i < length; i += 1) {
    value = nextItems[i]
    key = track(value, i)
    item = createEachBlock($items, each$, key, i)

    children[i] = item.c
    item.c = undefined

    link(
      itemsList,
      prev,
      item
    )

    lookupMap.set(key, item)
    prev = item
  }

  return children
}

// eslint-disable-next-line max-params
function reconcile(
  itemsList: LoopItemsList,
  lookupMap: LookupMap,
  $items: WritableSignal<unknown[]>,
  each$: AnyEach,
  track: UnknownTrack,
  anchor: ChildNode,
  nextItems: unknown[]
) {
  const { length } = nextItems
  let seen: Set<LoopItem> | undefined
  let matched: LoopItem[] = []
  let stashed: LoopItem[] = []
  let prev: LoopItem | undefined
  let current = itemsList.f

  for (let i = 0, value: unknown, key: unknown, item: LoopItem | undefined; i < length; i += 1) {
    value = nextItems[i]
    key = track(value, i)
    item = lookupMap.get(key)

    if (item === undefined) {
      item = createEachBlock($items, each$, key, i)

      insertChildrenBeforeAnchor(item.c!, getAnchor(current, anchor))
      item.c = undefined
      item.p = prev
      item.n = prev === undefined ? itemsList.f : prev.n

      lookupMap.set(key, item)

      link(
        itemsList,
        prev,
        item.n,
        item
      )

      matched = []
      stashed = []

      prev = item
      current = item.n
      continue
    }

    item.i(i)

    if (item !== current) {
      if (seen !== undefined && seen.has(item)) {
        if (matched.length < stashed.length) {
          const [start] = stashed
          let j

          prev = start.p

          const [a] = matched
          const b = matched[matched.length - 1]

          for (j = 0; j < matched.length; j += 1) {
            move(matched[j], getAnchor(start, anchor))
          }

          for (j = 0; j < stashed.length; j += 1) {
            seen.delete(stashed[j])
          }

          link(itemsList, a.p, b.n)
          link(itemsList, prev, a)
          link(itemsList, b, start)

          current = start
          prev = b
          i -= 1

          matched = []
          stashed = []
        } else {
          seen.delete(item)
          move(item, getAnchor(current, anchor))

          link(itemsList, item.p, item.n)
          link(itemsList, item, prev === undefined ? itemsList.f : prev.n)
          link(itemsList, prev, item)

          prev = item
        }

        continue
      }

      matched = []
      stashed = []

      while (current !== undefined && current.k !== key) {
        (seen ??= new Set()).add(current)
        stashed.push(current)
        current = current.n
      }

      if (current === undefined) {
        continue
      }

      item = current
    }

    matched.push(item)
    prev = item
    current = item.n
  }

  if (current !== undefined || seen !== undefined) {
    if (seen !== undefined) {
      seen.forEach(block => destroyLoopItem(itemsList, block, lookupMap))
    }

    while (current !== undefined) {
      prev = current
      current = current.n
      destroyLoopItem(itemsList, prev, lookupMap)
    }
  }
}

function destroyLoopItem(itemsList: LoopItemsList, item: LoopItem, lookupMap: LookupMap) {
  item.d()
  remove(item.f, item.l)
  lookupMap.delete(item.k)
  link(itemsList, item.p, item.n)
}

function createEachBlock(
  $items: WritableSignal<unknown[]>,
  each$: AnyEach,
  key: unknown,
  i: number
): LoopItem {
  const $index = signal(i)
  let children: ChildNode[]
  const destroy = effectScope(() => children = childFilter(
    each$(atIndex($items, $index), $index)
  ))

  return {
    k: key,
    i: $index,
    f: children![0],
    l: children![children!.length - 1],
    c: children!,
    n: undefined,
    p: undefined,
    d: destroy
  }
}

export function loop(
  $items: WritableSignal<unknown[]>,
  each$: AnyEach,
  else$?: () => Child,
  track: UnknownTrack = (_, i) => i
): Child {
  const start = createTextNode()
  const end = createTextNode()
  const effectScope = createEffectScopeWithContext()
  const blocksMap: LookupMap = new Map()
  const itemsList: LoopItemsList = {
    f: undefined
  }
  let isPlaceholder = false
  let child: Child

  effectScopeSwapper($items, (
    destroyPrev: Destroy | undefined,
    items: unknown[],
    prevItems: unknown[] | undefined
  ) => {
    const itemsCount = items.length
    const prevItemsCount = prevItems?.length

    if (itemsCount && prevItemsCount) {
      // [...m] -> [...n]
      // swap
      return effectScope(() => {
        startBatch()
        reconcile(
          itemsList,
          blocksMap,
          $items,
          each$,
          track,
          end,
          items
        )
        endBatch()
      }, true)()
    }

    const shouldRender = itemsCount || !isPlaceholder

    if (shouldRender && destroyPrev !== undefined) {
      destroyPrev()
      removeBetween(start, end)
      blocksMap.clear()
      itemsList.f = undefined
    }

    let runEffects

    if (itemsCount) {
      // [] -> [...n]
      isPlaceholder = false
      runEffects = effectScope(() => {
        child = createItems(
          itemsList,
          blocksMap,
          $items,
          each$,
          track,
          items
        )
      }, true)
    } else if (!isPlaceholder) {
      // ([...n] | []) -> []
      isPlaceholder = true
      runEffects = effectScope(
        () => child = else$?.(),
        true
      )
    }

    if (shouldRender) {
      // swap
      if (destroyPrev !== undefined) {
        insertChildBeforeAnchor(child, end)
        child = undefined
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        destroyPrev = runEffects!()
      } else {
        // initial
        destroyPrev = runEffects!
      }
    }

    return destroyPrev!
  })

  return [
    start,
    child,
    end
  ]
}
