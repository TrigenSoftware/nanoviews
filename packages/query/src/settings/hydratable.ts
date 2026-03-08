import {
  type AnyAccessor,
  Dehydrated$,
  Hydratables$,
  inject
} from '@nano_kit/store'
import type { ClientSetting } from '../client.types.js'
import type { ClientContext } from '../ClientContext.js'
import type {
  CacheMap,
  CacheEntry
} from '../CacheStorage.types.js'
import { setShardedMapKey } from '../map.js'

interface HydratableContext extends ClientContext {
  hydratable?: boolean
}

type SerializedShardedMap = [string, string, CacheEntry][]

const id = '@nano_kit/query'

function serialize(cache: CacheMap) {
  const serialized: SerializedShardedMap = []

  cache.forEach((shard, shardKey) => {
    shard.forEach(($signal, key) => {
      const value = $signal?.()

      if (value !== undefined) {
        serialized.push([shardKey, key, value])
      }
    })
  })

  return serialized
}

function deserialize(cache: CacheMap, serialized: SerializedShardedMap) {
  serialized.forEach(([shard, key, value]) => {
    setShardedMapKey(cache, {
      shard,
      key
    }, value)
  })
}

/**
 * Make client cache hydratable.
 * Without arguments, it will try to inject dehydrated data and hydratables map from context.
 * @param dehydrated - Optional dehydrated data to use for hydration.
 * @param hydratables - Optional map to store accessor with serialized cache.
 * @returns The client setting function.
 */
/* @__NO_SIDE_EFFECTS__ */
export function hydratable(
  dehydrated?: Map<string, unknown> | null,
  hydratables?: Map<string, AnyAccessor> | null
): ClientSetting {
  return (ctx: HydratableContext) => {
    if (!ctx.hydratable) {
      const finalDehydrated = dehydrated === undefined
        ? inject(Dehydrated$)
        : dehydrated

      if (finalDehydrated) {
        if (finalDehydrated.has(id)) {
          deserialize(ctx.cache, finalDehydrated.get(id) as SerializedShardedMap)
          finalDehydrated.delete(id)
        }
      } else {
        const finalHydratables = hydratables === undefined
          ? inject(Hydratables$)
          : hydratables

        if (finalHydratables) {
          finalHydratables.set(id, () => serialize(ctx.cache))
        }
      }
    }

    ctx.hydratable = true
  }
}
