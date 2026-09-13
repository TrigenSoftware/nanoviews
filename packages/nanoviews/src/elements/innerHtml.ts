import {
  type Signalish,
  isAccessor,
  deferEffect
} from 'kida'
import { lazyChild } from '../internals/index.js'

/**
 * Dangerously set inner HTML to element
 * @param factory - Element description or factory
 * @param $html - HTML string or store with it
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function dangerouslySetInnerHtml<T extends Element>(
  factory: () => T,
  $html: Signalish<string>
) {
  return lazyChild(() => {
    const element = factory()

    if (isAccessor($html)) {
      deferEffect(() => {
        element.innerHTML = $html()
      }, true)
    } else {
      element.innerHTML = $html
    }

    return element
  })
}
