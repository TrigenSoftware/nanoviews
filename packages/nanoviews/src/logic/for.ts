import type {
  ListStore,
  AnyStore,
  AnyList,
  Store
} from '@nanoviews/stores'
import {
  isStore,
  atom
} from '@nanoviews/stores'
import type {
  Block,
  PrimitiveChild
} from '../internals/index.js'
import {
  noop,
  childToBlock,
  createFragment,
  addEffects,
  createBlockFromBlocks,
  decide
} from '../internals/index.js'

type LookupMap = Map<unknown, Block>

type IndexMap = Map<unknown, number>

type $IndexesMap = Map<unknown, Store<number>>

export type Each<T> = (
  item: T extends ListStore<AnyList, infer V>
    ? V
    : T extends (infer V)[]
      ? V
      : never,
  index: T extends ListStore<AnyList>
    ? Store<number>
    : number
) => PrimitiveChild

type TrackedEachBlock = (item: AnyStore, index: number) => Block

// eslint-disable-next-line max-params
function sync(
  parentNode: Node,
  lookupMap: LookupMap,
  $indexesMap: $IndexesMap,
  trackedEachBlock: TrackedEachBlock,
  prevBlocks: Block[],
  $nextItems: ListStore<unknown[]>,
  nextItemsCount: number
) {
  const destroy = (block: Block) => {
    lookupMap.delete(block.k)
    $indexesMap.delete(block.k)
    block.d()
  }
  let itemsCount = nextItemsCount
  let prevBlocksCount = prevBlocks.length
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
  const setDeltasFromOldIndexes = (i: number) => oldIndexes.forEach(
    (index, key) => deltasMap.set(key, Math.abs(i - index))
  )

  i = itemsCount

  // Fill nextBlocks and deltasMap
  while (i--) {
    const $item = $nextItems.at(i)
    let block = lookupMap.get($item)

    if (!block) {
      // Create new block
      block = trackedEachBlock($item, i)
      block.c()
      effects.push(block.e)
    } else {
      // update code
      const nextIndex = i

      effects.unshift(() => $indexesMap.get($item)!.set(nextIndex))
    }

    nextBlocks[i] = block
    nextLookupMap.set($item, block)

    setDeltasFromOldIndexes(i)
  }

  const willMoveKeysMap = new Set()
  const didMoveKeysMap = new Set()
  const insert = (block: Block) => {
    block.m(parentNode, next || null)
    lookupMap.set(block.k, block)
    next = block.n()
    itemsCount--
  }

  // Sync DOM with new items
  while (prevBlocksCount && itemsCount) {
    const nextBlock = nextBlocks[itemsCount - 1]
    const prevBlock = prevBlocks[prevBlocksCount - 1]
    const nextKey = nextBlock.k
    const prevKey = prevBlock.k

    if (nextBlock === prevBlock) {
      // do nothing
      next = nextBlock.n()
      prevBlocksCount--
      itemsCount--
    } else if (!nextLookupMap.has(prevKey)) {
      // remove old block
      destroy(prevBlock)
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
      destroy(prevBlock)
    }
  }

  // Insert rest new blocks
  // `nextItemsCount` modified in `insert`
  // eslint-disable-next-line no-unmodified-loop-condition
  while (itemsCount) {
    insert(nextBlocks[itemsCount - 1])
  }

  effects.forEach(effect => effect())

  return nextBlocks
}

function withTrackedEachBlock(
  each: Each<ListStore<AnyList>>,
  $indexesMap: $IndexesMap
) {
  return (v: AnyStore, index: number) => {
    const $index = atom(index)
    const block = childToBlock(each(v, $index))

    block.k = v
    $indexesMap.set(v, $index)

    return block
  }
}

function createEachBlocks(
  lookupMap: LookupMap,
  trackedEachBlock: TrackedEachBlock,
  $items: ListStore<AnyList>,
  itemsCount: number
) {
  let block: Block

  return Array.from({
    length: itemsCount
  }, (_, i) => {
    block = trackedEachBlock($items.at(i), i)
    lookupMap.set(block.k, block)

    return block
  })
}

/**
 * Render each item in the list store
 * @param $items - Static array or store
 * @returns Function that accepts each and else functions and returns Block that renders each item
 */
export function for$<T extends AnyList | ListStore<AnyList>>($items: T) {
  /**
   * Render each item in the list store
   * @param each$ - Function that returns block for each item
   * @param else$ - Optional block that renders when list is empty
   * @returns Block that renders each item
   */
  return (
    each$: Each<T>,
    else$: () => PrimitiveChild = noop
  ) => {
    if (isStore($items)) {
      const blocksMap: LookupMap = new Map()
      const $indexesMap: $IndexesMap = new Map()
      const trackedEachBlock = withTrackedEachBlock(each$ as Each<ListStore<AnyStore>>, $indexesMap)
      let blocks: Block[] | null
      let fragment: Block | null
      let placeholder: PrimitiveChild

      return addEffects(
        () => () => {
          fragment = null
          placeholder = null
        },
        decide<T[]>($items, (items, prevItems) => {
          const itemsCount = items.length
          const prevItemsCount = prevItems?.length

          if (itemsCount) {
            fragment ||= createBlockFromBlocks(() => blocks, () => {
              blocksMap.clear()
              blocks = null
            })

            if (prevItemsCount) {
              // [...n] -> [...n1]
              blocks = sync(
                fragment.n()!.parentNode!,
                blocksMap,
                $indexesMap,
                trackedEachBlock,
                blocks!,
                $items,
                itemsCount
              )
            } else {
              // [] -> [...n]
              placeholder = null
              blocks = createEachBlocks(
                blocksMap,
                trackedEachBlock,
                $items,
                itemsCount
              )
            }

            return fragment
          }

          // [...n] | [] -> []
          // eslint-disable-next-line no-return-assign
          return placeholder ??= else$()
        })
      )
    }

    return createFragment(
      $items?.length
        ? $items.map(each$ as Each<AnyList>)
        : else$()
    )
  }
}
