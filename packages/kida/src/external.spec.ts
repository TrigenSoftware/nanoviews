import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import {
  type WritableSignal,
  type NewValue,
  mountable,
  effect,
  isFunction
} from 'agera'
import { onMount } from './lifecycle.js'
import { external } from './external.js'

describe('kida', () => {
  describe('external', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should run factory first on first get', () => {
      let setter: WritableSignal<number>
      const unmountListener = vi.fn()
      const mountListener = vi.fn(() => unmountListener)
      const factory = vi.fn(($source: WritableSignal<number>) => {
        setter = $source
        $source(404)

        onMount(mountable($source), mountListener)
      })
      const $ext = external(factory)

      expect($ext()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(0)

      const listener = vi.fn()
      const off = effect((warmup) => {
        const value = $ext()

        if (!warmup) {
          listener(value)
        }
      })

      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(1)
      expect(unmountListener).toHaveBeenCalledTimes(0)

      setter!(200)

      expect($ext()).toBe(200)
      expect(listener).toHaveBeenCalledWith(200)

      off()
      vi.runAllTimers()

      expect(mountListener).toHaveBeenCalledTimes(1)
      expect(unmountListener).toHaveBeenCalledTimes(1)
    })

    it('should run factory only once', () => {
      const factory = vi.fn(($source: WritableSignal<number>) => {
        $source(404)

        return vi.fn()
      })
      const $ext = external(factory)

      expect($ext()).toBe(404)
      expect($ext()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
    })

    it('should run factory on set', () => {
      const mountListener = vi.fn()
      const factory = vi.fn(($source: WritableSignal<number>) => {
        $source(404)

        onMount(mountable($source), mountListener)
      })
      const $ext = external<number>(factory)

      $ext(200)

      expect($ext()).toBe(200)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(0)

      const off = effect(() => {
        $ext()
      })

      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(1)

      off()
      vi.runAllTimers()

      expect(mountListener).toHaveBeenCalledTimes(1)
    })

    it('should call setter returned from factory', () => {
      let setListener
      const factory = vi.fn(($source: WritableSignal<number>) => {
        setListener = vi.fn((value: NewValue<number>) => $source(
          isFunction(value)
            ? newValue => value(newValue) * 2
            : value * 2
        ))

        return setListener
      })
      const $ext = external<number>(factory)

      $ext(200)

      expect($ext()).toBe(400)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(setListener).toHaveBeenCalledTimes(1)

      const off = effect(() => {
        $ext()
      })

      expect(factory).toHaveBeenCalledTimes(1)
      expect(setListener).toHaveBeenCalledTimes(1)

      $ext(2)

      expect($ext()).toBe(4)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(setListener).toHaveBeenCalledTimes(2)

      $ext(prev => prev + 3)

      expect($ext()).toBe(14)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(setListener).toHaveBeenCalledTimes(3)

      off()
      vi.runAllTimers()

      expect(setListener).toHaveBeenCalledTimes(3)
    })
  })
})
