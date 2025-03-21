import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  signal,
  effect
} from 'agera'
import { assignKey } from './utils.js'
import { child } from './child.js'

describe('kida', () => {
  describe('internals', () => {
    describe('child', () => {
      it('should lazy get and set child value', () => {
        const $map = signal({
          a: 0,
          b: 1,
          c: 2
        })
        const $b = child($map, 'b', assignKey)

        expect($b()).toBe(1)

        $b(3)

        expect($map()).toEqual({
          a: 0,
          b: 3,
          c: 2
        })
        expect($b()).toBe(3)

        $map({
          a: 4,
          b: 5,
          c: 6
        })

        expect($b()).toBe(5)
      })

      it('should reactively update child value', () => {
        const $map = signal({
          a: 0,
          b: 1,
          c: 2
        })
        const $b = child($map, 'b', assignKey)
        const listener = vi.fn()
        const off = effect(() => {
          listener($b())
        })

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(1)

        $map({
          a: 1,
          b: 2,
          c: 3
        })

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(2)
        expect($b()).toBe(2)

        $b(4)

        expect(listener).toHaveBeenCalledTimes(3)
        expect(listener).toHaveBeenCalledWith(4)
        expect($map()).toEqual({
          a: 1,
          b: 4,
          c: 3
        })

        off()
      })

      it('should handle dynamic key', () => {
        const $map = signal({
          a: 0,
          b: 1,
          c: 2
        })
        const $key = signal<'a' | 'b'>('b')
        const $item = child($map, $key, assignKey)

        expect($item()).toBe(1)

        $key('a')

        expect($item()).toBe(0)
      })

      it('should handle and listen dynamic key', () => {
        const $map = signal({
          a: 0,
          b: 1,
          c: 2
        })
        const $key = signal<'a' | 'b'>('b')
        const $b = child($map, $key, assignKey)
        const listener = vi.fn()
        const off = effect(() => {
          listener($b())
        })

        expect($b()).toBe(1)

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(1)

        $map({
          a: 1,
          b: 2,
          c: 3
        })

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(2)
        expect($b()).toBe(2)

        $b(4)

        expect(listener).toHaveBeenCalledTimes(3)
        expect(listener).toHaveBeenCalledWith(4)
        expect($map()).toEqual({
          a: 1,
          b: 4,
          c: 3
        })

        $key('a')

        expect(listener).toHaveBeenCalledTimes(4)
        expect(listener).toHaveBeenCalledWith(1)
        expect($b()).toBe(1)

        $b(5)

        expect(listener).toHaveBeenCalledTimes(5)
        expect(listener).toHaveBeenCalledWith(5)
        expect($map()).toEqual({
          a: 5,
          b: 4,
          c: 3
        })

        off()
      })
    })
  })
})
