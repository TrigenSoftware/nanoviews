import type {
  Store,
  EntitiesStore,
  AnyObject,
  CollectionValueStore
} from './types/index.js'
import {
  collection,
  accessKey,
  assignIndex,
  toStore,
  isStore,
  computed,
  atom
} from './internals/index.js'

function extractMaps<T extends AnyObject>(
  value: T[],
  selectId: (entity: T) => PropertyKey
) {
  const idIndexMap: Record<PropertyKey, number> = {}
  const indexIdMap: PropertyKey[] = []
  let id

  for (const entity of value) {
    id = selectId(entity)
    idIndexMap[id] = indexIdMap.length
    indexIdMap.push(id)
  }

  return [indexIdMap, idIndexMap] as const
}

/**
 * Create an entities list collection store.
 * @param source - Initial value of the store or source store.
 * @param itemType - Function to create a store for each item.
 * @returns An entities list collection store.
 */
export function entities<
  T extends { id: PropertyKey },
  S extends T[] | Store<T[]> = Store<T[]>,
  I extends CollectionValueStore<S> = CollectionValueStore<S>
>(
  source?: S,
  itemType?: ($store: CollectionValueStore<S>) => I
): EntitiesStore<S, I>

/**
 * Create an entities list collection store.
 * @param selectId - Function to select the id of each entity.
 * @param source - Initial value of the store or source store.
 * @param itemType - Function to create a store for each item.
 * @returns An entities list collection store.
 */
export function entities<
  T extends AnyObject,
  S extends T[] | Store<T[]> = Store<T[]>,
  I extends CollectionValueStore<S> = CollectionValueStore<S>
>(
  selectId: (entity: T) => PropertyKey,
  source?: S,
  itemType?: ($store: CollectionValueStore<S>) => I
): EntitiesStore<S, I>

export function entities<
  T extends { id: PropertyKey },
  S extends T[] | Store<T[]> = Store<T[]>,
  I extends CollectionValueStore<S> = CollectionValueStore<S>
>(
  selectIdOrSource?: ((entity: T) => PropertyKey) | S,
  sourceOrItemType?: S | (($store: CollectionValueStore<S>) => I),
  maybeItemType?: ($store: CollectionValueStore<S>) => I
) {
  const [
    selectId,
    source,
    itemType
  ] = typeof selectIdOrSource === 'function'
    ? [
      selectIdOrSource,
      sourceOrItemType as S,
      maybeItemType
    ]
    : [
      (entity: T) => entity.id,
      selectIdOrSource,
      sourceOrItemType as ($store: CollectionValueStore<S>) => I
    ]
  const $source: Store<T[]> = toStore(source || [], atom)
  let [indexIdMap, idIndexMap] = extractMaps($source.get(), selectId)
  const $collection = collection(
    $source,
    (state: T[], id: PropertyKey) => accessKey(state, idIndexMap[id]),
    (state: T[], id: PropertyKey, value: T) => assignIndex(state, idIndexMap[id], value),
    itemType
  )
  const {
    set: superSet,
    at: superAt
  } = $collection

  return {
    ...$collection,
    set(value: T[]) {
      [indexIdMap, idIndexMap] = extractMaps(value, selectId)
      superSet(value)
    },
    at(index: number | Store<number>) {
      return superAt(
        isStore(index)
          ? computed(index, i => indexIdMap[i])
          : indexIdMap[index]
      )
    },
    byId: superAt
  }
}
