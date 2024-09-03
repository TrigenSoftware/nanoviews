/* eslint-disable @typescript-eslint/naming-convention */
import type {
  AnyStore,
  Store,
  AsyncState
} from '../internals/types/index.js'

export interface AsyncStore<T> extends Store<T>, Array<AnyStore> {
  /**
   * Value store.
   */
  0: this
  /**
   * Error store.
   */
  1: Store<unknown>
  /**
   * Promise state store.
   */
  2: Store<AsyncState>
  /**
   * Run promise.
   * @param value - Promise to run.
   * @param abortController - Abort controller to abort promise.
   */
  run(value: Promise<T>, abortController?: AbortController): Promise<T>
}
