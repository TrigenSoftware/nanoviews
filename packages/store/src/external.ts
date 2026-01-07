import {
  type WritableSignal,
  type Morph,
  type NewValue,
  morph,
  signal,
  untracked
} from 'kida'

export type ExternalFactory<T> = (set: WritableSignal<T>) => ((value: NewValue<T>) => void) | void

export interface External<T> extends Morph<T> {
  factory: ExternalFactory<T>
}

function lazyGetterSetter<T>(this: External<T>, ...value: [NewValue<T>]): T | void {
  const $source = this.source
  const setter = untracked(() => this.factory($source))

  this.get = $source
  this.set = setter === undefined
    ? $source
    : setter

  if (value.length) {
    this.set(value[0])
  } else {
    return $source()
  }
}

/**
 * Create a signal that is controlled by an external source.
 * @param factory - The factory function.
 * @returns The external signal.
 */
/* @__NO_SIDE_EFFECTS__ */
export function external<T>(
  factory: ExternalFactory<T>
) {
  return morph(signal<T>(), {
    get: lazyGetterSetter as () => T,
    set: lazyGetterSetter,
    factory
  }) as WritableSignal<T>
}
