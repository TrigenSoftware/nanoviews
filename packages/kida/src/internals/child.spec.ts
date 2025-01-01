import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { signal } from './signal.js'
import { listen } from './lifecycle.js'
import { assignKey } from './utils.js'
import {
  CollectionChild,
  RecordChild
} from './child.js'

describe('stores', () => {
  describe('internals', () => {
    describe('child', () => {
      describe('CollectionChild', () => {
        it('should lazy get and set child value', () => {
          const $map = signal({
            a: 0,
            b: 1,
            c: 2
          })
          const $b = new CollectionChild($map, 'b', assignKey)

          expect($b.get()).toBe(1)

          $b.set(3)

          expect($map.get()).toEqual({
            a: 0,
            b: 3,
            c: 2
          })
          expect($b.get()).toBe(3)

          $map.set({
            a: 4,
            b: 5,
            c: 6
          })

          expect($b.get()).toBe(5)
        })

        it('should reactively update child value', () => {
          const $map = signal({
            a: 0,
            b: 1,
            c: 2
          })
          const $b = new CollectionChild($map, 'b', assignKey)
          const listener = vi.fn()
          const off = listen($b, listener)

          expect(listener).toHaveBeenCalledTimes(0)

          $map.set({
            a: 1,
            b: 2,
            c: 3
          })

          expect(listener).toHaveBeenCalledTimes(1)
          expect(listener).toHaveBeenCalledWith(2, 1)
          expect($b.get()).toBe(2)

          $b.set(4)

          expect(listener).toHaveBeenCalledTimes(2)
          expect(listener).toHaveBeenCalledWith(4, 2)
          expect($map.get()).toEqual({
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
          const $item = new CollectionChild($map, $key, assignKey)

          expect($item.get()).toBe(1)

          $key.set('a')

          expect($item.get()).toBe(0)
        })

        it('should handle and listen dynamic key', () => {
          const $map = signal({
            a: 0,
            b: 1,
            c: 2
          })
          const $key = signal<'a' | 'b'>('b')
          const $b = new CollectionChild($map, $key, assignKey)
          const listener = vi.fn()
          const off = listen($b, listener)

          expect($b.get()).toBe(1)

          expect(listener).toHaveBeenCalledTimes(0)

          $map.set({
            a: 1,
            b: 2,
            c: 3
          })

          expect(listener).toHaveBeenCalledTimes(1)
          expect(listener).toHaveBeenCalledWith(2, 1)
          expect($b.get()).toBe(2)

          $b.set(4)

          expect(listener).toHaveBeenCalledTimes(2)
          expect(listener).toHaveBeenCalledWith(4, 2)
          expect($map.get()).toEqual({
            a: 1,
            b: 4,
            c: 3
          })

          $key.set('a')

          expect(listener).toHaveBeenCalledTimes(3)
          expect(listener).toHaveBeenCalledWith(1, 4)
          expect($b.get()).toBe(1)

          $b.set(5)

          expect(listener).toHaveBeenCalledTimes(4)
          expect(listener).toHaveBeenCalledWith(5, 1)
          expect($map.get()).toEqual({
            a: 5,
            b: 4,
            c: 3
          })

          off()
        })
      })

      describe('RecordChild', () => {
        it('should lazy get and set child value', () => {
          const $map = signal({
            a: 0,
            b: 1,
            c: 2
          })
          const $b = new RecordChild($map, 'b', assignKey)

          expect($b.get()).toBe(1)

          $b.set(3)

          expect($map.get()).toEqual({
            a: 0,
            b: 3,
            c: 2
          })
          expect($b.get()).toBe(3)

          $map.set({
            a: 4,
            b: 5,
            c: 6
          })

          expect($b.get()).toBe(5)
        })

        it('should reactively update child value', () => {
          const $map = signal({
            a: 0,
            b: 1,
            c: 2
          })
          const $b = new RecordChild($map, 'b', assignKey)
          const listener = vi.fn()
          const off = listen($b, listener)

          expect(listener).toHaveBeenCalledTimes(0)

          $map.set({
            a: 1,
            b: 2,
            c: 3
          })

          expect(listener).toHaveBeenCalledTimes(1)
          expect(listener).toHaveBeenCalledWith(2, 1)
          expect($b.get()).toBe(2)

          $b.set(4)

          expect(listener).toHaveBeenCalledTimes(2)
          expect(listener).toHaveBeenCalledWith(4, 2)
          expect($map.get()).toEqual({
            a: 1,
            b: 4,
            c: 3
          })

          off()
        })
      })
    })
  })
})
