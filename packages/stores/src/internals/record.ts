import type {
  AnyStore,
  AnyRecordStore
} from './types/index.js'
import { assignKey } from './utils.js'
import { child } from './child.js'

type Ext = (ext: Ext, $store: AnyStore, $root: AnyStore) => AnyStore

/**
 * Create a store for a record.
 * @param ext - Function to extend store.
 * @param $store - The source store.
 * @param $root - The root store.
 * @returns A store for the record.
 */
export function recordBase(
  ext: Ext,
  $store: AnyStore,
  $root: AnyStore = $store
) {
  return new Proxy($store as AnyRecordStore, {
    get($store, key, receiver) {
      if (!(key in $store)) {
        $store[key] = ext(
          ext,
          child(
            $root,
            $store,
            state => (state ? state[key] : state),
            (state, value) => assignKey(state, key, value)
          ),
          $root
        )
      }

      return Reflect.get($store, key, receiver)
    }
  })
}
