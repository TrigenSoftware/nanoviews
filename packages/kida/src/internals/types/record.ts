import type { AnySignal } from 'agera'
import { $$record } from '../symbols.js'
import type {
  AnyObject,
  EmptyValue
} from './common.js'

export type GenericRecordValue = AnyObject | EmptyValue

export type AnyRecordStore = AnySignal & Partial<Record<PropertyKey, AnySignal>>

export interface RecordStore {
  [$$record]?: AnyRecordStore
}
