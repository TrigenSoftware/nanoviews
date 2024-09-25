import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import { atom } from './atom.js'
import {
  STORE_UNMOUNT_DELAY,
  listen,
  onStart,
  onStop,
  onMount
} from './lifecycle.js'

describe('stores', () => {
  describe('internals', () => {
    describe('lifecycle', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      describe('listen', () => {
        it('should listen store change', () => {
          const $atom = atom(1)
          const listener = vi.fn()
          const off = listen($atom, listener)

          $atom.set(1)
          expect(listener).not.toHaveBeenCalled()

          $atom.set(2)
          expect(listener).toHaveBeenCalledWith(2, 1, {})

          $atom.set(3)
          expect(listener).toHaveBeenCalledWith(3, 2, {})

          off()
          $atom.set(4)
          expect(listener).toHaveBeenCalledTimes(2)
        })
      })

      describe('onStart', () => {
        it('should dispatch onStart event', () => {
          const $atom = atom(1)
          const listener = vi.fn()
          const off1 = listen($atom, () => {})

          onStart($atom, listener)

          expect(listener).not.toHaveBeenCalled()

          const off2 = listen($atom, () => {})

          expect(listener).not.toHaveBeenCalled()

          off1()
          off2()

          const off3 = listen($atom, () => {})

          expect(listener).toHaveBeenCalledTimes(1)

          off3()
          listen($atom, () => {})

          expect(listener).toHaveBeenCalledTimes(2)
        })

        it('should not dispatch onStart event on get', () => {
          const $atom = atom(1)
          const listener = vi.fn()
          const off1 = listen($atom, () => {})

          onStart($atom, listener)

          $atom.get()

          expect(listener).not.toHaveBeenCalled()

          off1()
        })
      })

      describe('onStop', () => {
        it('should dispatch onStop event', () => {
          const $atom = atom(1)
          const listener = vi.fn()

          onStop($atom, listener)

          expect(listener).not.toHaveBeenCalled()

          const off1 = listen($atom, () => {})

          expect(listener).not.toHaveBeenCalled()

          off1()

          expect(listener).toHaveBeenCalledTimes(1)
        })
      })

      describe('onMount', () => {
        it('should dispatch onMount event', () => {
          const $atom = atom(1)
          const unmount = vi.fn()
          const mount = vi.fn(() => unmount)
          const off1 = listen($atom, () => {})

          onMount($atom, mount)

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          const off2 = listen($atom, () => {})

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          off1()
          off2()

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          const off3 = listen($atom, () => {})

          vi.runAllTimers()

          expect(mount).toHaveBeenCalledTimes(1)
          expect(unmount).not.toHaveBeenCalled()

          off3()

          vi.runAllTimers()

          expect(mount).toHaveBeenCalledTimes(1)
          expect(unmount).toHaveBeenCalledTimes(1)
        })

        it('should debounce unmount callback', () => {
          const $atom = atom(1)
          const unmount = vi.fn()
          const mount = vi.fn(() => unmount)
          let off1: () => void

          onMount($atom, mount)

          off1 = listen($atom, () => {})
          off1()
          vi.advanceTimersByTime(100)
          off1 = listen($atom, () => {})
          off1()
          vi.advanceTimersByTime(100)
          off1 = listen($atom, () => {})
          off1()
          vi.advanceTimersByTime(STORE_UNMOUNT_DELAY + 1)

          expect(mount).toHaveBeenCalledTimes(1)
          expect(unmount).toHaveBeenCalledTimes(1)

          off1 = listen($atom, () => {})
          off1()
          vi.advanceTimersByTime(STORE_UNMOUNT_DELAY + 1)

          expect(mount).toHaveBeenCalledTimes(2)
          expect(unmount).toHaveBeenCalledTimes(2)
        })
      })
    })
  })
})
