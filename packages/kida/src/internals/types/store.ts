import {
  $$addListener,
  $$removeListener,
  $$listen,
  $$notify
} from '../symbols.js'
import type { EventListener } from './emitter.js'

export interface ReadableSignal<T> {
  [$$addListener](listener: EventListener): EventListener[]
  [$$removeListener](listeners: EventListener[], listener: EventListener): boolean
  [$$listen](listener: EventListener): () => void
  get(): T
}

export interface WritableSignal<T> extends ReadableSignal<T> {
  [$$notify](value: T, prevValue: T): void
  set(value: T): void
}

export type AnyReadableSignal = ReadableSignal<any>

export type AnyWritableSignal = WritableSignal<any>

export type AnySignal = AnyReadableSignal | AnyWritableSignal

export type SignalValue<T> = T extends ReadableSignal<infer U> ? U : never

export type MaybeSignalValue<T> = T extends ReadableSignal<infer U> ? U : T
