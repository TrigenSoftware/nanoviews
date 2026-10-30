import {
  type Accessor,
  deferEffect,
  untracked,
  boundDeferScope,
  startScope,
  pauseScope,
  resumeScope
} from 'kida'
import type { Child } from '../types/index.js'
import {
  createBlock,
  insertChildBeforeAnchor,
  fresh
} from '../elements/dom.js'
import { extractBetween } from '../elements/child.js'

export function show(
  $value: Accessor<unknown>,
  render: () => Child
) {
  const [fragment, start, end] = createBlock()
  const hidden = !untracked($value)
  const build = () => insertChildBeforeAnchor(render(), end)
  // The first pass hands the whole tree over in its initial state: the
  // content is built right here, under the caller's injection context, and
  // held back - the toggle below owns its starts, so a value flipped
  // before the first one never wakes the tree. Hidden content has no part
  // in the server markup, so it is built fresh
  const scope = boundDeferScope()(hidden ? () => fresh(build) : build)
  // The parked fragment doubles as the hidden flag, and `noDefer` effects
  // keep the parked DOM up to date
  let parked: DocumentFragment | undefined

  pauseScope(scope)

  if (hidden) {
    parked = extractBetween(start, end)
  }

  deferEffect(() => {
    if ($value()) {
      if (parked !== undefined) {
        end.before(parked)
        parked = undefined
      }

      // The first show claims the deferral token, every next one only
      // lifts the pause; whichever applies, the other is a no-op
      resumeScope(startScope(scope))
    } else if (parked === undefined) {
      // Cleanups run first, while their DOM is still attached
      pauseScope(scope)
      parked = extractBetween(start, end)
    }
  })

  // The echo: a value written back from inside the running toggle cannot
  // re-queue it. This second subscriber is idle at that moment, so its
  // read settles the value and re-queues the parked toggle for the
  // corrective pass
  deferEffect(() => void $value(), true)

  return fragment
}
