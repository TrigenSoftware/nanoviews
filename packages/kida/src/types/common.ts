export type RateLimiter = <T extends unknown[]>(fn: (...args: T) => void) => (...args: T) => void

export type KeysOf<U> = U extends unknown
  ? keyof U
  : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValueOfKey<U, K extends PropertyKey> = U extends any
  ? K extends keyof U
    ? U[K]
    : undefined
  : never

export type RequiredMergeUnion<U> = {
  [K in KeysOf<U>]: ValueOfKey<U, K>
}
