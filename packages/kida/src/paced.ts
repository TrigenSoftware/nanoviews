import {
  type WritableSignal,
  $$set,
  morph
} from 'agera'
import type { RateLimiter } from './types/index.js'

/**
 * Creates a signal where updates are rate-limited.
 * @param $signal - The signal to pace.
 * @param rateLimiter - The rate limiter function.
 * @returns The paced signal.
 */
export function paced<T>(
  $signal: WritableSignal<T>,
  rateLimiter: RateLimiter
) {
  return morph($signal, {
    [$$set]: rateLimiter($signal)
  })
}
