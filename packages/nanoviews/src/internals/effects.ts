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

  let firstValue: T | undefined = valueOr$signal()

  callback(firstValue)

  effect((warmup) => {
    const value = valueOr$signal()

    if (!warmup || (firstValue !== value && (firstValue = undefined, true))) {
      callback(value)
    }
  })
}

export function createEffectScopeWithContext(context = getContext()) {
  return createEffectScope(runner => run.bind(null, context, runner))
}

export function effectScopeSwapper<T>(
  $signal: ReadableSignal<T>,
  callback: EffectScopeSwapperCallback<T>
) {
  let prevValue = $signal()
  let start = callback(undefined, prevValue, undefined) as (() => Destroy) | undefined
  let stop: Destroy

  effect((warmup) => {
    const value = $signal()

    if (warmup) {
      stop = start!()
      start = undefined
    }

    if (!warmup || prevValue !== value) {
      stop = callback(stop, value, prevValue)
      prevValue = value
    }
  })

  effect(() => () => stop())
}
