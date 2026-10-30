import type { Child } from 'nanoviews'
import {
  createScope,
  deferScope,
  stopScope
} from 'kida'
import {
  state,
  createState,
  enter,
  renderChild
} from './internals/render.js'

/**
 * Render an app to an HTML string, synchronously. The app is built the way
 * `mount` builds it, in a scope that is stopped as soon as the markup is
 * written: the computeds and effects the render created let go of the
 * stores they read, which may outlive the request
 * @param app - App function to render, as for `mount`
 * @returns The HTML of the app
 */
export function renderToString(app: () => Child) {
  const outer = enter(createState())
  // The render runs in a scope created under this one: a render that throws
  // hands no scope back, and this one stops it all the same
  const scope = createScope()

  try {
    deferScope(() => {
      renderChild(app())
    }, scope)

    return state.html
  } finally {
    // The state of the outer render, or the empty one, is back first, so a
    // cleanup that throws holds on to nothing of this render
    enter(outer)
    stopScope(scope)
  }
}
