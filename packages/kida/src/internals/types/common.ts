export type { AnyFn } from 'agera'

export type AnyObject = Record<PropertyKey, any>

export type AnyCollection = Record<number | string, any>

export type EmptyValue = undefined | null | void

export type PickNonEmptyValue<T> = T extends EmptyValue ? never : T

export type PickEmptyValue<T> = T extends EmptyValue ? T : never

export type PickObjectValue<T> = T extends AnyObject ? T : never
