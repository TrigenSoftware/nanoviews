import type { Child } from 'nanoviews'

/**
 * Mount an app into a node. It works in the client bundle only, where
 * `nanoviews` builds DOM: the server has no nodes to mount into, and renders
 * an app to markup with `renderToString`
 * @param app - App function to mount app
 * @param target - The node to mount into
 * @returns A function to unmount the app
 */
export function mount(app: () => Child, target: ParentNode): () => void

export function mount(): () => void {
  throw new Error('mount works in the client bundle only, the server renders an app with renderToString')
}
