import { deferScope } from 'kida'
import {
  type Child,
  type MaybeDestroy,
  mountChild,
  defineProtoProp
} from './internals/index.js'

/**
 * Mount an app into a node
 * @param app - App function to mount app
 * @param target - The node to mount into
 * @returns A function to unmount the app
 */
export function mount(app: () => Child, target: ParentNode) {
  defineProtoProp('__mp', false)
  // @ts-expect-error Mark as mount point
  target.__mp = true

  let unmount: MaybeDestroy
  const start = deferScope(() => unmount = mountChild(target, app()))
  const destroy = start()

  return () => {
    destroy()
    unmount?.()
  }
}
