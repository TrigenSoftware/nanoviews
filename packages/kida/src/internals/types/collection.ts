import { $$collection } from '../symbols.js'
import type {
  AnySignal,
  ReadableSignal
} from './store.js'

export type CollectionKey = number | string

export interface CollectionStore {
  [$$collection]?: Map<CollectionKey | ReadableSignal<CollectionKey>, AnySignal>
}
