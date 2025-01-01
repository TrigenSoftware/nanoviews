import { $$record } from '../symbols.js'
import type {
  AnyObject,
  EmptyValue
} from './common.js'
import type { AnySignal } from './store.js'

export type GenericRecordValue = AnyObject | EmptyValue

export type AnyRecordStore = AnySignal & Partial<Record<PropertyKey, AnySignal>>

export interface RecordStore {
  [$$record]?: AnyRecordStore
}
