import type { PickNonEmptyValue } from '@nano_kit/store'
import type { ClientSetting } from '../client.types.js'
import type { CacheKey } from '../CacheStorage.types.js'
import type {
  ClientContext,
  MutationClientContext,
  QueryClientContext
} from '../ClientContext.js'
import { queryKey } from '../cache.js'

export interface Entity<T extends {}> {
  /**
   * Get the cache key for the entity by its identifier.
   */
  (id: number | string): CacheKey<[id: number | string], T | null>
  /**
   * Get or upsert the entity in the cache.
   */
  (entity: T): T
}

const ENTITY_KEY = '#entity'
const EntityKey = queryKey(ENTITY_KEY)

interface EntityRef {
  [ENTITY_KEY]: CacheKey
}

function isIdentifier(value: unknown): value is number | string {
  const type = typeof value

  return type === 'number' || type === 'string'
}

function isEntityRef<T extends {}>(value: T): value is T & EntityRef {
  return ENTITY_KEY in value
}

let currentCtx: ClientContext | null = null

/**
 * Create an entity manager for a specific entity type.
 * @param name - The name of the entity type.
 * @returns The entity manager.
 */
export function entity<T extends { id: number | string }>(
  name: string
): Entity<T>

/**
 * Create an entity manager for a specific entity type.
 * @param name - The name of the entity type.
 * @param id - A function to extract the identifier from the entity.
 * @returns The entity manager.
 */
export function entity<T extends {}>(
  name: string,
  id: (entity: T) => number | string
): Entity<T>

/* @__NO_SIDE_EFFECTS__ */
export function entity<T extends { id: number | string }>(
  name: string,
  id = (entity: T) => entity.id
) {
  return (idOrRefOrEntity: number | string | null | undefined | T) => {
    if (isIdentifier(idOrRefOrEntity)) {
      return EntityKey(name, idOrRefOrEntity)
    }

    if (!idOrRefOrEntity || !currentCtx) {
      return idOrRefOrEntity
    }

    if (isEntityRef(idOrRefOrEntity)) {
      return currentCtx.$get(idOrRefOrEntity[ENTITY_KEY]).data
    }

    const key = EntityKey(name, id(idOrRefOrEntity))

    currentCtx.set(key, {
      ...currentCtx.initial(),
      data: idOrRefOrEntity
    })

    return {
      ...idOrRefOrEntity,
      [ENTITY_KEY]: key
    }
  }
}

/**
 * Map entities from the fetched data.
 * @param mapper - A function to map entities from the fetched data.
 * @returns The client setting function.
 */
export function entities<T>(
  mapper: (data: NoInfer<PickNonEmptyValue<T>>) => NoInfer<PickNonEmptyValue<T>>
): ClientSetting<QueryClientContext<T>>

/**
 * Map entities from the fetched data.
 * @param mapper - A function to map entities from the fetched data.
 * @returns The client setting function.
 */
export function entities<T>(
  mapper: (data: NoInfer<PickNonEmptyValue<T>>) => NoInfer<PickNonEmptyValue<T>>
): ClientSetting<MutationClientContext<T>>

/* @__NO_SIDE_EFFECTS__ */
export function entities(mapper: (data: unknown) => unknown) {
  return (ctx: ClientContext) => {
    const safeMapper = (data: unknown) => {
      if (data) {
        try {
          currentCtx = ctx

          return mapper(data)
        } finally {
          currentCtx = null
        }
      }

      return data
    }

    ctx.mapComputedData = ctx.mapData = safeMapper
  }
}
