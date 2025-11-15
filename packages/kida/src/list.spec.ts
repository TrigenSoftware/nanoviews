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
  computed,
  startBatch,
  endBatch
} from 'agera'
import { record } from './record.js'
import {
  atIndex,
  atFindIndex,
  updateList
} from './list.js'

describe('kida', () => {
  describe('list', () => {
    it('should get item by index', () => {
      const $list = signal([
        1,
        2,
        3
      ])

      expect($list()).toEqual([
        1,
        2,
        3
      ])
      expect(atIndex($list, 0)).toSatisfy(isSignal)
      expect(atIndex($list, 1)).toSatisfy(isSignal)
      expect(atIndex($list, 2)).toSatisfy(isSignal)

      expect(atIndex($list, 0)()).toBe(1)
      expect(atIndex($list, 1)()).toBe(2)
      expect(atIndex($list, 2)()).toBe(3)
    })

    it('should update root by child', () => {
      const $list = signal([
        1,
        2,
        3
      ])

      expect(atIndex($list, 1)()).toBe(2)

      atIndex($list, 1)(4)

      expect(atIndex($list, 1)()).toBe(4)
      expect($list()).toEqual([
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
      const off = effect(() => {
        rootListener($list())
      })
      const offChild = effect(() => {
        childListener(atIndex($list, 1)())
      })

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledTimes(1)

      atIndex($list, 1)(4)

      expect(rootListener).toHaveBeenCalledTimes(2)
      expect(rootListener).toHaveBeenCalledWith([
        1,
        4,
        3
      ])
      expect(childListener).toHaveBeenCalledTimes(2)
      expect(childListener).toHaveBeenCalledWith(4)

      off()
      offChild()
    })

    it('should update child by root', () => {
      const $list = signal([
        1,
        2,
        3
      ])

      expect(atIndex($list, 1)()).toBe(2)

      updateList($list, (list) => {
        list[1] = 4
      })

      expect(atIndex($list, 1)()).toBe(4)
    })

    it('should update child by root and notify listeners', () => {
      const $list = signal([
        1,
        2,
        3
      ])
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = effect(() => {
        rootListener($list())
      })
      const offChild = effect(() => {
        childListener(atIndex($list, 1)())
      })

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledTimes(1)

      expect(atIndex($list, 1)()).toBe(2)

      updateList($list, (list) => {
        list[1] = 4
      })

      expect(rootListener).toHaveBeenCalledTimes(2)
      expect(rootListener).toHaveBeenCalledWith([
        1,
        4,
        3
      ])
      expect(childListener).toHaveBeenCalledTimes(2)
      expect(childListener).toHaveBeenCalledWith(4)

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

      expect($item()).toBe(2)

      $key(2)

      expect($item()).toBe(3)
    })

    it('should get item by index from computed store', () => {
      const $item = signal(2)
      const $list = computed(() => [
        1,
        $item(),
        3
      ])

      expect($list()).toEqual([
        1,
        2,
        3
      ])
      expect(atIndex($list, 1)()).toBe(2)

      $item(4)

      expect($list()).toEqual([
        1,
        4,
        3
      ])
      expect(atIndex($list, 1)()).toBe(4)
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
        startBatch()
        $oneIndex(v.indexOf('one'))
        $twoIndex(v.indexOf('two'))
        $threeIndex(v.indexOf('three'))
        endBatch()
      })
      const onOneChange = vi.fn()
      const onTwoChange = vi.fn()
      const onThreeChange = vi.fn()
      const offList = effect((warmup) => {
        const v = $list()

        if (!warmup) {
          onListChange(v)
        }
      })
      const offOne = effect((warmup) => {
        const v = $one()

        if (!warmup) {
          onOneChange(v)
        }
      })
      const offTwo = effect((warmup) => {
        const v = $two()

        if (!warmup) {
          onTwoChange(v)
        }
      })
      const offThree = effect((warmup) => {
        const v = $three()

        if (!warmup) {
          onThreeChange(v)
        }
      })

      $list([
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

      expect($list()).toEqual(users)
      expect(atIndex($list, 1)()).toEqual(users[1])
      expect(record(atIndex($list, 1)).$name()).toBe('Savva')

      record(atIndex($list, 1)).$name('Savva B')

      expect($list()).toEqual([
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
      expect(atIndex($list, 1)()).toEqual({
        name: 'Savva B',
        location: 'Tallinn'
      })
      expect(record(atIndex($list, 1)).$name()).toBe('Savva B')
    })

    it('should get item by predicate', () => {
      const $list = signal([
        {
          id: 1,
          name: 'Alice'
        },
        {
          id: 2,
          name: 'Bob'
        },
        {
          id: 3,
          name: 'Charlie'
        }
      ])
      const $bob = atFindIndex($list, item => item.id === 2)

      expect($bob()).toEqual({
        id: 2,
        name: 'Bob'
      })

      $bob({
        id: 2,
        name: 'Bobby'
      })

      expect($list()).toEqual([
        {
          id: 1,
          name: 'Alice'
        },
        {
          id: 2,
          name: 'Bobby'
        },
        {
          id: 3,
          name: 'Charlie'
        }
      ])
      expect($bob()).toEqual({
        id: 2,
        name: 'Bobby'
      })
    })

    it('should track predicate result changes', () => {
      const $list = signal([
        {
          id: 1,
          name: 'Alice',
          active: false
        },
        {
          id: 2,
          name: 'Bob',
          active: true
        },
        {
          id: 3,
          name: 'Charlie',
          active: false
        }
      ])
      const $firstActive = atFindIndex($list, item => item.active)

      expect($firstActive()).toEqual({
        id: 2,
        name: 'Bob',
        active: true
      })

      updateList($list, (list) => {
        [list[0], list[1]] = [list[1], list[0]]
      })

      expect($list()).toEqual([
        {
          id: 2,
          name: 'Bob',
          active: true
        },
        {
          id: 1,
          name: 'Alice',
          active: false
        },
        {
          id: 3,
          name: 'Charlie',
          active: false
        }
      ])

      expect($firstActive()).toEqual({
        id: 2,
        name: 'Bob',
        active: true
      })
    })
  })
})
