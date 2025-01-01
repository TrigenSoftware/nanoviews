import type {
  AnyObject,
  WritableSignal,
  ReadableSignal
} from './types/index.js'
import {
  Signal,
  isSignal
} from './signal.js'
import { Mapped } from './mapped.js'
import { $$value } from './symbols.js'
import {
  onMount,
  listen
} from './lifecycle.js'

export class CollectionChild<
  P extends AnyObject,
  K extends keyof P,
  V extends P[K]
> extends Signal<V> {
  constructor(
    $parent: WritableSignal<P> | ReadableSignal<P>,
    key: K | ReadableSignal<K>,
    setValue: (parentValue: P, key: K, value: V) => P
  ) {
    const isSignalKey = isSignal(key)
    const getKey = isSignalKey
      ? () => key.get()
      : () => key
    const get = () => $parent.get()[getKey()]
    const listener = () => super.set(get())

    super(get())

    this.get = () => this[$$value] = get()

    this.set = (value: V) => {
      if (value !== this.get()) {
        ($parent as WritableSignal<P>).set(setValue(
          $parent.get(),
          getKey(),
          value
        ))
      }
    }

    onMount(this, () => listen($parent, listener))

    if (isSignalKey) {
      onMount(this, () => listen(key, listener))
    }
  }
}

export class RecordChild<
  P extends AnyObject,
  K extends keyof P,
  V extends P[K]
> extends Mapped<P, V> {
  constructor(
    $parent: WritableSignal<P> | ReadableSignal<P>,
    key: K,
    setValue: (parentValue: P, key: K, value: V) => P
  ) {
    super($parent, parentValue => (parentValue ? parentValue[key] : parentValue))

    this.set = (value: V) => {
      if (value !== this.get()) {
        ($parent as WritableSignal<P>).set(setValue(
          $parent.get(),
          key,
          value
        ))
      }
    }
  }
}
