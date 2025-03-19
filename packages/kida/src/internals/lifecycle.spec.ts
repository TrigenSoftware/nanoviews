import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import {
  signal,
  effect
} from 'agera'
import {
  STORE_UNMOUNT_DELAY,
  onStart,
  onStop,
  onMount
} from './lifecycle.js'

describe('kida', () => {
  describe('internals', () => {
    describe('lifecycle', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      describe('onStart', () => {
        it('should dispatch onStart event', () => {
          const $signal = signal(1)
          const listener = vi.fn()
          const off1 = effect(() => {
            $signal()
          })

          onStart($signal, listener)

          expect(listener).not.toHaveBeenCalled()

          const off2 = effect(() => {
            $signal()
          })

          expect(listener).not.toHaveBeenCalled()

          off1()
          off2()

          const off3 = effect(() => {
            $signal()
          })

          expect(listener).toHaveBeenCalledTimes(1)

          off3()
        })

        it('should not dispatch onStart event on get', () => {
          const $signal = signal(1)
          const listener = vi.fn()
          const off1 = effect(() => {
            $signal()
          })

          onStart($signal, listener)

          $signal()

          expect(listener).not.toHaveBeenCalled()

          off1()
        })

        it('should call listener while set value in onStart', () => {
          const $signal = signal(1)
          const listener = vi.fn()

          onStart($signal, () => {
            $signal(2)
          })

          const off1 = effect(() => {
            listener($signal())
          })

          expect(listener.mock.calls).toEqual([[1], [2]])

          off1()
        })
      })

      describe('onStop', () => {
        it('should dispatch onStop event', () => {
          const $signal = signal(1)
          const listener = vi.fn()

          onStop($signal, listener)

          expect(listener).not.toHaveBeenCalled()

          const off1 = effect(() => {
            $signal()
          })

          expect(listener).not.toHaveBeenCalled()

          off1()

          expect(listener).toHaveBeenCalledTimes(1)
        })
      })

      describe('onMount', () => {
        it('should dispatch onMount event', () => {
          const $signal = signal(1)
          const unmount = vi.fn()
          const mount = vi.fn(() => unmount)
          const off1 = effect(() => {
            $signal()
          })

          onMount($signal, mount)

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          const off2 = effect(() => {
            $signal()
          })

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          off1()
          off2()

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          const off3 = effect(() => {
            $signal()
          })

          vi.runAllTimers()

          expect(mount).toHaveBeenCalledTimes(1)
          expect(unmount).not.toHaveBeenCalled()

          off3()

          vi.runAllTimers()

          expect(mount).toHaveBeenCalledTimes(1)
          expect(unmount).toHaveBeenCalledTimes(1)
        })

        it('should debounce unmount callback', () => {
          const $signal = signal(1)
          const unmount = vi.fn()
          const mount = vi.fn(() => unmount)
          let off1: () => void

          onMount($signal, mount)

          off1 = effect(() => {
            $signal()
          })
          off1()
          vi.advanceTimersByTime(100)
          off1 = effect(() => {
            $signal()
          })
          off1()
          vi.advanceTimersByTime(100)
          off1 = effect(() => {
            $signal()
          })
          off1()
          vi.advanceTimersByTime(STORE_UNMOUNT_DELAY + 1)

          expect(mount).toHaveBeenCalledTimes(1)
          expect(unmount).toHaveBeenCalledTimes(1)

          off1 = effect(() => {
            $signal()
          })
          off1()
          vi.advanceTimersByTime(STORE_UNMOUNT_DELAY + 1)

          expect(mount).toHaveBeenCalledTimes(2)
          expect(unmount).toHaveBeenCalledTimes(2)
        })

        it('should call listener while set value in onMount', () => {
          const $signal = signal(1)
          const listener = vi.fn()

          onMount($signal, () => {
            $signal(2)
          })

          const off1 = effect(() => {
            listener($signal())
          })

          expect(listener.mock.calls).toEqual([[1], [2]])

          off1()
        })
      })
    })
  })
})
