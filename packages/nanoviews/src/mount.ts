import { effectScope } from 'kida'
import {
  type Block,
  $$mount,
  $$destroy
} from './internals/index.js'

/**
 * Mount an app into a node
 * @param app - App function to create app block
 * @param node - The node to mount into
 * @returns A function to unmount the block
 */
export function mount(app: () => Block, node: Node) {
  let block: Block
  const start = effectScope(() => block = app(), true)

  block![$$mount](node)

  const destroy = start()

  return () => {
    destroy()
    block[$$destroy]()
  }
}
