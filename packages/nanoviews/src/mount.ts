import {
  type Block,
  type Effect,
  captureEffects,
  runEffects,
  runDestroys
} from './internals/index.js'

/**
 * Mount an app into a node
 * @param app - App function to create app block
 * @param node - The node to mount into
 * @returns A function to unmount the block
 */
export function mount(app: () => Block, node: Node) {
  const effects: Effect[] = []
  const block = captureEffects(effects, app)

  block.m(node)

  const destroys = runEffects(effects)

  return () => {
    runDestroys(destroys)
    block.d()
  }
}
