import type {
  AnyAccessorOrSignal,
  AnySignal
} from 'agera'
import type { $$record } from '../symbols.js'
import type {
  AnyObject,
  EmptyValue
} from './common.js'

export type GenericRecordValue = AnyObject | EmptyValue

export type AnyRecordStore = AnyAccessorOrSignal & Partial<Record<PropertyKey, AnySignal>>

export interface RecordStore {
  [$$record]?: AnyRecordStore
}
