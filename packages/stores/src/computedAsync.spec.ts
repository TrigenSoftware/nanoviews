import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import { atom } from './atom.js'
import { listen } from './lifecycle.js'
import { allTasks } from './tasks.js'
import { computedAsync } from './computedAsync.js'

describe('stores', () => {
  describe('computedAsync', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should compute signle value', async () => {
      const $a = atom(1)
      const [
        $b,
        $error,
        $state
      ] = computedAsync($a, value => Promise.resolve(`${value + 1}`))
      const listener = vi.fn()

      expect($b.get()).toBe(undefined)
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')

      const off = listen($b, listener)

      expect($b.get()).toBe(undefined)
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('pending')

      await allTasks()

      expect(listener).toHaveBeenCalledWith('2', undefined, {})
      expect(listener).toHaveBeenCalledTimes(1)
      expect($b.get()).toBe('2')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')

      off()
      vi.runAllTimers()
    })

    it('should return default value while turned off', () => {
      const $a = atom(1)
      const $b = computedAsync($a, value => Promise.resolve(`${value + 1}`), null)

      expect($b.get()).toBe(null)

      $a.set(2)

      expect($b.get()).toBe(null)
    })
  })
})
