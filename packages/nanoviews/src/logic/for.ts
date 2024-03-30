import type {
  ValueOrStore,
  Block,
  PrimitiveChild
} from '../internals/index.js'
import {
  childToBlock,
  isStore,
  noop,
  createFragment,
  addEffects,
  createBlockFromBlocks
} from '../internals/index.js'
import { decide$ } from './decide.js'

type LookupMap = Map<unknown, Block>

type IndexMap = Map<unknown, number>

export type Tracker<T> = (item: T, index: number) => unknown

export type Each<T> = (item: T, index: number) => PrimitiveChild

type TrackedEachBlock<T> = (item: T, index: number) => Block

function destroy(block: Block, lookupMap: LookupMap) {
  lookupMap.delete(block.k)
  block.d()
}

function setDeltasFromOldIndexes(
  deltasMap: IndexMap,
  oldIndexes: IndexMap,
  i: number
) {
  oldIndexes.forEach(
    (index, key) => deltasMap.set(key, Math.abs(i - index))
  )
}

function sync<T>(
  parentNode: Node,
  lookupMap: LookupMap,
  tracker: Tracker<T>,
  trackedEachBlock: TrackedEachBlock<T>,
  prevBlocks: Block[],
  nextItems: T[]
) {
  let prevBlocksCount = prevBlocks.length
  let nextItemsCount = nextItems.length
  let i = prevBlocksCount
  let next: Node | null = null
  const oldIndexes: IndexMap = new Map()
  const effects = []

  while (i--) {
    oldIndexes.set(prevBlocks[i].k, i)
  }

  const nextBlocks = []
  const nextLookupMap: LookupMap = new Map()
  const deltasMap: IndexMap = new Map()

  i = nextItemsCount

  // Fill nextBlocks and deltasMap
  while (i--) {
    const key = tracker(nextItems[i], i)
    let block = lookupMap.get(key)

    if (!block) {
      // Create new block
      block = trackedEachBlock(nextItems[i], i)
      block.c()
      effects.push(block.e)
    }

    nextBlocks[i] = block
    nextLookupMap.set(key, block)

    setDeltasFromOldIndexes(deltasMap, oldIndexes, i)
  }

  const willMoveKeysMap = new Set()
  const didMoveKeysMap = new Set()
  const insert = (block: Block) => {
    block.m(parentNode, next || null)
    lookupMap.set(block.k, block)
    next = block.n
    nextItemsCount--
  }

  // Sync DOM with new items
  while (prevBlocksCount && nextItemsCount) {
    const nextBlock = nextBlocks[nextItemsCount - 1]
    const prevBlock = prevBlocks[prevBlocksCount - 1]
    const nextKey = nextBlock.k
    const prevKey = prevBlock.k

    if (nextBlock === prevBlock) {
      // do nothing
      next = nextBlock.n
      prevBlocksCount--
      nextItemsCount--
    } else if (!nextLookupMap.has(prevKey)) {
      // remove old block
      destroy(prevBlock, lookupMap)
      prevBlocksCount--
    } else if (!lookupMap.has(nextKey) || willMoveKeysMap.has(nextKey)) {
      insert(nextBlock)
    } else if (didMoveKeysMap.has(prevKey)) {
      prevBlocksCount--
    } else if (deltasMap.get(nextKey)! > deltasMap.get(prevKey)!) {
      didMoveKeysMap.add(nextKey)
      insert(nextBlock)
    } else {
      willMoveKeysMap.add(prevKey)
      prevBlocksCount--
    }
  }

  // Cleanup deleted items
  while (prevBlocksCount--) {
    const prevBlock = prevBlocks[prevBlocksCount]

    if (!nextLookupMap.has(prevBlock.k)) {
      destroy(prevBlock, lookupMap)
    }
  }

  // Insert rest new blocks
  // `nextItemsCount` modified in `insert`
  // eslint-disable-next-line no-unmodified-loop-condition
  while (nextItemsCount) {
    insert(nextBlocks[nextItemsCount - 1])
  }

  effects.forEach(effect => effect())

  return nextBlocks
}

function withTrackedEachBlock<T>(each: Each<T>, tracker: Tracker<T>) {
  return (v: T, i: number) => {
    const block = childToBlock(each(v, i))

    block.k = tracker(v, i)

    return block
  }
}

function createEachBlocks<T>(
  lookupMap: LookupMap,
  tracker: Tracker<T>,
  trackedEachBlock: TrackedEachBlock<T>,
  items: T[]
) {
  const blocks = Array(items.length) as Block[]

  items.forEach((v, i) => {
    blocks[i] = trackedEachBlock(v, i)
    lookupMap.set(tracker(v, i), blocks[i])
  })

  return blocks
}

/**
 * Render each item in the array
 * @param items - Static array
 * @param each - Function that returns block for each item
 * @returns Block that renders each item
 */
export function for$<T>(
  items: T[],
  each: Each<T>
): Block

/**
 * Dinamically render each item in the array
 * @param $items - Static array or store
 * @param tracker - Function that returns unique key for each item
 * @param each - Function that returns block for each item
 * @returns Block that renders each item
 */
export function for$<T>(
  $items: ValueOrStore<T[]>,
  tracker: Tracker<T>,
  each: Each<T>
): Block

export function for$<T>(
  $items: ValueOrStore<T[]>,
  trackerOrEach: Tracker<T> | Each<T>,
  maybeEach?: Each<T>
) {
  const [tracker, each] = maybeEach
    ? [trackerOrEach as Tracker<T>, maybeEach]
    : [noop, trackerOrEach as Each<T>]

  if (isStore($items)) {
    const trackedEachBlock = withTrackedEachBlock(each, tracker)
    const blocksMap: LookupMap = new Map()
    let blocks: Block[] | null
    let fragment: Block | null

    return addEffects(
      () => () => {
        fragment = null
      },
      decide$($items, (items, prevItems) => {
        const itemsCount = items.length
        const prevItemsCount = prevItems?.length

        if (itemsCount) {
          fragment ||= addEffects(
            () => () => {
              blocksMap.clear()
              blocks = null
            },
            createBlockFromBlocks(() => blocks)
          )

          if (prevItemsCount) {
            // [...n] -> [...n1]
            blocks = sync(
              fragment.n!.parentNode!,
              blocksMap,
              tracker,
              trackedEachBlock,
              blocks!,
              items
            )
            fragment.n = blocks[0].n
          } else {
            // [] -> [...n]
            blocks = createEachBlocks(blocksMap, tracker, trackedEachBlock, items)
          }

          return fragment
        }

        // [...n] | [] -> []
        return null
      })
    )
  }

  return createFragment(
    $items.map(each)
  )
}
