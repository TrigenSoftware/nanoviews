import type {
  $$subs,
  $$subsTail,
  $$flags,
  $$deps,
  $$depsTail,
  $$dep,
  $$sub,
  $$prevSub,
  $$nextSub,
  $$nextDep,
  $$effect,
  $$compute,
  $$value,
  $$onActivate,
  $$destroy,
  $$get,
  $$set,
  $$source,
  $$signal,
  $$writable,
  $$effects
} from './symbols.js'

export interface Dependency {
  [$$subs]: Link | undefined
  [$$subsTail]: Link | undefined
}

export interface Subscriber {
  [$$flags]: number
  [$$deps]: Link | undefined
  [$$depsTail]: Link | undefined
}

export interface Link {
  [$$dep]: Dependency | Dependency & Subscriber
  [$$sub]: Subscriber | Dependency & Subscriber
  // Reused to link the previous stack in updateDirtyFlag
  // Reused to link the previous stack in propagate
  [$$prevSub]: Link | undefined
  [$$nextSub]: Link | undefined
  // Reused to link the notify effect in queuedEffects
  [$$nextDep]: Link | undefined
}

export interface EffectScope extends Subscriber, Dependency {}

export type Destroy = () => void

export type MaybeDestroy = Destroy | void

export type EffectCallback = (warmup?: true) => MaybeDestroy

export interface Effect extends Subscriber, Dependency {
  [$$effect]: EffectCallback
  [$$destroy]: MaybeDestroy
}

export type OnActivateCallback = (active: boolean) => void

export interface Signal<T = unknown, W = unknown> extends Dependency {
  [$$value]: T
  [$$onActivate]?: OnActivateCallback
  [$$writable]?: W
  [$$effects]: number
}

export type Compute<T> = (prevValue?: T) => T

export interface ComputedSignal<T = unknown> extends Signal<T>, Subscriber {
  [$$compute]: Compute<T>
}

export type Accessor<T> = () => T

export interface ReadableSignal<T> extends Accessor<T> {
  [$$signal]: Signal<T>
}

export interface WritableSignal<T> extends ReadableSignal<T> {
  (value: T): void
  [$$signal]: Signal<T, true>
}

export type AnyAccessor = Accessor<any>

export type AnyReadableSignal = ReadableSignal<any>

export type AnyWritableSignal = WritableSignal<any>

export type AnySignal = AnyReadableSignal | AnyWritableSignal

export type AnyAccessorOrSignal = AnyAccessor | AnySignal

export type AccessorValue<T> = T extends Accessor<infer U> ? U : never

export type MaybeAccessorValue<T> = T extends Accessor<infer U> ? U : T

export interface ActivateListener {
  [$$onActivate]: OnActivateCallback
  [$$nextSub]: ActivateListener | undefined
}

export interface Morph<T = unknown> {
  [$$source]: WritableSignal<T>
  [$$get](): T
  [$$set](value: T): void
}

export type AnyFn = (...args: any) => any
