import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  SET,
  NOTIFY,
  CHANGE,
  on
} from './events/index.js'
import { atom } from './atom.js'

describe('stores', () => {
  describe('internals', () => {
    describe('atom', () => {
      it('should create atom with default value', () => {
        const $atom = atom(1)

        expect($atom.get()).toBe(1)
      })

      it('should set value', () => {
        const $atom = atom(1)

        expect($atom.get()).toBe(1)

        $atom.set(2)

        expect($atom.get()).toBe(2)
      })

      it('should dispatch CHANGE event on value change', () => {
        const $atom = atom(1)
        const listener = vi.fn()
        const off = on($atom, CHANGE, listener)

        $atom.set(2)

        expect(listener).toHaveBeenCalledWith(2, 1, expect.any(Function), {})
        off()
      })

      it('should not dispatch CHANGE event on same value', () => {
        const $atom = atom(1)
        const listener = vi.fn()
        const off = on($atom, CHANGE, listener)

        $atom.set(1)

        expect(listener).not.toHaveBeenCalled()
        off()
      })

      it('should dispatch SET event before value change', () => {
        const $atom = atom(1)
        const listener = vi.fn()
        const off = on($atom, SET, listener)

        $atom.set(2)

        expect(listener).toHaveBeenCalledWith(2, 1, expect.any(Function), {})
        off()
      })

      it('should not dispatch SET event on same value', () => {
        const $atom = atom(1)
        const listener = vi.fn()
        const off = on($atom, SET, listener)

        $atom.set(1)

        expect(listener).not.toHaveBeenCalled()
        off()
      })

      it('should not change value on SET event abort', () => {
        const $atom = atom(1)
        const listener = vi.fn((_nextValue, _prevValue, abort) => {
          abort()
        })
        const off = on($atom, SET, listener)

        $atom.set(2)

        expect($atom.get()).toBe(1)
        off()
      })

      it('should dispatch NOTIFY event after value change', () => {
        const $atom = atom(1)
        const listener = vi.fn()
        const off = on($atom, NOTIFY, listener)

        $atom.set(2)

        expect(listener).toHaveBeenCalledWith(2, 1, expect.any(Function), {})
        off()
      })

      it('should not dispatch NOTIFY event on same value', () => {
        const $atom = atom(1)
        const listener = vi.fn()
        const off = on($atom, NOTIFY, listener)

        $atom.set(1)

        expect(listener).not.toHaveBeenCalled()
        off()
      })

      it('should not dispatch CHANGE on NOTIFY event abort', () => {
        const $atom = atom(1)
        const listenNotify = vi.fn((_nextValue, _prevValue, abort) => {
          abort()
        })
        const offNotify = on($atom, NOTIFY, listenNotify)
        const listenChange = vi.fn()
        const offChange = on($atom, CHANGE, listenChange)

        $atom.set(2)

        expect($atom.get()).toBe(2)
        expect(listenNotify).toHaveBeenCalledTimes(1)
        expect(listenChange).not.toHaveBeenCalled()

        offNotify()
        offChange()
      })
    })
  })
})
