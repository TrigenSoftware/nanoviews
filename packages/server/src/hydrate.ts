import type { Child } from 'nanoviews'

/**
 * Hydrate the markup of an app. It works in the client bundle only, where
 * `nanoviews` builds DOM: the server renders the markup to hydrate with
 * `renderToString`
 * @param app - App function the markup was rendered from
 * @param target - The node that holds the markup
 * @returns A function to unmount the app
 */
export function hydrate(app: () => Child, target: ParentNode): () => void

export function hydrate(): () => void {
  throw new Error('hydrate works in the client bundle only, the server renders an app with renderToString')
}
