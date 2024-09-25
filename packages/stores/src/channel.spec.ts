import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { isStore } from './utils.js'
import { listen } from './lifecycle.js'
import { atom } from './atom.js'
import { channel } from './channel.js'

const mockFetch = (value: string, signal: AbortSignal) => new Promise<string>((resolve, reject) => {
  signal.addEventListener('abort', () => {
    const error = new Error('Aborted')

    error.name = 'AbortError'

    reject(error)
  })

  setTimeout(() => resolve(value))
})

describe('stores', () => {
  describe('channel', () => {
    it('should create channel', () => {
      const [
        task,
        $state,
        $error
      ] = channel()

      expect(task).toBeTypeOf('function')
      expect($state).toSatisfy(isStore)
      expect($error).toSatisfy(isStore)

      expect($state.get()).toBe('fulfilled')
      expect($error.get()).toBe(undefined)
    })

    it('should handle promise', async () => {
      let resolve: (value: string) => void
      const promise = new Promise<string>((r) => {
        resolve = r
      })
      const [
        task,
        $state,
        $error
      ] = channel()

      expect($state.get()).toBe('fulfilled')
      expect($error.get()).toBe(undefined)

      task(() => promise)

      expect($state.get()).toBe('pending')
      expect($error.get()).toBe(undefined)

      resolve!('resolved')
      await promise

      expect($state.get()).toBe('fulfilled')
      expect($error.get()).toBe(undefined)
    })

    it('should handle promise reject', async () => {
      let reject: (value: string) => void
      const promise = new Promise<string>((_, r) => {
        reject = r
      })
      const [
        task,
        $state,
        $error
      ] = channel()

      expect($state.get()).toBe('fulfilled')
      expect($error.get()).toBe(undefined)

      task(() => promise)

      expect($state.get()).toBe('pending')
      expect($error.get()).toBe(undefined)

      reject!('rejected')

      try {
        await promise
      } catch (e) {
        /* ignore */
      }

      expect($state.get()).toBe('rejected')
      expect($error.get()).toBe('rejected')
    })

    it('should abort previous promise', async () => {
      const $value = atom('initial')
      const [
        task,
        $state,
        $error
      ] = channel()
      const valueListener = vi.fn()
      const offValueListener = listen($value, valueListener)
      const stateListener = vi.fn()
      const offStateListener = listen($state, stateListener)

      await Promise.allSettled([
        task(async (signal) => {
          $value.set(await mockFetch('1', signal))
        }),
        task(async (signal) => {
          $value.set(await mockFetch('2', signal))
        }),
        task(async (signal) => {
          $value.set(await mockFetch('3', signal))
        })
      ])

      expect($value.get()).toBe('3')
      expect($state.get()).toBe('fulfilled')
      expect($error.get()).toBe(undefined)
      expect(valueListener).toHaveBeenCalledTimes(1)
      expect(valueListener).toHaveBeenCalledWith('3', 'initial', {})
      expect(stateListener).toHaveBeenCalledTimes(2)

      offValueListener()
      offStateListener()
    })
  })
})
