
import {
  type ValueOrSignal,
  subscribe
} from '../internals/index.js'

/**
 * Dangerously set inner HTML to element
 * @param factory - Element factory
 * @param $html - HTML string or store with it
 * @returns Target element
 */
export function dangerouslySetInnerHtml<T extends Element>(
  factory: () => T,
  $html: ValueOrSignal<string>
) {
  const element = factory()

  subscribe($html, value => element.innerHTML = value)

  return element
}
