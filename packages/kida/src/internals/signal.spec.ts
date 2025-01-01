import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { listen } from './lifecycle.js'
import { signal } from './signal.js'

describe('stores', () => {
  describe('internals', () => {
    describe('signal', () => {
      it('should create signal with default value', () => {
        const $signal = signal(1)

        expect($signal.get()).toBe(1)
      })

      it('should set value', () => {
        const $signal = signal(1)

        expect($signal.get()).toBe(1)

        $signal.set(2)

        expect($signal.get()).toBe(2)
      })

      it('should dispatch CHANGE event on value change', () => {
        const $signal = signal(1)
        const listener = vi.fn()
        const off = listen($signal, listener)

        $signal.set(2)

        expect(listener).toHaveBeenCalledWith(2, 1)
        off()
      })

      it('should not dispatch CHANGE event on same value', () => {
        const $signal = signal(1)
        const listener = vi.fn()
        const off = listen($signal, listener)

        $signal.set(1)

        expect(listener).not.toHaveBeenCalled()
        off()
      })
    })
  })
})
