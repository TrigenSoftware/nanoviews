import type { Destroy } from './types/index.js'
import { onMount } from './lifecycle.js'
import { Lazy } from './lazy.js'

export class External<T> extends Lazy<T> {
  constructor(factory: (set: (value: T) => void) => () => Destroy) {
    let mountListener: () => Destroy
    const externalFactory = () => {
      let value: T
      let set = (nextValue: T) => {
        value = nextValue
      }

      mountListener = factory(nextValue => set(nextValue))

      set = nextValue => this.set(nextValue)

      return value!
    }

    super(externalFactory)

    onMount(this, () => {
      if (!mountListener) {
        externalFactory()
      }

      return mountListener()
    })
  }
}
