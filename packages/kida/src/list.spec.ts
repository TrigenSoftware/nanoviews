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
  atIndex,
  updateList
} from './list.js'

describe('stores', () => {
  describe('list', () => {
    it('should get item by index', () => {
      const $list = signal([
        1,
        2,
        3
      ])

      expect($list.get()).toEqual([
        1,
        2,
        3
      ])
      expect(atIndex($list, 0)).toSatisfy(isSignal)
      expect(atIndex($list, 1)).toSatisfy(isSignal)
      expect(atIndex($list, 2)).toSatisfy(isSignal)

      expect(atIndex($list, 0).get()).toBe(1)
      expect(atIndex($list, 1).get()).toBe(2)
      expect(atIndex($list, 2).get()).toBe(3)
    })

    it('should update root by child', () => {
      const $list = signal([
        1,
        2,
        3
      ])

      expect(atIndex($list, 1).get()).toBe(2)

      atIndex($list, 1).set(4)

      expect(atIndex($list, 1).get()).toBe(4)
      expect($list.get()).toEqual([
        1,
        4,
        3
      ])
    })

    it('should update root by child and notify listeners', () => {
      const $list = signal([
        1,
        2,
        3
      ])
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($list, rootListener)
      const offChild = listen(atIndex($list, 1), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      atIndex($list, 1).set(4)

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith([
        1,
        4,
        3
      ], [
        1,
        2,
        3
      ])
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith(4, 2)

      off()
      offChild()
    })

    it('should update child by root', () => {
      const $list = signal([
        1,
        2,
        3
      ])

      expect(atIndex($list, 1).get()).toBe(2)

      updateList($list, (list) => {
        list[1] = 4
      })

      expect(atIndex($list, 1).get()).toBe(4)
    })

    it('should update child by root and notify listeners', () => {
      const $list = signal([
        1,
        2,
        3
      ])
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($list, rootListener)
      const offChild = listen(atIndex($list, 1), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      expect(atIndex($list, 1).get()).toBe(2)

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
      ])
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith(4, 2)

      off()
      offChild()
    })

    it('should get item by dynamic index', () => {
      const $list = signal([
        1,
        2,
        3
      ])
      const $key = signal(1)
      const $item = atIndex($list, $key)

      expect($item.get()).toBe(2)

      $key.set(2)

      expect($item.get()).toBe(3)
    })

    it('should get item by index from computed store', () => {
      const $item = signal(2)
      const $list = computed(get => [
        1,
        get($item),
        3
      ])

      expect($list.get()).toEqual([
        1,
        2,
        3
      ])
      expect(atIndex($list, 1).get()).toBe(2)

      $item.set(4)

      expect($list.get()).toEqual([
        1,
        4,
        3
      ])
      expect(atIndex($list, 1).get()).toBe(4)
    })

    it('should be fitable for loop', () => {
      const $list = signal([
        'one',
        'two',
        'three'
      ])
      const $oneIndex = signal(0)
      const $twoIndex = signal(1)
      const $threeIndex = signal(2)
      const $one = atIndex($list, $oneIndex)
      const $two = atIndex($list, $twoIndex)
      const $three = atIndex($list, $threeIndex)
      const onListChange = vi.fn((v) => {
        $oneIndex.set(v.indexOf('one'))
        $twoIndex.set(v.indexOf('two'))
        $threeIndex.set(v.indexOf('three'))
      })
      const onOneChange = vi.fn()
      const onTwoChange = vi.fn()
      const onThreeChange = vi.fn()
      const offList = listen($list, onListChange)
      const offOne = listen($one, onOneChange)
      const offTwo = listen($two, onTwoChange)
      const offThree = listen($three, onThreeChange)

      $list.set([
        'three',
        'one',
        'two'
      ])

      expect(onListChange).toHaveBeenCalledTimes(1)
      expect(onOneChange).toHaveBeenCalledTimes(0)
      expect(onTwoChange).toHaveBeenCalledTimes(0)
      expect(onThreeChange).toHaveBeenCalledTimes(0)

      offList()
      offOne()
      offTwo()
      offThree()
    })

    it('should work with record', () => {
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
      const $list = signal(users)

      expect($list.get()).toEqual(users)
      expect(atIndex($list, 1).get()).toEqual(users[1])
      expect(record(atIndex($list, 1)).name.get()).toBe('Savva')

      record(atIndex($list, 1)).name.set('Savva B')

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
      expect(atIndex($list, 1).get()).toEqual({
        name: 'Savva B',
        location: 'Tallinn'
      })
      expect(record(atIndex($list, 1)).name.get()).toBe('Savva B')
    })
  })
})
