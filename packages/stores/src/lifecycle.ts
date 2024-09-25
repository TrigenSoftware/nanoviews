import type {
  Store,
  AnyStore,
  AnyObject,
  EmptyObject,
  EmptyValue,
  PickNonEmptyValue
} from './internals/index.js'
import {
  SET,
  NOTIFY,
  START,
  STOP,
  CHANGE,
  EventTargetSymbol,
  isFunction,
  on,
  listen,
  noop,
  dispatch
} from './internals/index.js'

export * from './internals/lifecycle.js'

/**
 * Subscribe to store changes. It's like `listen` but also calls the listener immediately.
 * @param $store - The store to subscribe to.
 * @param listener - The listener function.
 * @param level - The priority level of the listener.
 * @returns Function to stop listening.
 */
export function subscribe<T, S extends AnyObject = EmptyObject>(
  $store: Store<T>,
  listener: (value: T, prevValue: T | undefined, shared: S) => void,
  level?: number
) {
  const off = listen($store, listener, level)

  listener($store.get(), undefined, {} as S)

  return off
}

/**
 * Listen to store set. This event is triggered before the store value is changed.
 * @param $store - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onSet<T, S extends AnyObject = EmptyObject>(
  $store: Store<T>,
  listener: (nextValue: T, prevValue: T, abort: () => void, shared: S) => void
) {
  return on($store, SET, listener)
}

/**
 * Listen to store notify. This event is triggered after the store value is changed and before the store change event.
 * @param $store - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onNotify<T, S extends AnyObject = EmptyObject>(
  $store: Store<T>,
  listener: (value: T, prevValue: T, abort: () => void, shared: S) => void
) {
  return on($store, NOTIFY, listener)
}

function getKeyValue<T extends AnyObject | EmptyValue>(
  object: T,
  key: keyof PickNonEmptyValue<T> | ((value: T) => unknown)
) {
  if (isFunction(key)) {
    return key(object)
  }

  return object?.[key]
}

/**
 * Listen to store specific keys change.
 * @param $store - The store to listen to.
 * @param keys - The keys to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function listenKeys<
  T extends AnyObject | EmptyValue,
  S extends AnyObject = EmptyObject
>(
  $store: Store<T>,
  keys: (keyof PickNonEmptyValue<T> | ((value: T) => unknown))[],
  listener: (value: T, prevValue: T, changed: typeof keys, shared: S) => void
) {
  const currentValue = $store.get()
  const memo = new Map(
    keys.map(key => [key, getKeyValue(currentValue, key)])
  )

  return listen<T, S>($store, (value, prevValue, shared) => {
    const changed: typeof keys = []
    let keyValue

    keys.forEach((key) => {
      keyValue = getKeyValue(value, key)

      if (memo.get(key) !== keyValue) {
        memo.set(key, keyValue)
        changed.push(key)
      }
    })

    if (changed.length) {
      listener(value, prevValue, changed, shared)
    }
  })
}

/**
 * Start the store and keep it alive.
 * @param $store - The store to keep alive.
 * @returns Function to stop keeping the store alive.
 */
export function keepAlive($store: AnyStore) {
  return listen($store, noop)
}

/**
 * Force stop the stores.
 * @param $stores - The stores to stop.
 */
export function stop(...$stores: AnyStore[]) {
  $stores.forEach(($store) => {
    $store[EventTargetSymbol].delete(CHANGE)
    dispatch($store, STOP)
  })
}

/**
 * Start and stop the store immediately if it's not started.
 * @param $store - The store to execute.
 * @returns The store.
 */
export function exec<T extends AnyStore>($store: T) {
  if (!$store[EventTargetSymbol].has(CHANGE)) {
    dispatch($store, START)
    dispatch($store, STOP)
  }

  return $store
}
