import { effect } from 'kida'
import type { ClientSetting } from '../types/index.js'
import type { QueryClientContext } from '../ClientContext.js'
import { addFn } from '../utils.js'

interface RevalidateOnIntervalContext extends QueryClientContext {
  revalidateInterval?: number
}

/**
 * Revalidate the query on a specified interval.
 * @param interval - The interval in milliseconds.
 * @returns The client setting function.
 */
/* @__NO_SIDE_EFFECTS__ */
export function revalidateOnInterval(interval: number): ClientSetting<QueryClientContext> {
  return (ctx: RevalidateOnIntervalContext) => {
    if (ctx.revalidateInterval === undefined) {
      ctx.mounted = addFn(ctx.mounted, function (this: RevalidateOnIntervalContext) {
        effect(() => {
          const id = setInterval(() => {
            this.revalidate(this.$key())
          }, this.revalidateInterval)

          return () => clearInterval(id)
        })
      })
    }

    ctx.revalidateInterval = interval
  }
}
