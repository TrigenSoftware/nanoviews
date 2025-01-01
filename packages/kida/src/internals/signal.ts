import type {
  EventListener,
  WritableSignal,
  AnyReadableSignal
} from './types/index.js'
import {
  $$CHANGE,
  $$value,
  $$addListener,
  $$removeListener,
  $$listen,
  $$notify
} from './symbols.js'
import {
  addListener,
  removeListener,
  dispatchChange,
  cleanupQueue
} from './emitter.js'

export class Signal<T> implements WritableSignal<T> {
  [$$value]: T

  constructor(initialValue: T) {
    this[$$value] = initialValue
  }

  get() {
    return this[$$value]
  }

  set(value: T) {
    const prevValue = this[$$value]

    if (value !== prevValue) {
      this[$$value] = value
      this[$$notify](value, prevValue)
    }
  }

  [$$addListener](listener: EventListener) {
    return addListener(this, $$CHANGE, listener)
  }

  [$$removeListener](listeners: EventListener[], listener: EventListener) {
    cleanupQueue(listener)

    return removeListener(listeners, listener)
  }

  [$$listen](listener: EventListener) {
    const listeners = this[$$addListener](listener)

    return () => {
      this[$$removeListener](listeners, listener)
    }
  }

  [$$notify](value: T, prevValue: T) {
    dispatchChange(this, value, prevValue)
  }
}

/**
 * Create a store with atomic value.
 * @param initialValue - Initial value of the store.
 * @returns A store.
 */
export function signal<T>(
  ...initialValue: undefined extends T ? [] | [T] : [T]
): WritableSignal<T>

export function signal<T>(initialValue?: T) {
  return new Signal(initialValue)
}

/**
 * Check if the value is an signal.
 * @param value
 * @returns Whether the value is an signal.
 */
export function isSignal<T extends AnyReadableSignal = AnyReadableSignal>(value: unknown): value is T {
  return value instanceof Signal
}

/**
 * Update the value of the store.
 * @param $signal
 * @param fn - Function to update the value.
 * @returns The store.
 */
export function update<T>($signal: WritableSignal<T>, fn: (value: T) => T) {
  $signal.set(fn($signal.get()))
  return $signal
}
