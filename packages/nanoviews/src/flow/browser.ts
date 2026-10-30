import {
  type Child,
  createBlock,
  removeBetween,
  insertChildBeforeAnchor,
  fresh,
  lazyChild
} from '../internals/index.js'

/**
 * Render a child in the browser only: code that needs the browser, such as
 * `window` or `localStorage`, never runs on the server. The server writes the
 * fallback in its place, such as a skeleton, and hydration replaces it with
 * the child. A mounted app never builds the fallback.
 * @param render - Function that returns the child
 * @param fallback - Function that returns what the server writes instead
 * @returns Block that renders the child
 */
export function browser_(render: () => Child, fallback?: () => Child): Child

/* @__NO_SIDE_EFFECTS__ */
export function browser_(render: () => Child) {
  return lazyChild(() => {
    const [fragment, start, end] = createBlock()

    // Hydration takes the block from the markup with the fallback in it: the
    // child is built fresh in its place
    removeBetween(start, end)
    fresh(() => insertChildBeforeAnchor(render(), end))

    return fragment
  })
}
