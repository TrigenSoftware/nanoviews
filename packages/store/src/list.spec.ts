import {
  describe,
  it,
  expect
} from 'vitest'
import {
  signal,
  updateList
} from 'kida'
import { atFoundIndex } from './list.js'

describe('store', () => {
  describe('list', () => {
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
      const $bob = atFoundIndex($list, item => item.id === 2)

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
      const $firstActive = atFoundIndex($list, item => item.active)

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
