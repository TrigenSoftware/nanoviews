import type {
  ValueOrStore,
  EmptyValue,
  Destroy,
  ChildrenBlockWithOnlySlots,
  PendingSlot,
  EachSlot,
  ThenSlot,
  CatchSlot
} from '../internals/index.js'
import {
  isStore,
  noop,
  getChildren,
  createSlotsSplitter as slots,
  pendingSlot as pending$,
  eachSlot as each$,
  thenSlot as then$,
  catchSlot as catch$,
  getAbortFromController,
  createAsyncList
} from '../internals/index.js'

function cancellableForAwait<T>(
  asyncIterable: AsyncIterable<T>,
  abort: () => void,
  each: (value: T, index: number) => void,
  then: (count: number) => void,
  ctch: (error: unknown) => void
) {
  let cancelled = false
  let pending = true

  void (async () => {
    try {
      let i = 0

      for await (const value of asyncIterable) {
        if (cancelled) {
          break
        }

        each(value, i++)
      }

      then(i)
    } catch (error) {
      if (!cancelled) {
        ctch(error)
      }
    }

    pending = false
  })()

  return () => {
    if (pending) {
      abort()
      cancelled = true
    }
  }
}

/**
 * Iterate over async iterable and render each value, pending, resolved or rejected state
 * @param $asyncIterable - Async iterable or store with it
 * @param $abortController - AbortController or store with it
 * @returns Async iterable renderer
 */
export function forAwait$<T>(
  $asyncIterable: ValueOrStore<AsyncIterable<T>>,
  $abortController?: ValueOrStore<AbortController | EmptyValue>
): ChildrenBlockWithOnlySlots<[PendingSlot, EachSlot<T>, ThenSlot<number>, CatchSlot], Node> {
  const abort = getAbortFromController($abortController)

  return getChildren(
    slots(
      pending$,
      each$ as EachSlot<T>,
      then$ as ThenSlot<number>,
      catch$
    ),
    (
      getPending = noop,
      getEach = noop,
      getThen = noop,
      getCatch = noop
    ) => createAsyncList(getPending(), (add, setFooter, reset) => {
      let unsubscribe: Destroy | null
      let cancel: Destroy | null
      const start = (asyncIterable: AsyncIterable<T>) => cancellableForAwait(
        asyncIterable,
        abort,
        (value: T, i: number) => add(() => getEach(value, i)),
        (i: number) => setFooter(() => getThen(i)),
        (error: unknown) => setFooter(() => getCatch(error))
      )

      if (isStore($asyncIterable)) {
        cancel = start($asyncIterable.get())
        unsubscribe = $asyncIterable.listen((asyncIterable) => {
          cancel!()
          reset(getPending)
          cancel = start(asyncIterable)
        })
      } else {
        cancel = start($asyncIterable)
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
