import {
  listen,
  external,
  onMount,
  mountable
} from '@nano_kit/store'
import type { ClientSetting } from '../client.types.js'
import type { QueryClientContext } from '../ClientContext.js'
import { addFn } from '../utils.js'

interface RevalidateOnFocusContext extends QueryClientContext {
  revalidateOnFocusEnabled?: boolean
}

/**
 * @todo Move to common extras package
 */
export const $windowVisible = external<boolean>(($windowVisible) => {
  if (typeof document === 'undefined') {
    $windowVisible(true)
    return
  }

  const set = () => $windowVisible(!document.hidden)

  set()

  onMount(mountable($windowVisible), () => {
    document.addEventListener('visibilitychange', set)

    return () => {
      document.removeEventListener('visibilitychange', set)
    }
  })
})

/**
 * Revalidate the query when the window gains focus.
 * @returns The client setting function.
 */
/* @__NO_SIDE_EFFECTS__ */
export function revalidateOnFocus(): ClientSetting<QueryClientContext> {
  return (ctx: RevalidateOnFocusContext) => {
    if (ctx.revalidateOnFocusEnabled === undefined) {
      ctx.mounted = addFn(ctx.mounted, function (this: RevalidateOnFocusContext) {
        listen($windowVisible, (visible) => {
          if (visible) {
            this.revalidate(this.$key())
          }
        })
      })
    }

    ctx.revalidateOnFocusEnabled = true
  }
}
