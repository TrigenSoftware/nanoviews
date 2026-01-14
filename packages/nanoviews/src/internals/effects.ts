import {
  type Accessor,
  type Destroy,
  type ValueOrAccessor,
  isAccessor,
  effect,
  subscribe as sub,
  deferScope,
  getContext,
  run,
  untracked
} from 'kida'
import type { EffectScopeSwapperCallback } from './types/index.js'

export function subscribeAccessor<T>(
  $signal: Accessor<T>,
  callback: (value: T) => void
) {
  sub($signal, callback, true)
}

export function subscribe<T>(
  valueOr$signal: ValueOrAccessor<T>,
  callback: (value: T) => void
) {
  if (isAccessor(valueOr$signal)) {
    subscribeAccessor(valueOr$signal, callback)
  } else {
    callback(valueOr$signal)
  }
}

export function createDeferScopeWithContext(context = getContext()) {
  return (fn => deferScope(() => run(context, fn))) as typeof deferScope
}

export function effectScopeSwapper<T>(
  $signal: Accessor<T>,
  callback: EffectScopeSwapperCallback<T>
) {
  let prevValue: T | undefined
  let start: (() => Destroy) | undefined
  let stop: Destroy | undefined

  effect((warmup) => {
    const value = $signal()

    stop = untracked(() => callback(stop, value, prevValue))

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
