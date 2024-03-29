import type {
  ValueOrStore,
  EmptyValue,
  Destroy,
  ChildrenBlockWithOnlySlots,
  PendingSlot,
  ThenSlot,
  CatchSlot
} from '../internals/index.js'
import {
  isStore,
  noop,
  createSwapper,
  getChildren,
  createSlotsSplitter as slots,
  pendingSlot as pending$,
  thenSlot as then$,
  catchSlot as catch$,
  getAbortFromController
} from '../internals/index.js'

function cancellablePromise<T>(
  promise: Promise<T>,
  abort: () => void,
  then: (value: T) => void,
  ctch: (error: unknown) => void
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
    }
  }
}

/**
 * Await promise and render pending, resolved or rejected state
 * @param $promise - Promise or store with it
 * @param $abortController - Optional AbortController or store with it
 * @returns Block that renders promise state
 */
export function await$<T>(
  $promise: ValueOrStore<Promise<T>>,
  $abortController?: ValueOrStore<AbortController | EmptyValue>
): ChildrenBlockWithOnlySlots<[PendingSlot, ThenSlot<T>, CatchSlot], Node> {
  const abort = getAbortFromController($abortController)

  return getChildren(
    slots(
      pending$,
      then$ as ThenSlot<T>,
      catch$
    ),
    (
      getPending = noop,
      getThen = noop,
      getCatch = noop
    ) => createSwapper(getPending(), (swap) => {
      let unsubscribe: Destroy | null
      let cancel: Destroy | null
      const start = (promise: Promise<T>) => cancellablePromise(
        promise,
        abort,
        (value: T) => swap(() => getThen(value)),
        (error: unknown) => swap(() => getCatch(error))
      )

      if (isStore($promise)) {
        cancel = start($promise.get())
        unsubscribe = $promise.listen((promise) => {
          cancel!()
          swap(getPending)
          cancel = start(promise)
        })
      } else {
        cancel = start($promise)
      }

      return () => {
        unsubscribe?.()
        cancel!()
        unsubscribe = null
        cancel = null
      }
    })
  )
}
