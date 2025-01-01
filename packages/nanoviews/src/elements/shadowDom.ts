import {
  type Block,
  type Children,
  ShadowBlock
} from '../internals/index.js'

/**
 * Attach shadow to a block
 * @param block - Target block
 * @param options - Shadow root options
 * @returns Block
 */
export function shadow<T extends Element>(
  block: (child: Block) => Block<T>,
  options: ShadowRootInit
) {
  return (...children: Children) => block(new ShadowBlock(children, options))
}
