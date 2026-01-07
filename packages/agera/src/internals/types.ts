export type DefineVirtualFlags<F extends string, V = unknown> = {
  [K in F as `_$$${K}`]?: V
}

export type EnableVirtualFlags<T, F extends string> = Omit<T, `_$$${F}`> & DefineVirtualFlags<F, true>

export interface Dependency {
  flags: number
  subs: Link | undefined
  subsTail: Link | undefined
}

export interface Subscriber {
  flags: number
  deps: Link | undefined
  depsTail: Link | undefined
  noMount?: SignalInstance
}

export interface Link {
  dep: Dependency | Dependency & Subscriber
  sub: Subscriber | Dependency & Subscriber
  // Reused to link the previous stack in updateDirtyFlag
  // Reused to link the previous stack in propagate
  prevSub: Link | undefined
  nextSub: Link | undefined
  // Reused to link the notify effect in queuedEffects
  nextDep: Link | undefined
}

export interface EffectScope extends Subscriber, Dependency {}

export type Destroy = () => void

export type MaybeDestroy = Destroy | void

export type EffectCallback = (warmup?: true) => MaybeDestroy

export type ObserverCallback<T> = (value: T) => void

export interface Effect extends Subscriber, Dependency {
  effect: EffectCallback
  destroy: MaybeDestroy
}

export type MountedCallback = (mounted: boolean) => void

export interface SignalInstance<T = unknown> extends Dependency, DefineVirtualFlags<'writable' | 'mountable'> {
  value: T
  subsCount: number
  mounted?: MountedCallback
}

export type Compute<T> = (prevValue?: T) => T

export interface ComputedSignalInstance<T = unknown> extends SignalInstance<T>, Subscriber {
  compute: Compute<T>
}

export type Accessor<T> = () => T

export interface ReadableSignal<T> extends Accessor<T> {
  signal: SignalInstance<T>
}

export type NewValue<T> = T | ((prevValue: T) => T)

export interface WritableSignal<T> extends ReadableSignal<T> {
  (value: NewValue<T>): void
  signal: EnableVirtualFlags<SignalInstance<T>, 'writable'>
}

export type Mountable<S extends AnySignal> = S & {
  signal: EnableVirtualFlags<S['signal'], 'mountable'>
}

export type AnyAccessor = Accessor<any>

export type AnyReadableSignal = ReadableSignal<any>

export type AnyWritableSignal = WritableSignal<any>

export type AnySignal = AnyReadableSignal | AnyWritableSignal

export type AnyAccessorOrSignal = AnyAccessor | AnySignal

export type AccessorValue<T> = T extends Accessor<infer U> ? U : never

export type MaybeAccessorValue<T> = T extends Accessor<infer U> ? U : T

export interface Morph<T = unknown> {
  source: WritableSignal<T>
  get(): T
  set(value: NewValue<T>): void
}

export type AnyFn = (...args: any) => any
