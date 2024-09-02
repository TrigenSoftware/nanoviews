import type { AnyStore } from './store.js'

export type AnyRecordStore = AnyStore & Partial<Record<PropertyKey, AnyStore>>
