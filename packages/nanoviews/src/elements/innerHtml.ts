
import {
  type Block,
  type ValueOrSignal,
  $$node,
  subscribe
} from '../internals/index.js'

/**
 * Dangerously set inner HTML to element block
 * @param block - Target element block
 * @param $html - HTML string or store with it
 * @returns Target element block
 */
export function dangerouslySetInnerHtml<T extends Element>(
  block: () => Block<T>,
  $html: ValueOrSignal<string>
) {
  const sealedBlock = block()

  subscribe($html, value => sealedBlock[$$node]!.innerHTML = value)

  return sealedBlock
}
