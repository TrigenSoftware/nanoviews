import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import { listen } from './lifecycle.js'
import { external } from './external.js'

describe('stores', () => {
  describe('external', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should run factory first on first get', () => {
      let setter: (value: number) => void
      const unmountListener = vi.fn()
      const mountListener = vi.fn(() => unmountListener)
      const factory = vi.fn((set: (value: number) => void) => {
        setter = set
        set(404)

        return mountListener
      })
      const $ext = external(factory)

      expect($ext.get()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(0)

      const listener = vi.fn()
      const off = listen($ext, listener)

      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(1)
      expect(unmountListener).toHaveBeenCalledTimes(0)

      setter!(200)

      expect($ext.get()).toBe(200)
      expect(listener).toHaveBeenCalledWith(200, 404)

      off()
      vi.runAllTimers()

      expect(mountListener).toHaveBeenCalledTimes(1)
      expect(unmountListener).toHaveBeenCalledTimes(1)
    })

    it('should run factory only once', () => {
      const factory = vi.fn((set: (value: number) => void) => {
        set(404)

        return vi.fn()
      })
      const $ext = external(factory)

      expect($ext.get()).toBe(404)
      expect($ext.get()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
    })

    it('should not run factory on set', () => {
      const mountListener = vi.fn()
      const factory = vi.fn((set: (value: number) => void) => {
        set(404)

        return mountListener
      })
      const $ext = external(factory)

      $ext.set(200)

      expect($ext.get()).toBe(200)
      expect(factory).toHaveBeenCalledTimes(0)
      expect(mountListener).toHaveBeenCalledTimes(0)

      const off = listen($ext, vi.fn())

      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(1)

      off()
      vi.runAllTimers()

      expect(mountListener).toHaveBeenCalledTimes(1)
    })
  })
})
