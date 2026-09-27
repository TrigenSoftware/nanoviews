import {
  type SignalishValue,
  type Signalish,
  isAccessor,
  computed
} from 'kida'
import {
  type Child,
  show,
  lazyChild
} from '../internals/index.js'
import {
  type SwitchCase,
  default_
} from './switch.js'

/**
 * Decide which child to show based on switch cases. Unlike `switch_`, which
 * builds the child of a case anew each time the case comes up, every case is
 * built once and parked while another one holds, the way `show_` parks it.
 * @param $value - Static value or store
 * @returns Function that accepts cases and returns Block that shows decided child
 */
/* @__NO_SIDE_EFFECTS__ */
export function show_switch_<T>($value: Signalish<T>) {
  type Value = SignalishValue<T>

  /**
   * Decide which child to show based on switch cases
   * @param cases - Cases to decide from
   * @returns Block that shows decided child
   */
  return (...cases: SwitchCase<Value>[]) => {
    const casesMap = new Map<unknown, () => Child>(cases)

    if (isAccessor($value)) {
      return lazyChild(() => {
        // The key of the case that holds: a write that keeps it wakes no case
        const $key = computed(() => {
          const value = $value()

          return casesMap.has(value) ? value : default_
        })
        const fragment = document.createDocumentFragment()

        casesMap.forEach((render, key) => {
          fragment.append(show(() => $key() === key, render))
        })

        return fragment
      })
    }

    // A case child is a function, never falsy, so `||` tells a hit from a miss
    return (casesMap.get($value) || casesMap.get(default_))?.()
  }
}
