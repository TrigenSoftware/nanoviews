import type { Destroy } from 'kida'

export type EffectScopeSwapperCallback<T> = (
  destroyPrev: Destroy | undefined,
  value: T,
  prevValue: T | undefined
) => (() => Destroy) | Destroy
