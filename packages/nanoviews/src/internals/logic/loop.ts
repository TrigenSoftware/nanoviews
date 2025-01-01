import {
  type ReadableSignal,
  type WritableSignal,
  type AnySignal,
  signal,
  subscribeLater,
  atIndex
} from 'kida'
import type {
  Effect,
  Destroy,
  PrimitiveChild
} from '../types/index.js'
import { childToBlock } from '../elements/child.js'
import { Block } from '../block.js'
import {
  addEffect,
  runEffects,
  runDestroys,
  captureEffects
} from '../effects.js'
import {
  getContext,
  run
} from './context.js'

type LookupMap = Map<unknown, Block>

type IndexMap = Map<unknown, number>

type IndexesMap = Map<unknown, WritableSignal<number>>

type EffectsMap = Map<Block, Effect[]>

type DestroysMap = Map<Block, Destroy[]>

type AnyEach = (
  item: AnySignal,
  index: ReadableSignal<number>
) => PrimitiveChild

type UnknownTrack = (item: unknown, index: number) => unknown

type CreateEachBlock = (item: unknown, index: number) => Block

// eslint-disable-next-line max-params
function sync(
  parentNode: Node,
  lookupMap: LookupMap,
  indexesMap: IndexesMap,
  effectsMap: EffectsMap,
  destroysMap: DestroysMap,
  track: UnknownTrack,
  createEachBlock: CreateEachBlock,
  prevBlocks: Block[],
  nextItems: unknown[],
  nextItemsCount: number
) {
  const destroy = (block: Block) => {
    lookupMap.delete(block.k)
    indexesMap.delete(block.k)
    runDestroys(destroysMap.get(block))
    destroysMap.delete(block)
    block.d()
  }
  let itemsCount = nextItemsCount
  let prevBlocksCount = prevBlocks.length
  let i = prevBlocksCount
  let next: Node | null | undefined
  const oldIndexes: IndexMap = new Map()
  const effects = []

  while (i--) {
    oldIndexes.set(prevBlocks[i].k, i)
  }

  const nextBlocks = []
  const nextLookupMap: LookupMap = new Map()
  const deltasMap: IndexMap = new Map()
  const setDeltasFromOldIndexes = (i: number) => {
    for (const [key, index] of oldIndexes) {
      deltasMap.set(key, Math.abs(i - index))
    }
  }

  i = itemsCount

  // Fill nextBlocks and deltasMap
  while (i--) {
    const key = track(nextItems[i], i)
    let block = lookupMap.get(key)

    if (block) {
      // update code
      const nextIndex = i

      effects.push(() => indexesMap.get(key)!.set(nextIndex))
    } else {
      // Create new block
      block = createEachBlock(nextItems[i], i)
      effects.push(() => {
        destroysMap.set(block!, runEffects(effectsMap.get(block!)!))
        effectsMap.delete(block!)
      })
    }

    nextBlocks[i] = block
    nextLookupMap.set(key, block)

    setDeltasFromOldIndexes(i)
  }

  const willMoveKeysMap = new Set()
  const didMoveKeysMap = new Set()
  const insert = (block: Block) => {
    block.m(parentNode, next)
    lookupMap.set(block.k, block)
    next = block.n
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
      next = nextBlock.n
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

  const effectsCount = effects.length

  if (effectsCount) {
    for (let i = effectsCount - 1; i >= 0 ; i--) {
      effects[i]()
    }
  }

  return nextBlocks
}

function createEachBlockCreator(
  $items: WritableSignal<unknown[]>,
  each$: AnyEach,
  track: UnknownTrack,
  indexesMap: IndexesMap,
  effectsMap: EffectsMap
) {
  return (item: unknown, i: number) => {
    const $index = signal(i)
    const $item = atIndex($items, $index)
    const k = track(item, i)
    const effects: Effect[] = []
    const block = childToBlock(
      captureEffects(
        effects,
        () => each$($item, $index)
      )
    )

    block.k = k
    indexesMap.set(k, $index)
    effectsMap.set(block, effects)

    return block
  }
}

export class LoopBlock extends Block {
  #blocks: Block[] | undefined
  #placeholder: Block | undefined

  constructor(
    $items: WritableSignal<unknown[]>,
    each$: AnyEach,
    else$: () => PrimitiveChild,
    track: UnknownTrack = (_, i) => i
  ) {
    super()

    const context = getContext()
    const effectsMap: EffectsMap = new Map()
    const destroysMap: DestroysMap = new Map()
    const blocksMap: LookupMap = new Map()
    const indexesMap: IndexesMap = new Map()
    const createEachBlock = createEachBlockCreator(
      $items,
      each$,
      track,
      indexesMap,
      effectsMap
    )
    const runEffectsMap = () => effectsMap.forEach(
      (effects, block) => destroysMap.set(block, runEffects(effects))
    )
    const runDestroysMap = () => destroysMap.forEach(
      destroys => runDestroys(destroys)
    )
    const subscribeEffect = subscribeLater($items, (items, prevItems) => {
      const itemsCount = items.length
      const prevItemsCount = prevItems?.length

      if (itemsCount) {
        if (prevItemsCount) {
          // [...n] -> [...n1]
          // swap
          this.#blocks = run(context, () => sync(
            this.n!.parentNode!,
            blocksMap,
            indexesMap,
            effectsMap,
            destroysMap,
            track,
            createEachBlock,
            this.#blocks!,
            items,
            itemsCount
          ))
        } else {
          // [] -> [...n]
          // initial
          this.#blocks = Array(itemsCount)

          effectsMap.clear()

          run(context, () => {
            for (let i = 0, block; i < itemsCount; i++) {
              block = this.#blocks![i] = createEachBlock(items[i], i)
              blocksMap.set(block.k, block)
            }
          })

          // swap
          if (this.#placeholder) {
            const prevNode = this.#placeholder.n!

            this.#mountBlocks(prevNode.parentNode!, prevNode)
            runDestroys(destroysMap.get(this.#placeholder))
            destroysMap.clear()
            this.#destroyPlaceholder()
            runEffectsMap()
            effectsMap.clear()
          }
        }
      } else if (!this.#placeholder) {
        // ([...n] | []) -> []
        // initial
        const effects: Effect[] = []

        this.#placeholder = childToBlock(
          captureEffects(
            effects,
            () => run(context, else$)
          )
        )

        effectsMap.clear()
        effectsMap.set(this.#placeholder, effects)

        // swap
        if (this.#blocks) {
          const prevNode = this.#blocks[0].n!

          this.#placeholder.m(prevNode.parentNode!, prevNode)
          runDestroysMap()
          destroysMap.clear()
          this.#destroyBlocks()
          destroysMap.set(this.#placeholder, runEffects(effects))
          effectsMap.clear()
          blocksMap.clear()
          indexesMap.clear()
        }
      }
    })

    addEffect(() => {
      const unsubscribe = subscribeEffect()

      runEffectsMap()

      return () => {
        unsubscribe()
        runDestroysMap()
      }
    })
  }

  #mountBlocks(target: Node, anchor?: Node | null) {
    const blocks = this.#blocks!
    const len = blocks.length

    if (len) {
      for (let i = 0; i < len; i++) {
        blocks[i].m(target, anchor)
      }
    }
  }

  #destroyBlocks() {
    const blocks = this.#blocks!
    const len = blocks.length

    if (len) {
      for (let i = 0; i < len; i++) {
        blocks[i].d()
      }
    }

    this.#blocks = undefined
  }

  #destroyPlaceholder() {
    this.#placeholder!.d()
    this.#placeholder = undefined
  }

  get n() {
    const blocks = this.#blocks

    return (blocks ? blocks[0]?.n : this.#placeholder?.n) as Node | null
  }

  m(target: Node, anchor?: Node | null) {
    if (this.#blocks) {
      this.#mountBlocks(target, anchor)
    } else {
      this.#placeholder!.m(target, anchor)
    }
  }

  d() {
    if (this.#blocks) {
      this.#destroyBlocks()
    } else {
      this.#destroyPlaceholder()
    }
  }
}
