import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { effect } from 'agera'
import { onMount } from './lifecycle.js'
import { lazy } from './lazy.js'

describe('kida', () => {
  describe('lazy', () => {
    it('should run factory on first get', () => {
      const factory = vi.fn(() => 404)
      const $lazy = lazy(factory)

      expect($lazy()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
    })

    it('should run factory only once', () => {
      const factory = vi.fn(() => 404)
      const $lazy = lazy(factory)

      expect($lazy()).toBe(404)
      expect($lazy()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
    })

    it('should not run factory on set', () => {
      const factory = vi.fn(() => 404)
      const $lazy = lazy(factory)

      $lazy(200)

      expect($lazy()).toBe(200)
      expect(factory).toHaveBeenCalledTimes(0)
    })

    it('should run factory on mount', () => {
      const factory = vi.fn(() => 404)
      const mountListener = vi.fn()
      const changeListener = vi.fn()
      const $lazy = lazy(factory)

      expect(factory).toHaveBeenCalledTimes(0)

      onMount($lazy, mountListener)

      const off = effect((warmup) => {
        const value = $lazy()

        if (!warmup) {
          changeListener(value)
        }
      })

      expect($lazy()).toBe(404)
      expect(factory).toHaveBeenCalledTimes(1)
      expect(mountListener).toHaveBeenCalledTimes(1)

      $lazy(200)

      expect(changeListener).toHaveBeenCalledTimes(1)
      expect(changeListener).toHaveBeenCalledWith(200)

      off()
    })
  })
})
