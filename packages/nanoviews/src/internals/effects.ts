import {
  type ReadableSignal,
  type Destroy,
  effect,
  isSignal,
  createEffectScope,
  getContext,
  run
} from 'kida'
import type {
  ValueOrSignal,
  EffectScopeSwapperCallback
} from './types/index.js'

export function subscribe<T>(
  valueOr$signal: ValueOrSignal<T>,
  callback: (value: T) => void
) {
  if (!isSignal(valueOr$signal)) {
    callback(valueOr$signal)
    return
  }

  effect(() => {
    callback(valueOr$signal())
  }, true)
}

export function createEffectScopeWithContext(context = getContext()) {
  const effectScope = createEffectScope()

  return ((fn, lazy) => effectScope(() => run(context, fn), lazy)) as ReturnType<typeof createEffectScope>
}

export function effectScopeSwapper<T>(
  $signal: ReadableSignal<T>,
  callback: EffectScopeSwapperCallback<T>
) {
  let prevValue: T | undefined
  let start: (() => Destroy) | undefined
  let stop: Destroy | undefined

  effect((warmup) => {
    const value = $signal()

    stop = callback(stop, value, prevValue)

    if (warmup) {
      start = stop as () => Destroy
      stop = undefined
    }

    prevValue = value
  }, true)

  effect(() => {
    stop = start!()
    start = undefined

    return () => stop!()
  })
}
