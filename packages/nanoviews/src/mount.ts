import { effectScope } from 'kida'
import {
  type Child,
  type Destroy,
  mountChild,
  defineProtoProp
} from './internals/index.js'

/**
 * Mount an app into a node
 * @param app - App function to create app
 * @param target - The node to mount into
 * @returns A function to unmount the app
 */
export function mount(app: () => Child, target: ParentNode) {
  defineProtoProp('__mp', false)
  // @ts-expect-error Mark as mount point
  target.__mp = true

  let unmount: Destroy
  const start = effectScope(() => unmount = mountChild(target, app()), true)
  const destroy = start()

  return () => {
    destroy()
    unmount()
  }
}
