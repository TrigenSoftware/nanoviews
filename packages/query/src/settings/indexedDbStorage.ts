import { untracked } from 'kida'
import type {
  ClientSetting,
  CacheKey,
  CacheShardKey,
  CacheEntry
} from '../types/index.js'
import type { QueryClientContext } from '../ClientContext.js'
import { revLock, revLocked, UNSET_REV } from '../CacheStorage.js'
import { hasShardedMapKey } from '../map.js'

interface IndexedDbStorageContext extends QueryClientContext {
  indexedDbStorageLifetime?: number
}

export const DB_NAME = 'nano_kit'
export const STORE_NAME = 'query'
export const DB_VERSION = 1

interface StoredEntry {
  shard: string
  key: string
  data: CacheEntry
  expires: number
}

export function connect(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => resolve(null)

    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: ['shard', 'key']
        })

        store.createIndex('shard', 'shard', {
          unique: false
        })
      }
    }
  })
}

export async function SELECT(
  connection: Promise<IDBDatabase | null>,
  key: CacheKey
): Promise<CacheEntry | null> {
  const db = await connection

  if (!db) {
    return null
  }

  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get([key.shard, key.key])

    request.onerror = () => resolve(null)

    request.onsuccess = () => {
      const result = request.result as StoredEntry | undefined

      if (!result) {
        resolve(null)
        return
      }

      const now = Date.now()

      if (result.expires < now || result.data.expires < now) {
        void DELETE(connection, key)
        resolve(null)
        return
      }

      resolve(result.data)
    }
  })
}

export async function SET(
  connection: Promise<IDBDatabase | null>,
  cacheKey: CacheKey,
  entry: CacheEntry,
  lifetime: number
): Promise<void> {
  const db = await connection

  if (!db) {
    return
  }

  return new Promise((resolve) => {
    const {
      shard,
      key
    } = cacheKey
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const storedEntry: StoredEntry = {
      shard,
      key,
      data: entry,
      expires: Date.now() + lifetime
    }
    const request = store.put(storedEntry)

    request.onerror = () => resolve()
    request.onsuccess = () => resolve()
  })
}

export async function DELETE(
  connection: Promise<IDBDatabase | null>,
  cacheKey: CacheShardKey | CacheKey
): Promise<void> {
  const db = await connection

  if (!db) {
    return
  }

  return new Promise((resolve) => {
    const {
      shard,
      key
    } = cacheKey
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    if (key === undefined) {
      const index = store.index('shard')
      const range = IDBKeyRange.only(shard)
      const request = index.openCursor(range)

      request.onerror = () => resolve()

      request.onsuccess = () => {
        const cursor = request.result

        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
    } else {
      const request = store.delete([shard, key])

      request.onerror = () => resolve()
      request.onsuccess = () => resolve()
    }
  })
}

/**
 * Store cache in IndexedDB for persistence across sessions.
 * @param lifetime - How long to keep entries in IndexedDB in milliseconds.
 * @returns The client setting function.
 */
/* @__NO_SIDE_EFFECTS__ */
export function indexedDbStorage(lifetime: number): ClientSetting<QueryClientContext> {
  return (ctx: IndexedDbStorageContext) => {
    if (typeof indexedDB === 'undefined') {
      return
    }

    if (ctx.indexedDbStorageLifetime === undefined) {
      const superGet = ctx.get
      const superSet = ctx.set
      const superInvalidate = ctx.invalidate
      const db = connect()

      ctx.get = function (key) {
        const cache = this.cache
        const hasKey = hasShardedMapKey(cache, key)
        const entry = superGet.call(this, key)

        if (hasKey) {
          return entry
        }

        superSet.call(this, key, {
          ...entry,
          rev: revLock(entry.rev)
        })

        void this.task(SELECT(db, key).then(storedEntry => superSet.call(this, key, {
          ...entry,
          ...storedEntry,
          rev: UNSET_REV
        })))

        return superGet.call(this, key)
      }

      function saveSingleEntry(
        this: IndexedDbStorageContext,
        key: CacheKey
      ) {
        const entry = untracked(() => superGet.call(this, key))

        if (entry && !entry.loading && !revLocked(entry.rev)) {
          void this.task(SET(db, key, entry, this.indexedDbStorageLifetime!))
        }
      }

      ctx.set = function (cacheKey, entry) {
        superSet.call(this, cacheKey, entry)

        const {
          shard,
          key
        } = cacheKey

        if (key !== undefined) {
          saveSingleEntry.call(this, cacheKey)
        } else {
          const shardMap = this.cache.get(shard)

          if (shardMap) {
            for (const key of shardMap.keys()) {
              saveSingleEntry.call(this, {
                shard,
                key
              } as CacheKey)
            }
          }
        }
      }

      ctx.invalidate = function (key) {
        superInvalidate.call(this, key)
        void this.task(DELETE(db, key))
      }
    }

    ctx.indexedDbStorageLifetime = lifetime
  }
}
