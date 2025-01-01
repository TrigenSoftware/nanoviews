import { Signal } from './signal.js'
import { $$value } from './symbols.js'
import { onMount } from './lifecycle.js'

export class Lazy<T> extends Signal<T> {
  constructor(factory: () => T) {
    super(factory as T)

    this.get = () => {
      // @ts-expect-error - Reset method to default from prototype
      delete this.get

      const value = this[$$value]

      if (value === factory) {
        return this[$$value] = factory()
      }

      return value
    }

    onMount(this, () => {
      this.get()
    })
  }
}
