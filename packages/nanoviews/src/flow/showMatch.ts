import {
  $get,
  computed
} from 'kida'
import {
  type Child,
  show,
  lazyChild
} from '../internals/index.js'
import { default_ } from './switch.js'

export type ShowMatchCase = readonly [unknown, () => Child]

/**
 * Show the child of the first case that holds. Unlike `match_`, which builds
 * the child of a case anew each time the case comes up, every case is built
 * once and parked while another one holds, the way `show_` parks it.
 *
 * A case child takes no value: it lives while its case does not hold as well,
 * where a value narrowed to the truthy side would be a lie. The walk is the
 * one of `match_`: the first `default_` in the list is the one that answers,
 * and a case below the one that holds is never read.
 * @param cases - Cases to decide from
 * @returns Block that shows the child of the case that holds
 */
/* @__NO_SIDE_EFFECTS__ */
export function show_match_(...cases: ShowMatchCase[]) {
  return lazyChild(() => {
    const fallback = cases.find(matchCase => matchCase[0] === default_)
    const $matched = computed(() => cases.find(
      matchCase => matchCase[0] !== default_ && $get(matchCase[0])
    ) || fallback)
    const fragment = document.createDocumentFragment()

    cases.forEach((matchCase) => {
      fragment.append(show(() => $matched() === matchCase, matchCase[1]))
    })

    return fragment
  })
}
