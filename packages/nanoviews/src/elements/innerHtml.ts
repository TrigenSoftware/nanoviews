
import {
  type ValueOrAccessor,
  subscribeAny
} from 'kida'

/**
 * Dangerously set inner HTML to element
 * @param factory - Element factory
 * @param $html - HTML string or store with it
 * @returns Target element
 */
export function dangerouslySetInnerHtml<T extends Element>(
  factory: () => T,
  $html: ValueOrAccessor<string>
) {
  const element = factory()

  subscribeAny($html, value => element.innerHTML = value)

  return element
}
