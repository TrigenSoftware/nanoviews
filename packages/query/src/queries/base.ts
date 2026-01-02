import {
  action,
  computed,
  mountable
} from 'kida'
import type {
  CacheKey,
  CacheKeyBuilder,
  ClientSetting,
  SignalsParams
} from '../types/index.js'
import { UNSET_REV } from '../CacheStorage.js'
import {
  type ClientContext,
  type QueryClientContext,
  forkQueryClient
} from '../ClientContext.js'
import { QueryContext } from '../RequestContext.js'

/* @__NO_SIDE_EFFECTS__ */
export function baseQuery<
  P extends unknown[],
  E extends unknown[],
  R
>(
  rootCtx: ClientContext,
  key: CacheKeyBuilder<P, R>,
  params: SignalsParams<P>,
  fn: (...args: [...P, ...E, queryCtx: QueryContext<P, R>]) => Promise<R>,
  settings?: ClientSetting<QueryClientContext<R>>[]
) {
  const $params = computed(() => params.map($signal => $signal()) as P)
  const $key = computed((prevKey?: CacheKey<P, R>) => {
    const nextKey = key(...$params())

    if (
      prevKey
      && prevKey.shard === nextKey.shard
      && prevKey.key === nextKey.key
    ) {
      return prevKey
    }

    return nextKey
  })
  const clientCtx = forkQueryClient<R>(rootCtx, $key, settings)
  const $entry = computed(() => clientCtx.get($key()))
  /**
   * Changes on every entry rev reset
   */
  const $rev = computed((v: number = 0): number => ($entry().rev === UNSET_REV ? v + 1 : v))
  const { mapComputedData } = clientCtx
  const $data = mountable(computed(() => mapComputedData($entry().data as R | null)))
  const $error = computed(() => $entry().error)
  const $loading = computed(() => $entry().loading)
  let prevQueryCtx: QueryContext<P, R> | undefined
  const fetch = action((...extraParams: E) => {
    if (clientCtx.mute($entry())) {
      return Promise.resolve() as Promise<undefined>
    }

    const key = $key()
    const params = $params()
    const queryCtx = prevQueryCtx = new QueryContext<P, R>(key, prevQueryCtx)
    let rev: number | undefined

    return clientCtx.run(
      queryCtx,
      () => {
        rev = clientCtx.loading(key)

        return fn(...params, ...extraParams, queryCtx)
      },
      (data, error) => clientCtx.settled(key, data, error, rev)
    )
  })

  return {
    clientCtx,
    fetch,
    $params,
    $key,
    $rev,
    $data,
    $error,
    $loading
  }
}
