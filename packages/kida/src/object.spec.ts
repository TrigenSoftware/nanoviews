import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  effect,
  signal,
  isSignal,
  computed
} from 'agera'
import { record } from './record.js'
import {
  atKey,
  setKey
} from './object.js'

describe('kida', () => {
  describe('object', () => {
    it('should get item by key', () => {
      const $map = signal({
        first: 1,
        second: 2
      })

      expect($map()).toEqual({
        first: 1,
        second: 2
      })
      expect(atKey($map, 'first')).toSatisfy(isSignal)
      expect(atKey($map, 'second')).toSatisfy(isSignal)

      expect(atKey($map, 'first')()).toBe(1)
      expect(atKey($map, 'second')()).toBe(2)
    })

    it('should update root by child', () => {
      const $map = signal({
        first: 1,
        second: 2
      })

      expect(atKey($map, 'first')()).toBe(1)

      atKey($map, 'first')(3)

      expect(atKey($map, 'first')()).toBe(3)
      expect($map()).toEqual({
        first: 3,
        second: 2
      })
    })

    it('should update root by child and notify listeners', () => {
      const $map = signal({
        first: 1,
        second: 2
      })
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = effect(() => {
        rootListener($map())
      })
      const offChild = effect(() => {
        childListener(atKey($map, 'first')())
      })

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledTimes(1)

      atKey($map, 'first')(3)

      expect(rootListener).toHaveBeenCalledTimes(2)
      expect(rootListener).toHaveBeenCalledWith({
        first: 3,
        second: 2
      })
      expect(childListener).toHaveBeenCalledTimes(2)
      expect(childListener).toHaveBeenCalledWith(3)

      off()
      offChild()
    })

    it('should update child by root', () => {
      const $map = signal({
        first: 1,
        second: 2
      })

      expect(atKey($map, 'first')()).toBe(1)

      setKey($map, 'first', 3)

      expect(atKey($map, 'first')()).toBe(3)
    })

    it('should update child by root and notify listeners', () => {
      const $map = signal({
        first: 1,
        second: 2
      })
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = effect(() => {
        rootListener($map())
      })
      const offChild = effect(() => {
        childListener(atKey($map, 'first')())
      })

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledTimes(1)

      expect(atKey($map, 'first')()).toBe(1)

      setKey($map, 'first', 3)

      expect(rootListener).toHaveBeenCalledTimes(2)
      expect(rootListener).toHaveBeenCalledWith({
        first: 3,
        second: 2
      })
      expect(childListener).toHaveBeenCalledTimes(2)
      expect(childListener).toHaveBeenCalledWith(3)

      off()
      offChild()
    })

    it('should get item by dynamic index', () => {
      const $map = signal({
        first: 1,
        second: 2
      })
      const $key = signal<'first' | 'second'>('first')
      const $item = atKey($map, $key)

      expect($item()).toBe(1)

      $key('second')

      expect($item()).toBe(2)
    })

    it('should get item by key from computed store', () => {
      const $item = signal(1)
      const $map = computed(() => ({
        first: $item(),
        second: 2
      }))

      expect($map()).toEqual({
        first: 1,
        second: 2
      })
      expect(atKey($map, 'first')()).toBe(1)

      $item(3)

      expect($map()).toEqual({
        first: 3,
        second: 2
      })
      expect(atKey($map, 'first')()).toBe(3)
    })

    it('should work with record', () => {
      const users = {
        1: {
          name: 'Dan',
          location: 'Batumi'
        },
        2: {
          name: 'Savva',
          location: 'Tallinn'
        },
        3: {
          name: 'Diman',
          location: 'Novosibirsk'
        }
      }
      const $map = signal(users)

      expect($map()).toEqual(users)
      expect(atKey($map, 2)()).toEqual(users[2])
      expect(record(atKey($map, 2)).$name()).toBe('Savva')

      record(atKey($map, 2)).$name('Savva B')

      expect($map()).toEqual({
        1: {
          name: 'Dan',
          location: 'Batumi'
        },
        2: {
          name: 'Savva B',
          location: 'Tallinn'
        },
        3: {
          name: 'Diman',
          location: 'Novosibirsk'
        }
      })
      expect(atKey($map, 2)()).toEqual({
        name: 'Savva B',
        location: 'Tallinn'
      })
      expect(record(atKey($map, 2)).$name()).toBe('Savva B')
    })
  })
})
