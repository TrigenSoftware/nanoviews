import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  onMount,
  listen
} from './lifecycle.js'
import { lazy } from './lazy.js'

describe('stores', () => {
  describe('lazy', () => {
    it('should run factory on first get', () => {
      const factory = vi.fn(() => 404)
      const $lazy = lazy(factory)

      expect($lazy.get()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
    })

    it('should run factory only once', () => {
      const factory = vi.fn(() => 404)
      const $lazy = lazy(factory)

      expect($lazy.get()).toBe(404)
      expect($lazy.get()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
    })

    it('should not run factory on set', () => {
      const factory = vi.fn(() => 404)
      const $lazy = lazy(factory)

      $lazy.set(200)

      expect($lazy.get()).toBe(200)
      expect(factory).toHaveBeenCalledTimes(0)
    })

    it('should run factory on mount', () => {
      const factory = vi.fn(() => 404)
      const mountListener = vi.fn()
      const changeListener = vi.fn()
      const $lazy = lazy(factory)

      expect(factory).toHaveBeenCalledTimes(0)

      onMount($lazy, mountListener)

      const off = listen($lazy, changeListener)

      expect($lazy.get()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(1)

      $lazy.set(200)

      expect(changeListener).toHaveBeenCalledTimes(1)
      expect(changeListener).toHaveBeenCalledWith(200, 404)

      off()
    })
  })
})
