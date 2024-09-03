import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { isStore } from './utils.js'
import { listen } from './lifecycle.js'
import { record } from './record.js'
import { async } from './async.js'

const mockFetch = (value: string, signal: AbortSignal) => new Promise<string>((resolve, reject) => {
  signal.addEventListener('abort', () => {
    const error = new Error('Aborted')

    error.name = 'AbortError'

    reject(error)
  })

  setTimeout(() => resolve(value))
})

describe('stores', () => {
  describe('async', () => {
    it('should create async store', () => {
      const $async = async('initial')
      const [
        $value,
        $error,
        $state
      ] = $async

      expect($async).toSatisfy(isStore)
      expect($value).toSatisfy(isStore)
      expect($error).toSatisfy(isStore)
      expect($state).toSatisfy(isStore)
      expect($async).toBe($value)

      expect($value.get()).toBe('initial')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')
    })

    it('should handle promise resolve', async () => {
      let resolve: (value: string) => void
      const promise = new Promise<string>((r) => {
        resolve = r
      })
      const [
        $value,
        $error,
        $state
      ] = async('initial')

      expect($value.get()).toBe('initial')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')

      $value.run(promise)

      expect($value.get()).toBe('initial')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('pending')

      resolve!('resolved')
      await promise

      expect($value.get()).toBe('resolved')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')
    })

    it('should handle promise reject', async () => {
      let reject: (value: string) => void
      const promise = new Promise<string>((_, r) => {
        reject = r
      })
      const [
        $value,
        $error,
        $state
      ] = async('initial')

      expect($value.get()).toBe('initial')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')

      $value.run(promise)

      expect($value.get()).toBe('initial')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('pending')

      reject!('rejected')

      try {
        await promise
      } catch (e) {
        /* ignore */
      }

      expect($value.get()).toBe('initial')
      expect($error.get()).toBe('rejected')
      expect($state.get()).toBe('rejected')
    })

    it('should ignore previous promise', async () => {
      const [
        $value,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _$error,
        $state
      ] = async('initial')
      const valueListener = vi.fn()
      const offValueListener = listen($value, valueListener)
      const stateListener = vi.fn()
      const offStateListener = listen($state, stateListener)
      const pr1 = Promise.resolve('1')
      const pr2 = Promise.resolve('2')
      const pr3 = Promise.resolve('3')

      $value.run(pr1)
      $value.run(pr2)
      $value.run(pr3)

      await Promise.all([
        pr1,
        pr2,
        pr3
      ])

      expect($value.get()).toBe('3')
      expect(valueListener).toHaveBeenCalledTimes(1)
      expect(valueListener).toHaveBeenCalledWith('3', 'initial', {})
      expect(stateListener).toHaveBeenCalledTimes(2)

      offValueListener()
      offStateListener()
    })

    it('should abort previous promise', async () => {
      const [
        $value,
        $error,
        $state
      ] = async('initial')
      const valueListener = vi.fn()
      const offValueListener = listen($value, valueListener)
      const stateListener = vi.fn()
      const offStateListener = listen($state, stateListener)
      const ac1 = new AbortController()
      const pr1 = mockFetch('1', ac1.signal)
      const ac2 = new AbortController()
      const pr2 = mockFetch('2', ac2.signal)
      const ac3 = new AbortController()
      const pr3 = mockFetch('3', ac3.signal)

      $value.run(pr1, ac1)
      $value.run(pr2, ac2)
      $value.run(pr3, ac3)

      await Promise.allSettled([
        pr1,
        pr2,
        pr3
      ])

      expect($value.get()).toBe('3')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')
      expect(valueListener).toHaveBeenCalledTimes(1)
      expect(valueListener).toHaveBeenCalledWith('3', 'initial', {})
      expect(stateListener).toHaveBeenCalledTimes(2)
      expect(ac1.signal.aborted).toBe(true)
      expect(ac2.signal.aborted).toBe(true)
      expect(ac3.signal.aborted).toBe(false)

      offValueListener()
      offStateListener()
    })

    it('should work in combination with wrapper stores', async () => {
      interface User {
        name: string
      }

      let resolve: (value: User) => void
      const promise = new Promise<User>((r) => {
        resolve = r
      })
      const $store = record(async<User | null>(null))
      const [
        $value,
        $error,
        $state
      ] = $store

      expect($value.get()).toBe(null)
      expect($value.name.get()).toBe(null)
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')

      $value.run(promise)

      expect($value.get()).toBe(null)
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('pending')

      resolve!({
        name: 'dangreen'
      })
      await promise

      expect($value.get()).toEqual({
        name: 'dangreen'
      })
      expect($value.name.get()).toBe('dangreen')
      expect($error.get()).toBe(undefined)
      expect($state.get()).toBe('fulfilled')
    })
  })
})
