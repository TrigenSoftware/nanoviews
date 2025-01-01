import {
  isSignal,
  subscribeLater
} from 'kida'
import {
  type Block,
  type ValueOrSignal,
  addEffect
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

  if (isSignal($html)) {
    addEffect(
      subscribeLater($html, value => sealedBlock.n!.innerHTML = value)
    )
  } else {
    sealedBlock.n!.innerHTML = $html
  }

  return sealedBlock
}
