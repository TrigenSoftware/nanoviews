import {
  type WritableSignal,
  type Morph,
  type NewValue
} from 'agera'
import type { $$factory } from '../internals/index.js'

export type ExternalFactory<T> = (set: WritableSignal<T>) => ((value: NewValue<T>) => void) | void

export interface External<T> extends Morph<T> {
  [$$factory]: ExternalFactory<T>
}
