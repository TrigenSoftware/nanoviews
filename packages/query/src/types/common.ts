import type { ReadableSignal } from 'kida'

export type SignalsParams<T extends unknown[]> = T extends [infer First, ...infer Rest]
  ? [ReadableSignal<First>, ...SignalsParams<Rest>]
  : []
