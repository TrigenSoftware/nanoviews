import {
  type Children,
  elementChildren
} from '../internals/index.js'

/**
 * Attach shadow to element
 * @param factory - Element factory
 * @param options - Shadow root options
 * @returns Factory that accepts children
 */
export function shadow<T extends Element>(
  factory: () => T,
  options: ShadowRootInit
) {
  const element = factory()
  const shadow = element.attachShadow(options)

  return elementChildren.bind(shadow, element) as (...children: Children) => T
}
