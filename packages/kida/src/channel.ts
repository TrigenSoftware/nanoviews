import type { TasksSet } from './types/index.js'
import {
  signal,
  noop
} from './internals/index.js'
import { addTask } from './tasks.js'

/**
 * Run a promise and handle its state.
 * @param promise
 * @param onFinnaly
 * @param onError
 * @param abort - External function to abort the promise.
 * @returns A function to abort the promise.
 */
function abortableRun(
  promise: Promise<unknown>,
  onFinnaly: () => void,
  onError: (error: unknown) => void,
  abort: () => void
) {
  let cancelled = false
  let pending = true

  promise.then(
    () => {
      if (!cancelled) {
        onFinnaly()
      }

      pending = false
    },
    (error) => {
      if (!cancelled) {
        onFinnaly()
        onError(error)
      }

      pending = false
    }
  )

  return () => {
    if (pending) {
      abort()
      cancelled = true
      pending = false
    }
  }
}

/**
 * Create a channel for async tasks.
 * @param tasks - Tasks queue.
 * @param mapErrorValue - Function to map the error value. Default is to get the error message.
 * @returns A tuple with the task, state and error store.
 */
export function channel<E = string>(
  tasks: TasksSet,
  mapErrorValue: (error: unknown) => E = error => (error as Error).message as E
) {
  const $loading = signal(false)
  const $error = signal<E | undefined>(undefined)
  let abort = noop
  const channelTask = <T = void>(fn: (signal: AbortSignal) => Promise<T>) => {
    abort()
    $loading.set(true)
    $error.set(undefined)

    const ac = new AbortController()
    const promise = fn(ac.signal)

    abort = abortableRun(
      promise,
      () => $loading.set(false),
      error => $error.set(mapErrorValue(error)),
      () => ac.abort()
    )

    return addTask(tasks, promise)
  }

  return [
    channelTask,
    $loading,
    $error
  ] as const
}
