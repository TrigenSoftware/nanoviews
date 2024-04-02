import type {
  ValueOrStore,
  EmptyValue,
  Destroy,
  MapSlotDefsToSlot,
  ChildrenBlock,
  PendingSlot,
  EachSlot,
  ThenSlot,
  CatchSlot
} from '../internals/index.js'
import {
  isStore,
  noop,
  getSlots,
  getChildren,
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
 * @param $abortControllerOrReverse - AbortController or store with it, or render items in reversed order
 * @param maybeReverse - Render items in reversed order
 * @returns Async iterable renderer
 */
export function forAwait$<T>(
  $asyncIterable: ValueOrStore<AsyncIterable<T>>,
  $abortControllerOrReverse?: ValueOrStore<AbortController | EmptyValue> | boolean,
  maybeReverse?: boolean
): ChildrenBlock<Node, MapSlotDefsToSlot<[PendingSlot, EachSlot<T>, ThenSlot<number>, CatchSlot]>[]> {
  const [$abortController, reverse] = typeof $abortControllerOrReverse === 'boolean'
    ? [undefined, $abortControllerOrReverse]
    : [$abortControllerOrReverse, maybeReverse]
  const abort = getAbortFromController($abortController)

  return getChildren(
    getSlots(
      [
        pending$,
        each$ as EachSlot<T>,
        then$ as ThenSlot<number>,
        catch$
      ],
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
      }, reverse)
    )
  )
}
