import {
  type Queries,
  type queries as defaultQueries,
  getQueriesForElement,
  prettyDOM
} from '@testing-library/dom'

export * from '@testing-library/dom'

interface Block {
  c(): void
  m(target: Node, anchor?: Node | null): Node | null
  e(): void
  d(): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockCreator = readonly [(...args: any[]) => Block, ...unknown[]]

interface ContainerCacheEntry {
  container: HTMLElement
  target: HTMLElement
  block: Block
}

export interface RenderOptions<Q extends Queries = typeof defaultQueries> {
  target?: HTMLElement
  container?: HTMLElement
  queries?: Q
}

const containerCache = new Set<ContainerCacheEntry>()
const blockCache = new Set<Block>()

/**
 * Render a Component Block into the Document.
 * @param blockCreator - The Component Block to render or a block creator
 * @param renderOptions - Options to customize the render
 * @returns An object with utilities to interact with the rendered block
 */
export function render<Q extends Queries = typeof defaultQueries>(blockCreator: Block | BlockCreator, renderOptions: RenderOptions<Q> = {}) {
  const { queries } = renderOptions
  const container = renderOptions.container || document.body
  const target = renderOptions.target || container.appendChild(document.createElement('div'))
  let block: Block

  if (Array.isArray(blockCreator)) {
    const [creator, ...args] = blockCreator as BlockCreator

    block = creator(...args)
  } else {
    block = blockCreator as Block
  }

  block.c()
  block.m(target)
  block.e()

  containerCache.add({
    container,
    target,
    block
  })
  blockCache.add(block)

  return {
    container,
    block,
    debug(el: HTMLElement = container) {
      console.log(prettyDOM(el))
    },
    destroy() {
      if (blockCache.has(block)) {
        block.d()
        blockCache.delete(block)
      }
    },
    ...getQueriesForElement<Q>(container, queries)
  }
}

function cleanupAtContainer(cached: ContainerCacheEntry) {
  const { target, block } = cached

  if (blockCache.has(block)) {
    try {
      block.d()
    } catch {
      // Block can be destroyed in the test
    }

    blockCache.delete(block)
  }

  if (target.parentNode === document.body) {
    document.body.removeChild(target)
  }

  containerCache.delete(cached)
}

/**
 * Unmounts trees that were mounted with render.
 */
export function cleanup() {
  for (const cached of containerCache) {
    cleanupAtContainer(cached)
  }
}
