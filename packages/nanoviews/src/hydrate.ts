import {
  type DeferredScope,
  batch,
  deferScope,
  startScope,
  stopScope
} from 'kida'
import {
  type Child,
  type MaybeDestroy,
  hydrateChild
} from './internals/index.js'

/**
 * Hydrate the markup `renderToString` rendered for an app: the app is built
 * the way `mount` builds it, but from the nodes already in the target, which
 * get its bindings, handlers and effects instead of being made anew
 * @param app - App function the markup was rendered from
 * @param target - The node that holds the markup
 * @returns A function to unmount the app
 */
export function hydrate(app: () => Child, target: ParentNode) {
  let unmount: MaybeDestroy
  let scope!: DeferredScope

  // Batch defers render- and destroy-time signal writes until the phase completes
  batch(
    () => startScope(
      scope = deferScope(() => unmount = hydrateChild(target, app()))
    )
  )

  return () => {
    batch(() => stopScope(scope))
    unmount?.()
  }
}
