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
