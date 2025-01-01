import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { listen } from './lifecycle.js'
import {
  signal,
  isSignal
} from './signal.js'
import { computed } from './computed.js'
import { record } from './record.js'
import {
  atKey,
  setKey
} from './map.js'

describe('stores', () => {
  describe('map', () => {
    it('should get item by key', () => {
      const $map = signal({
        first: 1,
        second: 2
      })

      expect($map.get()).toEqual({
        first: 1,
        second: 2
      })
      expect(atKey($map, 'first')).toSatisfy(isSignal)
      expect(atKey($map, 'second')).toSatisfy(isSignal)

      expect(atKey($map, 'first').get()).toBe(1)
      expect(atKey($map, 'second').get()).toBe(2)
    })

    it('should update root by child', () => {
      const $map = signal({
        first: 1,
        second: 2
      })

      expect(atKey($map, 'first').get()).toBe(1)

      atKey($map, 'first').set(3)

      expect(atKey($map, 'first').get()).toBe(3)
      expect($map.get()).toEqual({
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
      const off = listen($map, rootListener)
      const offChild = listen(atKey($map, 'first'), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      atKey($map, 'first').set(3)

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith({
        first: 3,
        second: 2
      }, {
        first: 1,
        second: 2
      })
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith(3, 1)

      off()
      offChild()
    })

    it('should update child by root', () => {
      const $map = signal({
        first: 1,
        second: 2
      })

      expect(atKey($map, 'first').get()).toBe(1)

      setKey($map, 'first', 3)

      expect(atKey($map, 'first').get()).toBe(3)
    })

    it('should update child by root and notify listeners', () => {
      const $map = signal({
        first: 1,
        second: 2
      })
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($map, rootListener)
      const offChild = listen(atKey($map, 'first'), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      expect(atKey($map, 'first').get()).toBe(1)

      setKey($map, 'first', 3)

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith({
        first: 3,
        second: 2
      }, {
        first: 1,
        second: 2
      })
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith(3, 1)

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

      expect($item.get()).toBe(1)

      $key.set('second')

      expect($item.get()).toBe(2)
    })

    it('should get item by key from computed store', () => {
      const $item = signal(1)
      const $map = computed(get => ({
        first: get($item),
        second: 2
      }))

      expect($map.get()).toEqual({
        first: 1,
        second: 2
      })
      expect(atKey($map, 'first').get()).toBe(1)

      $item.set(3)

      expect($map.get()).toEqual({
        first: 3,
        second: 2
      })
      expect(atKey($map, 'first').get()).toBe(3)
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

      expect($map.get()).toEqual(users)
      expect(atKey($map, 2).get()).toEqual(users[2])
      expect(record(atKey($map, 2)).name.get()).toBe('Savva')

      record(atKey($map, 2)).name.set('Savva B')

      expect($map.get()).toEqual({
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
      expect(atKey($map, 2).get()).toEqual({
        name: 'Savva B',
        location: 'Tallinn'
      })
      expect(record(atKey($map, 2)).name.get()).toBe('Savva B')
    })
  })
})
