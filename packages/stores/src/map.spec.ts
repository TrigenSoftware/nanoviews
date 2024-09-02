import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { isStore } from './utils.js'
import { listen } from './lifecycle.js'
import { atom } from './atom.js'
import { computed } from './computed.js'
import { record } from './record.js'
import {
  map,
  setKey
} from './map.js'

describe('stores', () => {
  describe('map', () => {
    it('should create map store', () => {
      const $map = map({
        first: 1,
        second: 2
      })

      expect($map.get()).toEqual({
        first: 1,
        second: 2
      })
      expect($map.at('first')).toSatisfy(isStore)
      expect($map.at('second')).toSatisfy(isStore)

      expect($map.at('first').get()).toBe(1)
      expect($map.at('second').get()).toBe(2)
    })

    it('should update root by child', () => {
      const $map = map({
        first: 1,
        second: 2
      })

      expect($map.at('first').get()).toBe(1)

      $map.at('first').set(3)

      expect($map.at('first').get()).toBe(3)
      expect($map.get()).toEqual({
        first: 3,
        second: 2
      })
    })

    it('should update root by child and notify listeners', () => {
      const $map = map({
        first: 1,
        second: 2
      })
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($map, rootListener)
      const offChild = listen($map.at('first'), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      $map.at('first').set(3)

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith({
        first: 3,
        second: 2
      }, {
        first: 1,
        second: 2
      }, {})
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith(3, 1, {})

      off()
      offChild()
    })

    it('should update child by root', () => {
      const $map = map({
        first: 1,
        second: 2
      })

      expect($map.at('first').get()).toBe(1)

      setKey($map, 'first', 3)

      expect($map.at('first').get()).toBe(3)
    })

    it('should update child by root and notify listeners', () => {
      const $map = map({
        first: 1,
        second: 2
      })
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($map, rootListener)
      const offChild = listen($map.at('first'), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      expect($map.at('first').get()).toBe(1)

      setKey($map, 'first', 3)

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith({
        first: 3,
        second: 2
      }, {
        first: 1,
        second: 2
      }, {})
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith(3, 1, {})

      off()
      offChild()
    })

    it('should create map store from other store', () => {
      const $item = atom(1)
      const $map = map(computed($item, item => ({
        first: item,
        second: 2
      })))

      expect($map.get()).toEqual({
        first: 1,
        second: 2
      })
      expect($map.at('first').get()).toBe(1)

      $item.set(3)

      expect($map.get()).toEqual({
        first: 3,
        second: 2
      })
      expect($map.at('first').get()).toBe(3)
    })

    it('should create map store with item type', () => {
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
      const $map = map(users, record)

      expect($map.get()).toEqual(users)
      expect($map.at(2).get()).toEqual(users[2])
      expect($map.at(2).name.get()).toBe('Savva')

      $map.at(2).name.set('Savva B')

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
      expect($map.at(2).get()).toEqual({
        name: 'Savva B',
        location: 'Tallinn'
      })
      expect($map.at(2).name.get()).toBe('Savva B')
    })
  })
})
