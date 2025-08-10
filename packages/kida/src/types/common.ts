export type RateLimiter = <T extends unknown[]>(fn: (...args: T) => void) => (...args: T) => void
