import {
  describe,
  it,
  expect
} from 'vitest'
import { atom } from 'nanostores'
import { toStore } from './utils.js'

describe('nanoviews', () => {
  describe('utils', () => {
    describe('toStore', () => {
      it('should create store from value', () => {
        const value = 'value'
        const store = toStore(value, atom)

        expect(store.get()).toBe(value)
      })

      it('should return store', () => {
        const store = atom('value')
        const result = toStore(store, atom)

        expect(result).toBe(store)
      })
    })
  })
})
