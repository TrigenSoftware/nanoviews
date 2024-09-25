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
import { updateList } from './list.js'
import { entities } from './entities.js'

const sample = [
  {
    id: 1,
    value: 1
  },
  {
    id: 2,
    value: 2
  },
  {
    id: 3,
    value: 3
  }
]

describe('stores', () => {
  describe('entities', () => {
    it('should create entities store', () => {
      const $entities = entities(sample)

      expect($entities.get()).toEqual(sample)
      expect($entities.at(0)).toSatisfy(isStore)
      expect($entities.at(1)).toSatisfy(isStore)
      expect($entities.at(2)).toSatisfy(isStore)

      expect($entities.at(0).get()).toEqual(sample[0])
      expect($entities.at(1).get()).toEqual(sample[1])
      expect($entities.at(2).get()).toEqual(sample[2])

      expect($entities.byId(1).get()).toEqual(sample[0])
      expect($entities.byId(2).get()).toEqual(sample[1])
      expect($entities.byId(3).get()).toEqual(sample[2])
    })

    it('should update root by child', () => {
      const $entities = entities(sample)

      expect($entities.at(1).get()).toEqual(sample[1])

      $entities.at(1).set({
        id: 2,
        value: 4
      })

      expect($entities.at(1).get()).toEqual({
        id: 2,
        value: 4
      })
      expect($entities.get()).toEqual([
        sample[0],
        {
          id: 2,
          value: 4
        },
        sample[2]
      ])
    })

    it('should update root by child and notify listeners', () => {
      const $entities = entities(sample)
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($entities, rootListener)
      const offChild = listen($entities.at(1), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      $entities.at(1).set({
        id: 2,
        value: 4
      })

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith([
        sample[0],
        {
          id: 2,
          value: 4
        },
        sample[2]
      ], sample, {})
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith({
        id: 2,
        value: 4
      }, sample[1], {})

      off()
      offChild()
    })

    it('should update child by root', () => {
      const $entities = entities(sample)

      expect($entities.at(1).get()).toEqual(sample[1])

      updateList($entities, (list) => {
        list[1] = {
          id: 2,
          value: 4
        }
      })

      expect($entities.at(1).get()).toEqual({
        id: 2,
        value: 4
      })
    })

    it('should update child by root and notify listeners', () => {
      const $entities = entities(sample)
      const rootListener = vi.fn()
      const childListener = vi.fn()
      const off = listen($entities, rootListener)
      const offChild = listen($entities.at(1), childListener)

      expect(rootListener).not.toHaveBeenCalled()
      expect(childListener).not.toHaveBeenCalled()

      expect($entities.at(1).get()).toEqual(sample[1])

      updateList($entities, (list) => {
        list[1] = {
          id: 2,
          value: 4
        }
      })

      expect(rootListener).toHaveBeenCalledTimes(1)
      expect(rootListener).toHaveBeenCalledWith([
        sample[0],
        {
          id: 2,
          value: 4
        },
        sample[2]
      ], sample, {})
      expect(childListener).toHaveBeenCalledTimes(1)
      expect(childListener).toHaveBeenCalledWith({
        id: 2,
        value: 4
      }, sample[1], {})

      off()
      offChild()
    })

    it('should create list store from other store', () => {
      const $item = atom(2)
      const $entities = entities(computed($item, item => [
        sample[0],
        {
          id: 2,
          value: item
        },
        sample[2]
      ]))

      expect($entities.get()).toEqual([
        sample[0],
        {
          id: 2,
          value: 2
        },
        sample[2]
      ])
      expect($entities.at(1).get()).toEqual({
        id: 2,
        value: 2
      })

      $item.set(4)

      expect($entities.get()).toEqual([
        sample[0],
        {
          id: 2,
          value: 4
        },
        sample[2]
      ])
      expect($entities.at(1).get()).toEqual({
        id: 2,
        value: 4
      })
    })

    it('should create list store with item type', () => {
      const users = [
        {
          id: 1,
          name: 'Dan',
          location: 'Batumi'
        },
        {
          id: 2,
          name: 'Savva',
          location: 'Tallinn'
        },
        {
          id: 3,
          name: 'Diman',
          location: 'Novosibirsk'
        }
      ]
      const $entities = entities(users, record)

      expect($entities.get()).toEqual(users)
      expect($entities.at(1).get()).toEqual(users[1])
      expect($entities.at(1).name.get()).toBe('Savva')

      $entities.at(1).name.set('Savva B')

      expect($entities.get()).toEqual([
        {
          id: 1,
          name: 'Dan',
          location: 'Batumi'
        },
        {
          id: 2,
          name: 'Savva B',
          location: 'Tallinn'
        },
        {
          id: 3,
          name: 'Diman',
          location: 'Novosibirsk'
        }
      ])
      expect($entities.at(1).get()).toEqual({
        id: 2,
        name: 'Savva B',
        location: 'Tallinn'
      })
      expect($entities.at(1).name.get()).toBe('Savva B')
    })

    it('should track reorder', () => {
      const $entities = entities(sample)
      const $0 = $entities.at(0)
      const $1 = $entities.at(1)
      const $2 = $entities.at(2)

      expect($0.get()).toEqual(sample[0])
      expect($1.get()).toEqual(sample[1])
      expect($2.get()).toEqual(sample[2])

      $entities.set([
        sample[2],
        sample[0],
        sample[1]
      ])

      expect($0.get()).toEqual(sample[0])
      expect($1.get()).toEqual(sample[1])
      expect($2.get()).toEqual(sample[2])

      expect($0).toBe($entities.at(1))
      expect($1).toBe($entities.at(2))
      expect($2).toBe($entities.at(0))
    })

    it('should get by id', () => {
      const $entities = entities(sample)
      const $id1 = $entities.byId(1)
      const $id2 = $entities.byId(2)
      const $id3 = $entities.byId(3)

      expect($id1.get()).toEqual(sample[0])
      expect($id2.get()).toEqual(sample[1])
      expect($id3.get()).toEqual(sample[2])

      $entities.set([
        sample[2],
        sample[0],
        sample[1]
      ])

      expect($id1.get()).toEqual(sample[0])
      expect($id2.get()).toEqual(sample[1])
      expect($id3.get()).toEqual(sample[2])

      expect($id1).toBe($entities.at(1))
      expect($id2).toBe($entities.at(2))
      expect($id3).toBe($entities.at(0))
    })

    it('should get by dynamic index', () => {
      const $entities = entities(sample)
      const $index = atom(1)
      const $atIndex = $entities.at($index)

      expect($atIndex.get()).toEqual(sample[1])

      $index.set(2)

      expect($atIndex.get()).toEqual(sample[2])

      $entities.set([
        sample[2],
        sample[0],
        sample[1]
      ])

      expect($atIndex.get()).toEqual(sample[2])
    })

    it('should get by dynamic id', () => {
      const $entities = entities(sample)
      const $id = atom(1)
      const $byId = $entities.byId($id)

      expect($byId.get()).toEqual(sample[0])

      $id.set(2)

      expect($byId.get()).toEqual(sample[1])

      $entities.set([
        sample[2],
        sample[0],
        sample[1]
      ])

      expect($byId.get()).toEqual(sample[1])
    })
  })
})
