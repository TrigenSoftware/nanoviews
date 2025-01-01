/**
 * Destroy function
 */
export type Destroy = () => void

/**
 * Effect with required destroy function
 */
export type StrictEffect = () => Destroy

/**
 * Effect function type
 */
export type Effect = (() => Destroy | void) | StrictEffect
