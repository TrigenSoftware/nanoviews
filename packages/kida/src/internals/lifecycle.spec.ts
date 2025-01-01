import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import { signal } from './signal.js'
import {
  STORE_UNMOUNT_DELAY,
  listen,
  subscribe,
  onStart,
  onStop,
  onMount,
  onSet,
  onNotify
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
          const $signal = signal(1)
          const listener = vi.fn()
          const off = listen($signal, listener)

          $signal.set(1)
          expect(listener).not.toHaveBeenCalled()

          $signal.set(2)
          expect(listener).toHaveBeenCalledWith(2, 1)

          $signal.set(3)
          expect(listener).toHaveBeenCalledWith(3, 2)

          off()
          $signal.set(4)
          expect(listener).toHaveBeenCalledTimes(2)
        })
      })

      describe('subscribe', () => {
        it('should call listener before listen', () => {
          const $signal = signal(1)

          onMount($signal, () => {
            $signal.set(2)
          })

          const listener = vi.fn()
          const off = subscribe($signal, listener)

          expect(listener.mock.calls).toEqual([[1, undefined], [2, 1]])

          off()
        })
      })

      describe('onStart', () => {
        it('should dispatch onStart event', () => {
          const $signal = signal(1)
          const listener = vi.fn()
          const off1 = listen($signal, () => {})

          onStart($signal, listener)

          expect(listener).not.toHaveBeenCalled()

          const off2 = listen($signal, () => {})

          expect(listener).not.toHaveBeenCalled()

          off1()
          off2()

          const off3 = listen($signal, () => {})

          expect(listener).toHaveBeenCalledTimes(1)

          off3()
          listen($signal, () => {})

          expect(listener).toHaveBeenCalledTimes(2)
        })

        it('should not dispatch onStart event on get', () => {
          const $signal = signal(1)
          const listener = vi.fn()
          const off1 = listen($signal, () => {})

          onStart($signal, listener)

          $signal.get()

          expect(listener).not.toHaveBeenCalled()

          off1()
        })

        it('should call listener while set value in onStart', () => {
          const $signal = signal(1)
          const listener = vi.fn()

          onStart($signal, () => {
            $signal.set(2)
          })

          const off1 = listen($signal, listener)

          expect(listener).toHaveBeenCalledWith(2, 1)

          off1()
        })
      })

      describe('onStop', () => {
        it('should dispatch onStop event', () => {
          const $signal = signal(1)
          const listener = vi.fn()

          onStop($signal, listener)

          expect(listener).not.toHaveBeenCalled()

          const off1 = listen($signal, () => {})

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
          const off1 = listen($signal, () => {})

          onMount($signal, mount)

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          const off2 = listen($signal, () => {})

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          off1()
          off2()

          vi.runAllTimers()

          expect(mount).not.toHaveBeenCalled()
          expect(unmount).not.toHaveBeenCalled()

          const off3 = listen($signal, () => {})

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

          off1 = listen($signal, () => {})
          off1()
          vi.advanceTimersByTime(100)
          off1 = listen($signal, () => {})
          off1()
          vi.advanceTimersByTime(100)
          off1 = listen($signal, () => {})
          off1()
          vi.advanceTimersByTime(STORE_UNMOUNT_DELAY + 1)

          expect(mount).toHaveBeenCalledTimes(1)
          expect(unmount).toHaveBeenCalledTimes(1)

          off1 = listen($signal, () => {})
          off1()
          vi.advanceTimersByTime(STORE_UNMOUNT_DELAY + 1)

          expect(mount).toHaveBeenCalledTimes(2)
          expect(unmount).toHaveBeenCalledTimes(2)
        })

        it('should call listener while set value in onMount', () => {
          const $signal = signal(1)
          const listener = vi.fn()

          onMount($signal, () => {
            $signal.set(2)
          })

          const off1 = listen($signal, listener)

          expect(listener).toHaveBeenCalledWith(2, 1)

          off1()
        })
      })

      describe('onSet', () => {
        it('should dispatch onSet event before value change', () => {
          const $signal = signal(1)
          const listener = vi.fn()
          const off = onSet($signal, listener)

          $signal.set(2)

          expect(listener).toHaveBeenCalledWith(2, 1, expect.any(Function), {})
          off()
        })

        it('should not dispatch onSet event on same value', () => {
          const $signal = signal(1)
          const listener = vi.fn()
          const off = onSet($signal, listener)

          $signal.set(1)

          expect(listener).not.toHaveBeenCalled()
          off()
        })

        it('should not change value on onSet event abort', () => {
          const $signal = signal(1)
          const listener = vi.fn((_nextValue, _value, abort) => {
            abort()
          })
          const off = onSet($signal, listener)

          $signal.set(2)

          expect($signal.get()).toBe(1)
          off()
        })
      })

      describe('onNotify', () => {
        it('should dispatch onNotify event after value change', () => {
          const $signal = signal(1)
          const listener = vi.fn()
          const off = onNotify($signal, listener)

          $signal.set(2)

          expect(listener).toHaveBeenCalledWith(2, 1, expect.any(Function), {})
          off()
        })

        it('should not dispatch onNotify event on same value', () => {
          const $signal = signal(1)
          const listener = vi.fn()
          const off = onNotify($signal, listener)

          $signal.set(1)

          expect(listener).not.toHaveBeenCalled()
          off()
        })

        it('should not dispatch change on onNotify event abort', () => {
          const $signal = signal(1)
          const listenNotify = vi.fn((_nextValue, _prevValue, abort) => {
            abort()
          })
          const offNotify = onNotify($signal, listenNotify)
          const listenChange = vi.fn()
          const offChange = listen($signal, listenChange)

          $signal.set(2)

          expect($signal.get()).toBe(2)
          expect(listenNotify).toHaveBeenCalledTimes(1)
          expect(listenChange).not.toHaveBeenCalled()

          offNotify()
          offChange()
        })
      })
    })
  })
})
