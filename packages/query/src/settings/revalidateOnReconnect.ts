import {
  listen,
  external,
  onMount,
  mountable
} from '@nano_kit/store'
import type { ClientSetting } from '../client.types.js'
import type { QueryClientContext } from '../ClientContext.js'
import { addFn } from '../utils.js'

interface RevalidateOnReconnectContext extends QueryClientContext {
  revalidateOnReconnectEnabled?: boolean
}

/**
 * @todo Move to common extras package
 */
export const $networkOnline = external<boolean>(($networkOnline) => {
  if (typeof navigator === 'undefined') {
    $networkOnline(true)
    return
  }

  const set = () => $networkOnline(navigator.onLine)

  set()

  onMount(mountable($networkOnline), () => {
    window.addEventListener('online', set)
    window.addEventListener('offline', set)

    return () => {
      window.removeEventListener('online', set)
      window.removeEventListener('offline', set)
    }
  })
})

/**
 * Revalidate the query when the network reconnects.
 * @returns The client setting function.
 */
/* @__NO_SIDE_EFFECTS__ */
export function revalidateOnReconnect(): ClientSetting<QueryClientContext> {
  return (ctx: RevalidateOnReconnectContext) => {
    if (ctx.revalidateOnReconnectEnabled === undefined) {
      ctx.mounted = addFn(ctx.mounted, function (this: RevalidateOnReconnectContext) {
        listen($networkOnline, (online) => {
          if (online) {
            this.revalidate(this.$key())
          }
        })
      })
    }

    ctx.revalidateOnReconnectEnabled = true
  }
}
