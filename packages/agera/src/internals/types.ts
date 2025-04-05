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
  $$signal
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
  [$$dep]: Dependency | (Dependency & Subscriber)
  [$$sub]: Subscriber | (Dependency & Subscriber)
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

export type EffectCallback = (warmup?: true | undefined) => MaybeDestroy

export interface Effect extends Subscriber, Dependency {
  [$$effect]: EffectCallback
  [$$destroy]: MaybeDestroy
}

export type OnActivateCallback = (active: boolean) => void

export interface Signal<T = unknown> extends Dependency {
  [$$value]: T
  [$$onActivate]?: OnActivateCallback
}

export type Compute<T> = (prevValue?: T) => T

export interface ComputedSignal<T = unknown> extends Signal<T>, Subscriber {
  [$$compute]: Compute<T>
}

export interface ReadableSignal<T> {
  [$$signal]: Signal<T>
  (): T
}

export interface WritableSignal<T> extends ReadableSignal<T> {
  (value: T): void
}

export type AnyReadableSignal = ReadableSignal<any>

export type AnyWritableSignal = WritableSignal<any>

export type AnySignal = AnyReadableSignal | AnyWritableSignal

export type SignalValue<T> = T extends ReadableSignal<infer U> ? U : never

export type MaybeSignalValue<T> = T extends ReadableSignal<infer U> ? U : T

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
