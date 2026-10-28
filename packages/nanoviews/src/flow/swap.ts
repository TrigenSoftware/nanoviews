import {
  type Signalish,
  isAccessor
} from 'kida'
import {
  type Child,
  swap,
  lazyChild
} from '../internals/index.js'

/**
 * Render a child decided by a value. Unlike a binding, which updates content
 * in place, the child is built anew every time the value changes.
 * @param $value - Static value or store
 * @param render - Function that returns child for the value
 * @returns Block that renders the child and swaps it on change
 */
export function swap_<T>(
  $value: Signalish<T>,
  render: (value: T) => Child
) {
  // A static value decides at once, and its child is built in its place all
  // the same, under the injection context of where the block is put
  return lazyChild(
    isAccessor($value)
      ? () => swap($value, render)
      : () => render($value)
  )
}
