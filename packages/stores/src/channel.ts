import type {
  AsyncState,
  Store
} from './types/index.js'
import {
  PendingState,
  FulfilledState,
  RejectedState,
  atom,
  abortablePromise,
  noop,
  computed
} from './internals/index.js'
import { task } from './tasks.js'

export {
  PendingState,
  FulfilledState,
  RejectedState
} from './internals/index.js'

/**
 * Create a channel for async tasks.
 * @returns A tuple with the task, state and error store.
 */
export function channel() {
  const $state = atom<AsyncState>(FulfilledState)
  const $error = atom<unknown>(undefined)
  let abort = noop
  const channelTask = <T = void>(fn: (signal: AbortSignal) => Promise<T>) => task(() => {
    abort()
    $state.set(PendingState)
    $error.set(undefined)

    const ac = new AbortController()
    const promise = fn(ac.signal)

    abort = abortablePromise(
      promise,
      () => $state.set(FulfilledState),
      (error) => {
        $state.set(RejectedState)
        $error.set(error)
      },
      () => ac.abort()
    )

    return promise
  })

  return [
    channelTask,
    $state,
    $error
  ] as const
}

/**
 * Check if task state is pending.
 * @param $state - Promise state store.
 * @returns Store with boolean value.
 */
export function pending$($state: Store<AsyncState>) {
  return computed($state, state => state === PendingState)
}

/**
 * Check if task state is fulfilled.
 * @param $state - Promise state store.
 * @returns Store with boolean value.
 */
export function fulfilled$($state: Store<AsyncState>) {
  return computed($state, state => state === FulfilledState)
}

/**
 * Check if task state is rejected.
 * @param $state - Promise state store.
 * @returns Store with boolean value.
 */
export function rejected$($state: Store<AsyncState>) {
  return computed($state, state => state === PendingState)
}
