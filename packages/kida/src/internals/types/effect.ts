import type {
  AnyReadableSignal,
  ReadableSignal
} from './store.js'

export type StoresUnsubs = Map<AnyReadableSignal, () => void>

export type MountHook = (addDependency: ($signal: AnyReadableSignal) => void) => void

export type GetHook = <T>($signal: ReadableSignal<T>) => T

export type Destroy = (() => void) | void

export type Observer = (get: GetHook, warmup?: boolean) => Destroy

export type Compute<T> = (get: GetHook) => T
