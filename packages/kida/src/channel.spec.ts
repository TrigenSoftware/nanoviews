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
    const tasks = new Set<Promise<unknown>>()

    it('should create channel', () => {
      const [
        task,
        $loading,
        $error
      ] = channel(tasks)

      expect(task).toBeTypeOf('function')
      expect($loading).toSatisfy(isSignal)
      expect($error).toSatisfy(isSignal)

      expect($loading.get()).toBe(false)
      expect($error.get()).toBe(undefined)
    })

    it('should handle promise', async () => {
      let resolve: (value: string) => void
      const promise = new Promise<string>((r) => {
        resolve = r
      })
      const [
        task,
        $loading,
        $error
      ] = channel(tasks)

      expect($loading.get()).toBe(false)
      expect($error.get()).toBe(undefined)

      task(() => promise)

      expect($loading.get()).toBe(true)
      expect($error.get()).toBe(undefined)

      resolve!('resolved')
      await promise

      expect($loading.get()).toBe(false)
      expect($error.get()).toBe(undefined)
    })

    it('should handle promise reject', async () => {
      let reject: (value: string) => void
      const promise = new Promise<string>((_, r) => {
        reject = r
      })
      const [
        task,
        $loading,
        $error
      ] = channel(tasks, _ => _)

      expect($loading.get()).toBe(false)
      expect($error.get()).toBe(undefined)

      task(() => promise)

      expect($loading.get()).toBe(true)
      expect($error.get()).toBe(undefined)

      reject!('rejected')

      try {
        await promise
      } catch (e) {
        /* ignore */
      }

      expect($loading.get()).toBe(false)
      expect($error.get()).toBe('rejected')
    })

    it('should abort previous promise', async () => {
      const $value = signal('initial')
      const [
        task,
        $loading,
        $error
      ] = channel(tasks)
      const valueListener = vi.fn()
      const offValueListener = listen($value, valueListener)
      const stateListener = vi.fn()
      const offStateListener = listen($loading, stateListener)

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
      expect($loading.get()).toBe(false)
      expect($error.get()).toBe(undefined)
      expect(valueListener).toHaveBeenCalledTimes(1)
      expect(valueListener).toHaveBeenCalledWith('3', 'initial')
      expect(stateListener).toHaveBeenCalledTimes(2)

      offValueListener()
      offStateListener()
    })
  })
})
