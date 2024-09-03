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
  list,
  updateList
} from './list.js'

describe('stores', () => {
  describe('list', () => {
    it('should create list store', () => {
      const $list = list([
        1,
        2,
        3
      ])

      expect($list.get()).toEqual([
        1,
        2,
        3
      ])
      expect($list.at(0)).toSatisfy(isStore)
      expect($list.at(1)).toSatisfy(isStore)
      expect($list.at(2)).toSatisfy(isStore)

      expect($list.at(0).get()).toBe(1)
      expect($list.at(1).get()).toBe(2)
      expect($list.at(2).get()).toBe(3)
    })

    it('should update root by child', () => {
      const $list = list([
        1,
        2,
        3
      ])

      expect($list.at(1).get()).toBe(2)

      $list.at(1).set(4)

      expect($list.at(1).get()).toBe(4)
      expect($list.get()).toEqual([
        1,
        4,
        3
      ])
    })

    it('should update root by child and notify listeners', () => {
      const $list = list([
        1,
        2,
        3
      ])
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($list, rootListener)
      const offChild = listen($list.at(1), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      $list.at(1).set(4)

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith([
        1,
        4,
        3
      ], [
        1,
        2,
        3
      ], {})
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith(4, 2, {})

      off()
      offChild()
    })

    it('should update child by root', () => {
      const $list = list([
        1,
        2,
        3
      ])

      expect($list.at(1).get()).toBe(2)

      updateList($list, (list) => {
        list[1] = 4
      })

      expect($list.at(1).get()).toBe(4)
    })

    it('should update child by root and notify listeners', () => {
      const $list = list([
        1,
        2,
        3
      ])
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($list, rootListener)
      const offChild = listen($list.at(1), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      expect($list.at(1).get()).toBe(2)

      updateList($list, (list) => {
        list[1] = 4
      })

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith([
        1,
        4,
        3
      ], [
        1,
        2,
        3
      ], {})
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith(4, 2, {})

      off()
      offChild()
    })

    it('should create list store from other store', () => {
      const $item = atom(2)
      const $list = list(computed($item, item => [
        1,
        item,
        3
      ]))

      expect($list.get()).toEqual([
        1,
        2,
        3
      ])
      expect($list.at(1).get()).toBe(2)

      $item.set(4)

      expect($list.get()).toEqual([
        1,
        4,
        3
      ])
      expect($list.at(1).get()).toBe(4)
    })

    it('should create list store with item type', () => {
      const users = [
        {
          name: 'Dan',
          location: 'Batumi'
        },
        {
          name: 'Savva',
          location: 'Tallinn'
        },
        {
          name: 'Diman',
          location: 'Novosibirsk'
        }
      ]
      const $list = list(users, record)

      expect($list.get()).toEqual(users)
      expect($list.at(1).get()).toEqual(users[1])
      expect($list.at(1).name.get()).toBe('Savva')

      $list.at(1).name.set('Savva B')

      expect($list.get()).toEqual([
        {
          name: 'Dan',
          location: 'Batumi'
        },
        {
          name: 'Savva B',
          location: 'Tallinn'
        },
        {
          name: 'Diman',
          location: 'Novosibirsk'
        }
      ])
      expect($list.at(1).get()).toEqual({
        name: 'Savva B',
        location: 'Tallinn'
      })
      expect($list.at(1).name.get()).toBe('Savva B')
    })
  })
})
