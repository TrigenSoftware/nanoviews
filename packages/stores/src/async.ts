import type {
  AsyncState,
  AsyncStore,
  Store
} from './types/index.js'
import {
  PendingState,
  FulfilledState,
  atom,
  runPromise,
  getAbortFromController,
  noop,
  computed
} from './internals/index.js'

export {
  PendingState,
  FulfilledState,
  RejectedState
} from './internals/index.js'

/**
 * Create a store that can handle promises and its states.
 * @param initialValue - Initial value of the store.
 * @returns Async store.
 */
export function async<T>(
  ...initialValue: undefined extends T ? [] | [T] : [T]
): AsyncStore<T>

export function async<T>(initialValue?: T) {
  const $value = atom(initialValue)
  const $error = atom<unknown>(undefined)
  const $state = atom<AsyncState>(FulfilledState)
  const superSet = $value.set
  let abort = noop

  return {
    ...$value,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get 0() {
      return this
    },
    1: $error,
    2: $state,
    set(value: T) {
      abort()
      abort = noop
      superSet(value)
      $state.set(FulfilledState)
    },
    run(value: Promise<T>, ac?: AbortController) {
      abort()
      abort = runPromise<T>(
        value,
        superSet,
        $error.set,
        $state.set,
        getAbortFromController(ac)
      )

      return value
    },
    * [Symbol.iterator]() {
      yield this[0]
      yield this[1]
      yield this[2]
    }
  } as AsyncStore<T>
}

/**
 * Check if promise is pending.
 * @param $state - Promise state store.
 * @returns Store with boolean value.
 */
export function pending$($state: Store<AsyncState>) {
  return computed($state, state => state === PendingState)
}

/**
 * Check if promise is fulfilled.
 * @param $state - Promise state store.
 * @returns Store with boolean value.
 */
export function fulfilled$($state: Store<AsyncState>) {
  return computed($state, state => state === FulfilledState)
}

/**
 * Check if promise is rejected.
 * @param $state - Promise state store.
 * @returns Store with boolean value.
 */
export function rejected$($state: Store<AsyncState>) {
  return computed($state, state => state === PendingState)
}
