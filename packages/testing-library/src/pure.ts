import {
  type Queries,
  type queries as defaultQueries,
  getQueriesForElement,
  prettyDOM
} from '@testing-library/dom'
import {
  type Child,
  type Destroy,
  mount
} from 'nanoviews'

export * from '@testing-library/dom'

type App = () => Child

interface ContainerCacheEntry {
  container: HTMLElement
  target: HTMLElement
  unmount: Destroy
}

export interface RenderOptions<Q extends Queries = typeof defaultQueries> {
  target?: HTMLElement
  container?: HTMLElement
  queries?: Q
}

const containerCache = new Set<ContainerCacheEntry>()
const unmountCache = new Set<Destroy>()

/**
 * Mount an app into the document.
 * @param app - App function to mount, such as a component instance or a called composed story
 * @param renderOptions - Options to customize the render
 * @returns An object with utilities to interact with the rendered app
 */
export function render<Q extends Queries = typeof defaultQueries>(app: App, renderOptions: RenderOptions<Q> = {}) {
  const { queries } = renderOptions
  const container = renderOptions.container || document.body
  const target = renderOptions.target || container.appendChild(document.createElement('div'))
  let unmount: Destroy

  try {
    unmount = mount(app, target)
  } catch (error) {
    if (target.parentNode === document.body) {
      document.body.removeChild(target)
    }

    throw error
  }

  containerCache.add({
    container,
    target,
    unmount
  })
  unmountCache.add(unmount)

  return {
    container,
    debug(el: HTMLElement = container) {
      console.log(prettyDOM(el))
    },
    destroy() {
      if (unmountCache.has(unmount)) {
        unmount()
        unmountCache.delete(unmount)
      }
    },
    ...getQueriesForElement<Q>(container, queries)
  }
}

function cleanupAtContainer(cached: ContainerCacheEntry) {
  const { target, unmount } = cached

  if (unmountCache.has(unmount)) {
    // Block can be destroyed in the test
    try {
      unmount()
    } finally {
      unmountCache.delete(unmount)
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
