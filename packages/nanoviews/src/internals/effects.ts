import {
  type Accessor,
  type Destroy,
  type ValueOrAccessor,
  isAccessor,
  effect,
  createEffectScope,
  getContext,
  run
} from 'kida'
import type { EffectScopeSwapperCallback } from './types/index.js'

export function subscribeAccessor<T>(
  $signal: Accessor<T>,
  callback: (value: T) => void
) {
  effect(() => {
    callback($signal())
  }, true)
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

export function createEffectScopeWithContext(context = getContext()) {
  const effectScope = createEffectScope()

  return ((fn, lazy) => effectScope(() => run(context, fn), lazy)) as ReturnType<typeof createEffectScope>
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
