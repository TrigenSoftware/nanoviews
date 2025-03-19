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
  PrimitiveChild
} from '../types/index.js'
import {
  $$key,
  $$index,
  $$first,
  $$next,
  $$prev,
  $$destroyEffect,
  $$node,
  $$mount,
  $$destroy
} from '../symbols.js'
import {
  createEffectScopeWithContext,
  effectScopeSwapper
} from '../effects.js'
import {
  childToBlock,
  linkChild
} from '../elements/child.js'
import {
  type Block,
  HostBlock,
  destroyLinkedBlocks
} from '../block.js'

type LookupMap = Map<unknown, Block>

type AnyEach = (
  item: AnySignal,
  index: ReadableSignal<number>
) => PrimitiveChild

type UnknownTrack = (item: unknown, index: number) => unknown

type CreateEachBlock = (key: unknown, index: number) => Block

function getAnchor(block: Block | undefined, fallback: Node | null | undefined) {
  return block === undefined ? fallback : block[$$node]
}

function reconcile(
  loop: LoopBlock,
  lookupMap: LookupMap,
  track: UnknownTrack,
  createEachBlock: CreateEachBlock,
  nextItems: unknown[]
) {
  const { length } = nextItems
  const parentNode = loop[$$node]?.parentNode
  const anchor = loop[$$next]?.[$$node]
  let seen: Set<Block> | undefined
  let matched: Block[] = []
  let stashed: Block[] = []
  let prev: Block | undefined
  let current = loop[$$first]

  for (let i = 0, value: unknown, key: unknown, block: Block | undefined; i < length; i += 1) {
    value = nextItems[i]
    key = track(value, i)
    block = lookupMap.get(key)

    if (block === undefined) {
      block = createEachBlock(key, i)

      if (parentNode) {
        block[$$mount](parentNode, getAnchor(current, anchor))
      }

      block[$$prev] = prev
      block[$$next] = prev === undefined ? loop[$$first] : prev[$$next]

      lookupMap.set(key, block)

      linkChild(
        loop,
        prev,
        block[$$next],
        block
      )

      matched = []
      stashed = []

      prev = block
      current = block[$$next]
      continue
    }

    block[$$index]!(i)

    if (block !== current) {
      if (seen !== undefined && seen.has(block)) {
        if (matched.length < stashed.length) {
          const [start] = stashed
          let j

          prev = start[$$prev]

          const [a] = matched
          const b = matched[matched.length - 1]

          for (j = 0; j < matched.length; j += 1) {
            matched[j][$$mount](parentNode!, getAnchor(start, anchor))
          }

          for (j = 0; j < stashed.length; j += 1) {
            seen.delete(stashed[j])
          }

          linkChild(loop, a[$$prev], b[$$next])
          linkChild(loop, prev, a)
          linkChild(loop, b, start)

          current = start
          prev = b
          i -= 1

          matched = []
          stashed = []
        } else {
          seen.delete(block)
          block[$$mount](parentNode!, getAnchor(current, anchor))

          linkChild(loop, block[$$prev], block[$$next])
          linkChild(loop, block, prev === undefined ? loop[$$first] : prev[$$next])
          linkChild(loop, prev, block)

          prev = block
        }

        continue
      }

      matched = []
      stashed = []

      while (current !== undefined && current[$$key] !== key) {
        (seen ??= new Set()).add(current)
        stashed.push(current)
        current = current[$$next]
      }

      if (current === null) {
        continue
      }

      block = current
    }

    matched.push(block!)
    prev = block
    current = block![$$next]
  }

  if (current !== undefined || seen !== undefined) {
    if (seen !== undefined) {
      seen.forEach(block => destroyLoopChild(loop, block, lookupMap))
    }

    while (current !== undefined) {
      prev = current
      current = current[$$next]
      destroyLoopChild(loop, prev, lookupMap)
    }
  }
}

function destroyLoopChild(parent: Block, block: Block, lookupMap: LookupMap) {
  block[$$destroyEffect]!()
  block[$$destroyEffect] = undefined
  block[$$destroy]()
  lookupMap.delete(block[$$key])
  linkChild(parent, block[$$prev], block[$$next])
}

function createEachBlockCreator(
  $items: WritableSignal<unknown[]>,
  each$: AnyEach
) {
  return (key: unknown, i: number) => {
    const $index = signal(i)
    let block: Block
    const destroy = effectScope(() => block = childToBlock(
      each$(atIndex($items, $index), $index)
    ))

    block![$$key] = key
    block![$$destroyEffect] = destroy
    block![$$index] = $index

    return block!
  }
}

export class LoopBlock extends HostBlock {
  #isPlaceholder = false
  readonly #effectScope = createEffectScopeWithContext()
  readonly #createEachBlock: CreateEachBlock
  readonly #else$: () => PrimitiveChild
  readonly #track: UnknownTrack
  readonly #blocksMap: LookupMap = new Map()

  constructor(
    $items: WritableSignal<unknown[]>,
    each$: AnyEach,
    else$: () => PrimitiveChild,
    track: UnknownTrack = (_, i) => i
  ) {
    super()

    this.#createEachBlock = createEachBlockCreator(
      $items,
      each$
    )
    this.#else$ = else$
    this.#track = track

    effectScopeSwapper($items, this.#swapper.bind(this))
  }

  #swapper(
    destroyPrev: Destroy | undefined,
    items: unknown[],
    prevItems: unknown[] | undefined
  ) {
    const effectScope = this.#effectScope
    const createEachBlock = this.#createEachBlock
    const itemsCount = items.length
    const prevItemsCount = prevItems?.length

    if (itemsCount) {
      if (prevItemsCount) {
        // [...m] -> [...n]
        // swap
        return effectScope(() => {
          startBatch()
          reconcile(
            this,
            this.#blocksMap,
            this.#track,
            createEachBlock,
            items
          )
          endBatch()
        }, true)()
      }

      // [] -> [...n]

      destroyPrev?.()
      this.#isPlaceholder = false

      const prevBlock = this[$$first]

      this[$$first] = undefined

      const runEffects = effectScope(() => {
        reconcile(
          this,
          this.#blocksMap,
          this.#track,
          createEachBlock,
          items
        )
      }, true)

      // swap
      if (destroyPrev) {
        const prevNode = prevBlock![$$node]!

        this[$$mount](prevNode.parentNode!, prevNode)
        prevBlock![$$destroy]()

        return runEffects()
      }

      // initial
      return runEffects
    } else if (!this.#isPlaceholder) {
      // ([...n] | []) -> []

      destroyPrev?.()
      this.#isPlaceholder = true

      const prevBlock = this[$$first]
      const runEffects = effectScope(
        () => this[$$first] = childToBlock(this.#else$()),
        true
      )

      // swap
      if (destroyPrev) {
        const prevNode = prevBlock![$$node]!

        this[$$first]![$$mount](prevNode.parentNode!, prevNode)
        destroyLinkedBlocks(prevBlock)
        this.#blocksMap.clear()

        return runEffects()
      }

      // initial
      return runEffects
    }

    return destroyPrev!
  }
}
