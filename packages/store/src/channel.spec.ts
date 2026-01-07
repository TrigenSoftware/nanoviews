/* eslint-disable @typescript-eslint/no-deprecated */
import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  effect,
  signal,
  isSignal
} from 'kida'
import { channel } from './channel.js'

const mockFetch = (value: string, signal: AbortSignal) => new Promise<string>((resolve, reject) => {
  signal.addEventListener('abort', () => {
    const error = new Error('Aborted')

    error.name = 'AbortError'

    reject(error)
  })

  setTimeout(() => resolve(value))
})

describe('store', () => {
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

      expect($loading()).toBe(false)
      expect($error()).toBe(undefined)
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

      expect($loading()).toBe(false)
      expect($error()).toBe(undefined)

      task(() => promise)

      expect($loading()).toBe(true)
      expect($error()).toBe(undefined)

      resolve!('resolved')
      await promise

      expect($loading()).toBe(false)
      expect($error()).toBe(undefined)
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

      expect($loading()).toBe(false)
      expect($error()).toBe(undefined)

      task(() => promise)

      expect($loading()).toBe(true)
      expect($error()).toBe(undefined)

      reject!('rejected')

      try {
        await promise
      } catch {}

      expect($loading()).toBe(false)
      expect($error()).toBe('rejected')
    })

    it('should abort previous promise', async () => {
      const $value = signal('initial')
      const [
        task,
        $loading,
        $error
      ] = channel(tasks)
      const valueListener = vi.fn()
      const offValueListener = effect(() => {
        valueListener($value())
      })
      const stateListener = vi.fn()
      const offStateListener = effect(() => {
        stateListener($loading())
      })

      await Promise.allSettled([
        task(async (signal) => {
          $value(await mockFetch('1', signal))
        }),
        task(async (signal) => {
          $value(await mockFetch('2', signal))
        }),
        task(async (signal) => {
          $value(await mockFetch('3', signal))
        })
      ])

      expect($value()).toBe('3')
      expect($loading()).toBe(false)
      expect($error()).toBe(undefined)
      expect(valueListener).toHaveBeenCalledTimes(2)
      expect(valueListener).toHaveBeenCalledWith('3')
      expect(stateListener).toHaveBeenCalledTimes(3)

      offValueListener()
      offStateListener()
    })
  })
})
