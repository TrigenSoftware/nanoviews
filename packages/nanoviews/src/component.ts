import type {
  AnyStore,
  AnyFn,
  AnyDependency,
  Store,
  StoreValue,
  StoresValues,
  StoresValuesOrUndefined,
  MaybeStoreValue,
  MaybeStoresValues,
  MaybeStoresValuesOrUndefined,
  Runner,
  Destroy
} from '@nanoviews/stores'
import { createManySubscriber } from '@nanoviews/stores/internals'
import {
  isStore,
  computed
} from '@nanoviews/stores'
import type {
  Effect,
  AnyObject,
  Block,
  Children,
  AnySlotDef,
  MapSlotDefsToContents,
  ChildrenWithSlots,
  MapSlotDefsToSlot
} from './internals/index.js'
import {
  addEffects,
  getChildren,
  getSlots,
  createSlot,
  toArray
} from './internals/index.js'

export type CompnentRender<
  P extends AnyObject | undefined,
  B extends Block = Block
> = keyof {
  [K in keyof P as undefined extends P[K] ? never : K]: K
} extends never
  ? (props?: P) => B
  : (props: P) => B

export { createSlot }

let effects: Effect<unknown>[] | undefined
let lazyAddEffects: typeof addEffects

/**
 * Define a component
 * @param component - Component block renderer
 * @returns Component block
 */
export function component$<
  P extends AnyObject | undefined = undefined,
  B extends Block = Block
>(component: (props: P) => B): CompnentRender<P, B> {
  return (props?: P) => {
    effects = []

    let block = component(props || {} as P)

    if (lazyAddEffects && effects.length) {
      block = lazyAddEffects(effects, block)
    }

    effects = undefined

    return block
  }
}

/**
 * Get children and pass them to the component
 * @param component - Component block renderer
 * @returns Component block renderer with children
 */
export function children$<
  P extends AnyObject | undefined = undefined,
  C extends unknown[] = Children,
  N extends Node = Node
>(
  component: (props: P, children: C | undefined) => Block<N>
) {
  return (props: P) => getChildren(
    (children: C | undefined) => component(props, children)
  )
}

/**
 * Get defined slots from children and pass them to the component
 * @param slotDefs - Slot definitions
 * @param component - Component block renderer
 * @returns Component block renderer with slots and children
 */
export function slots$<
  D extends AnySlotDef[],
  P extends AnyObject | undefined = undefined,
  C extends unknown[] = Children,
  N extends Node = Node
>(
  slotDefs: [...D],
  component: (props: P, ...children: [...MapSlotDefsToContents<D>, C | undefined]) => Block<N>
) {
  return (props: P) => getChildren(
    (children: ChildrenWithSlots<MapSlotDefsToSlot<D>, C> | undefined) => component(props, ...getSlots(slotDefs, children))
  )
}

/**
 * Add mount effect to the component
 * @param effect - Mount effect function. Can return a destroy function
 */
export function effect$<T extends Node>(effect: Effect<T>) {
  lazyAddEffects ||= addEffects

  effects!.push(effect as Effect<unknown>)
}

/**
 * Create effect to subscribe to a store
 * @param dependency - Store to subscribe to
 * @param effect - Effect function
 * @param runner - Runner function
 * @returns Effect function
 */
export function deps$<
  T extends Node,
  D extends AnyStore
>(
  dependency: D,
  effect: (ref: T, value: StoreValue<D>, prevValue: StoreValue<D> | undefined) => Destroy,
  runner?: Runner
): Effect<T>

/**
 * Create effect to subscribe to multiple stores
 * @param dependencies - Stores to subscribe to
 * @param effect - Effect function
 * @param runner - Runner function
 * @returns Effect function
 */
export function deps$<
  T extends Node,
  D extends AnyStore[]
>(
  dependencies: [...D],
  effect: (ref: T, ...valuesAndPrevValues: [...StoresValues<D>, ...StoresValuesOrUndefined<D>]) => Destroy,
  runner?: Runner
): Effect<T>

export function deps$(
  dependency: AnyDependency,
  effect: AnyFn,
  runner?: Runner
) {
  let currentRef: unknown
  const [subscribe] = createManySubscriber(
    dependency,
    (...values: unknown[]) => effect(currentRef, ...values) as Destroy,
    runner
  )

  return (ref: unknown) => {
    currentRef = ref

    const destroy = subscribe()

    return () => {
      destroy()
      currentRef = undefined
    }
  }
}

/**
 * Compute value from dependecies or create a computed store.
 * This method works like `computed` from `@nanoviews/stores`, but it also accepts non-store values.
 * @param dependencies - Stores or values to compute from
 * @param compute - The function to compute the value
 * @param runner - The update runner function. E.g. `throttle`, `debounce`
 * @returns Computed value or store
 */
export function computed$<
  D extends unknown[],
  V
>(
  dependencies: [...D],
  compute: (...values: [...MaybeStoresValues<D>, ...MaybeStoresValuesOrUndefined<D>]) => V,
  runner?: Runner
): Extract<D[number], AnyStore> extends AnyStore ? Store<V> : V

/**
 * Compute value from dependecy or create a computed store.
 * This method works like `computed` from `@nanoviews/stores`, but it also accepts non-store values.
 * @param dependency - Store or value to compute from
 * @param compute - The function to compute the value
 * @param runner - The update runner function. E.g. `throttle`, `debounce`
 * @returns Computed value or store
 */
export function computed$<
  D,
  V
>(
  dependency: D,
  compute: (value: MaybeStoreValue<D>, prevValue: MaybeStoreValue<D> | undefined) => V,
  runner?: Runner
): D extends AnyStore ? Store<V> : V

export function computed$(
  dependency: unknown,
  compute: AnyFn,
  runner?: Runner
) {
  const dependencies = toArray(dependency).slice()
  const stores: AnyStore[] = []
  const storesIndexes: number[] = []

  dependencies.forEach((dep, index) => {
    if (isStore(dep)) {
      stores.push(dep)
      storesIndexes.push(index)
    }
  })

  const storesCount = stores.length

  dependencies.push(...Array(storesCount) as unknown[])

  if (!storesCount) {
    return compute(...dependencies) as unknown
  }

  if (storesCount === dependencies.length) {
    return computed(dependencies as AnyStore[], compute, runner)
  }

  return computed(stores, (...values) => {
    storesIndexes.forEach((index, i) => {
      dependencies[index] = values[i]
      dependencies[index + storesCount] = values[i + storesCount]
    })

    return compute(...dependencies) as unknown
  }, runner)
}
