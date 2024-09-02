export type AnyObject = Record<PropertyKey, any>

export type AnyFn = (...args: any) => any

export type EmptyObject = Record<never, never>

export type EmptyValue = undefined | null

export type PickNonEmptyValue<T> = T extends EmptyValue ? never : T

export type PickEmptyValue<T> = T extends EmptyValue ? T : never

export type PickObjectValue<T> = T extends AnyObject ? T : never

export type Runner = (fn: () => void) => () => void
