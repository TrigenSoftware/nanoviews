import {
  type WritableSignal,
  type Morph
} from 'agera'
import type { $$factory } from '../internals/index.js'

export type ExternalFactory<T> = (set: WritableSignal<T>) => ((value: T) => void) | void

export interface External<T> extends Morph<T> {
  [$$factory]: ExternalFactory<T>
}

export type LazyFactory<T> = () => T
