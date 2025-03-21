import {
  type Queries,
  type queries as defaultQueries,
  getQueriesForElement,
  prettyDOM
} from '@testing-library/dom'
import {
  type Block,
  type Destroy,
  mount
} from 'nanoviews'

export * from '@testing-library/dom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockCreator = readonly [(...args: any[]) => Block, ...unknown[]]

type App = () => Block

interface ContainerCacheEntry {
  container: HTMLElement
  target: HTMLElement
  block: Block
  unmount: Destroy
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
export function render<Q extends Queries = typeof defaultQueries>(blockCreator: BlockCreator | App, renderOptions: RenderOptions<Q> = {}) {
  const { queries } = renderOptions
  const container = renderOptions.container || document.body
  const target = renderOptions.target || container.appendChild(document.createElement('div'))
  let block: Block
  let unmount: Destroy

  try {
    if (Array.isArray(blockCreator)) {
      const [creator, ...args] = blockCreator as BlockCreator

      unmount = mount(() => block = creator(...args), target)
    } else if (typeof blockCreator === 'function') {
      unmount = mount(() => block = blockCreator(), target)
    } else {
      throw new Error('Invalid block creator. Expected a function.')
    }
  } catch (error) {
    if (target.parentNode === document.body) {
      document.body.removeChild(target)
    }

    throw error
  }

  containerCache.add({
    container,
    target,
    block: block!,
    unmount
  })
  blockCache.add(block!)

  return {
    container,
    block: block!,
    debug(el: HTMLElement = container) {
      console.log(prettyDOM(el))
    },
    destroy() {
      if (blockCache.has(block)) {
        unmount()
        blockCache.delete(block)
      }
    },
    ...getQueriesForElement<Q>(container, queries)
  }
}

function cleanupAtContainer(cached: ContainerCacheEntry) {
  const { target, block, unmount } = cached

  if (blockCache.has(block)) {
    // Block can be destroyed in the test
    try {
      unmount()
    } finally {
      blockCache.delete(block)
    }
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
