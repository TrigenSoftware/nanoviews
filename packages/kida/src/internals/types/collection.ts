import type {
  AnySignal,
  ReadableSignal
} from 'agera'
import { $$collection } from '../symbols.js'

export type CollectionKey = number | string

export type AnyCollection = Record<CollectionKey, any>

export interface CollectionStore {
  [$$collection]?: Map<CollectionKey | ReadableSignal<CollectionKey>, AnySignal>
}
