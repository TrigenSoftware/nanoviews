import type { AsyncState } from './types/index.js'
import { noop } from './utils.js'

export const PendingState = 'pending'
export const FulfilledState = 'fulfilled'
export const RejectedState = 'rejected'

/**
 * Run a promise and handle its state.
 * @param promise
 * @param then
 * @param ctch
 * @param abort - External function to abort the promise.
 * @returns A function to abort the promise.
 */
export function abortablePromise<T>(
  promise: Promise<T>,
  then: (value: T) => void,
  ctch: (error: unknown) => void,
  abort: () => void
) {
  let cancelled = false
  let pending = true

  promise.then(
    (value) => {
      if (!cancelled) {
        then(value)
      }

      pending = false
    },
    (error) => {
      if (!cancelled) {
        ctch(error)
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
 * Run a promise and handle its state.
 * @param promise
 * @param setValue
 * @param setError
 * @param setState
 * @param abort - External function to abort the promise.
 * @returns A function to abort the promise.
 */
export function runPromise<T>(
  promise: Promise<T>,
  setValue: (value: T) => void,
  setError: (error: unknown) => void,
  setState: (state: AsyncState) => void,
  abort: () => void
) {
  setError(undefined)
  setState(PendingState)

  return abortablePromise(
    promise,
    (value) => {
      setValue(value)
      setState(FulfilledState)
    },
    (error) => {
      setError(error)
      setState(RejectedState)
    },
    abort
  )
}

/**
 * Get an abort function from an abort controller.
 * @param abortController
 * @returns An abort function.
 */
export function getAbortFromController(
  abortController: AbortController | undefined
) {
  return abortController
    ? () => abortController.abort()
    : noop
}
