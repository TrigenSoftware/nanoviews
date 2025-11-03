import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  effect,
  signal
} from 'agera'
import { previous } from './utils.js'

describe('kida', () => {
  describe('utils', () => {
    describe('previous', () => {
      it('should return previous value of the signal', () => {
        const $value = signal(1)
        const $previous = previous($value)

        expect($previous()).toBeUndefined()

        $value(2)

        expect($previous()).toBe(1)

        $value(3)

        expect($previous()).toBe(2)
      })

      it('should trigger effect once', () => {
        const $value = signal(1)
        const $previous = previous($value)
        const fn = vi.fn(() => {
          void ($value() && $previous())
        })
        const stop = effect(fn)

        expect(fn).toHaveBeenCalledTimes(1)

        $value(2)
        expect(fn).toHaveBeenCalledTimes(2)

        $value(3)
        expect(fn).toHaveBeenCalledTimes(3)

        stop()
      })
    })
  })
})
