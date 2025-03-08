import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  computed,
  signal,
  effect,
  onActivate
} from './index.js'

describe('agera', () => {
  describe('signal', () => {
    describe('signal', () => {
      it('should trigger onActivate callback', () => {
        const $num = signal(0)
        const log: string[] = []

        onActivate($num, (active) => {
          log.push(active ? 'mount' : 'unmount')
        })

        expect(log).toEqual([])

        const stop = effect(() => {
          $num()
          log.push('effect')
        })

        expect(log).toEqual(['effect', 'mount'])

        stop()

        expect(log).toEqual([
          'effect',
          'mount',
          'unmount'
        ])
      })

      it('should propagate changes from onActivate callback', () => {
        const $a = signal(1)
        const $b = computed(() => {
          const v = `${$a() + 1}`

          log.push(`computed ${v}`)

          return v
        })
        const log: string[] = []

        onActivate($a, (active) => {
          log.push(active ? 'a mount' : 'a unmount')
        })

        onActivate($b, (active) => {
          log.push(active ? 'b mount' : 'b unmount')

          if (active) {
            $a(2)
          }
        })

        const listener = vi.fn(() => {
          log.push(`effect ${$b()}`)
        })
        const stop = effect(listener)

        expect(log).toEqual([
          'computed 2',
          'a mount',
          'effect 2',
          'b mount',
          'computed 3',
          'effect 3'
        ])

        expect(listener).toHaveBeenCalledTimes(2)

        stop()

        expect(log).toEqual([
          'computed 2',
          'a mount',
          'effect 2',
          'b mount',
          'computed 3',
          'effect 3',
          'b unmount',
          'a unmount'
        ])
      })
    })

    describe('computed', () => {
      it('should correctly propagate changes through computed signals', () => {
        const src = signal(0)
        const c1 = computed(() => src() % 2)
        const c2 = computed(() => c1())
        const c3 = computed(() => c2())

        c3()
        src(1) // c1 -> dirty, c2 -> toCheckDirty, c3 -> toCheckDirty
        c2() // c1 -> none, c2 -> none
        src(3) // c1 -> dirty, c2 -> toCheckDirty

        expect(c3()).toBe(1)
      })
    })

    /**
     * Tests adopted with thanks from preact-signals implementation at
     * https://github.com/preactjs/signals/blob/main/packages/core/test/signal.test.tsx
     *
     * The MIT License (MIT)
     *
     * Copyright (c) 2022-present Preact Team
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE
     */

    describe('topology', () => {
      describe('graph updates', () => {
        it('should drop A->B->A updates', () => {
          //     A
          //   / |
          //  B  | <- Looks like a flag doesn't it? :D
          //   \ |
          //     C
          //     |
          //     D
          const a = signal(2)
          const b = computed(() => a() - 1)
          const c = computed(() => a() + b())
          const compute = vi.fn(() => `d: ${c()}`)
          const d = computed(compute)

          // Trigger read
          expect(d()).toBe('d: 3')
          expect(compute).toHaveBeenCalledOnce()
          compute.mockClear()

          a(4)
          d()
          expect(compute).toHaveBeenCalledOnce()
        })

        it('should only update every signal once (diamond graph)', () => {
          // In this scenario "D" should only update once when "A" receives
          // an update. This is sometimes referred to as the "diamond" scenario.
          //     A
          //   /   \
          //  B     C
          //   \   /
          //     D

          const a = signal('a')
          const b = computed(() => a())
          const c = computed(() => a())
          const spy = vi.fn(() => `${b()} ${c()}`)
          const d = computed(spy)

          expect(d()).toBe('a a')
          expect(spy).toHaveBeenCalledOnce()

          a('aa')
          expect(d()).toBe('aa aa')
          expect(spy).toHaveBeenCalledTimes(2)
        })

        it('should only update every signal once (diamond graph + tail)', () => {
          // "E" will be likely updated twice if our mark+sweep logic is buggy.
          //     A
          //   /   \
          //  B     C
          //   \   /
          //     D
          //     |
          //     E

          const a = signal('a')
          const b = computed(() => a())
          const c = computed(() => a())
          const d = computed(() => `${b()} ${c()}`)
          const spy = vi.fn(() => d())
          const e = computed(spy)

          expect(e()).toBe('a a')
          expect(spy).toHaveBeenCalledOnce()

          a('aa')
          expect(e()).toBe('aa aa')
          expect(spy).toHaveBeenCalledTimes(2)
        })

        it('should bail out if result is the same', () => {
          // Bail out if value of "B" never changes
          // A->B->C
          const a = signal('a')
          const b = computed(() => {
            a()
            return 'foo'
          })
          const spy = vi.fn(() => b())
          const c = computed(spy)

          expect(c()).toBe('foo')
          expect(spy).toHaveBeenCalledOnce()

          a('aa')
          expect(c()).toBe('foo')
          expect(spy).toHaveBeenCalledOnce()
        })

        it('should only update every signal once (jagged diamond graph + tails)', () => {
          // "F" and "G" will be likely updated twice if our mark+sweep logic is buggy.
          //     A
          //   /   \
          //  B     C
          //  |     |
          //  |     D
          //   \   /
          //     E
          //   /   \
          //  F     G
          const a = signal('a')
          const b = computed(() => a())
          const c = computed(() => a())
          const d = computed(() => c())
          const eSpy = vi.fn(() => `${b()} ${d()}`)
          const e = computed(eSpy)
          const fSpy = vi.fn(() => e())
          const f = computed(fSpy)
          const gSpy = vi.fn(() => e())
          const g = computed(gSpy)

          expect(f()).toBe('a a')
          expect(fSpy).toHaveBeenCalledTimes(1)

          expect(g()).toBe('a a')
          expect(gSpy).toHaveBeenCalledTimes(1)

          eSpy.mockClear()
          fSpy.mockClear()
          gSpy.mockClear()

          a('b')

          expect(e()).toBe('b b')
          expect(eSpy).toHaveBeenCalledTimes(1)

          expect(f()).toBe('b b')
          expect(fSpy).toHaveBeenCalledTimes(1)

          expect(g()).toBe('b b')
          expect(gSpy).toHaveBeenCalledTimes(1)

          eSpy.mockClear()
          fSpy.mockClear()
          gSpy.mockClear()

          a('c')

          expect(e()).toBe('c c')
          expect(eSpy).toHaveBeenCalledTimes(1)

          expect(f()).toBe('c c')
          expect(fSpy).toHaveBeenCalledTimes(1)

          expect(g()).toBe('c c')
          expect(gSpy).toHaveBeenCalledTimes(1)

          // top to bottom
          // expect(eSpy).toHaveBeenCalledBefore(fSpy)
          // // left to right
          // expect(fSpy).toHaveBeenCalledBefore(gSpy)
        })

        it('should only subscribe to signals listened to', () => {
          //    *A
          //   /   \
          // *B     C <- we don't listen to C
          const a = signal('a')
          const b = computed(() => a())
          const spy = vi.fn(() => a())

          computed(spy)

          expect(b()).toBe('a')
          expect(spy).not.toHaveBeenCalled()

          a('aa')
          expect(b()).toBe('aa')
          expect(spy).not.toHaveBeenCalled()
        })

        it('should only subscribe to signals listened to II', () => {
          // Here both "B" and "C" are active in the beginning, but
          // "B" becomes inactive later. At that point it should
          // not receive any updates anymore.
          //    *A
          //   /   \
          // *B     D <- we don't listen to C
          //  |
          // *C
          const a = signal('a')
          const spyB = vi.fn(() => a())
          const b = computed(spyB)
          const spyC = vi.fn(() => b())
          const c = computed(spyC)
          const d = computed(() => a())
          let result = ''
          const unsub = effect(() => {
            result = c()
          })

          expect(result).toBe('a')
          expect(d()).toBe('a')

          spyB.mockClear()
          spyC.mockClear()
          unsub()

          a('aa')

          expect(spyB).not.toHaveBeenCalled()
          expect(spyC).not.toHaveBeenCalled()
          expect(d()).toBe('aa')
        })

        it('should ensure subs update even if one dep unmarks it', () => {
          // In this scenario "C" always returns the same value. When "A"
          // changes, "B" will update, then "C" at which point its update
          // to "D" will be unmarked. But "D" must still update because
          // "B" marked it. If "D" isn't updated, then we have a bug.
          //     A
          //   /   \
          //  B     *C <- returns same value every time
          //   \   /
          //     D
          const a = signal('a')
          const b = computed(() => a())
          const c = computed(() => {
            a()
            return 'c'
          })
          const spy = vi.fn(() => `${b()} ${c()}`)
          const d = computed(spy)

          expect(d()).toBe('a c')
          spy.mockClear()

          a('aa')
          d()
          expect(spy).toHaveReturnedWith('aa c')
        })

        it('should ensure subs update even if two deps unmark it', () => {
          // In this scenario both "C" and "D" always return the same
          // value. But "E" must still update because "A" marked it.
          // If "E" isn't updated, then we have a bug.
          //     A
          //   / | \
          //  B *C *D
          //   \ | /
          //     E
          const a = signal('a')
          const b = computed(() => a())
          const c = computed(() => {
            a()
            return 'c'
          })
          const d = computed(() => {
            a()
            return 'd'
          })
          const spy = vi.fn(() => `${b()} ${c()} ${d()}`)
          const e = computed(spy)

          expect(e()).toBe('a c d')
          spy.mockClear()

          a('aa')
          e()
          expect(spy).toHaveReturnedWith('aa c d')
        })

        it('should support lazy branches', () => {
          const a = signal(0)
          const b = computed(() => a())
          const c = computed(() => (a() > 0 ? a() : b()))

          expect(c()).toBe(0)
          a(1)
          expect(c()).toBe(1)

          a(0)
          expect(c()).toBe(0)
        })

        it('should not update a sub if all deps unmark it', () => {
          // In this scenario "B" and "C" always return the same value. When "A"
          // changes, "D" should not update.
          //     A
          //   /   \
          // *B     *C
          //   \   /
          //     D
          const a = signal('a')
          const b = computed(() => {
            a()
            return 'b'
          })
          const c = computed(() => {
            a()
            return 'c'
          })
          const spy = vi.fn(() => `${b()} ${c()}`)
          const d = computed(spy)

          expect(d()).toBe('b c')
          spy.mockClear()

          a('aa')
          expect(spy).not.toHaveBeenCalled()
        })
      })

      describe('error handling', () => {
        it('should keep graph consistent on errors during activation', () => {
          const a = signal(0)
          const b = computed(() => {
            throw new Error('fail')
          })
          const c = computed(() => a())

          expect(() => b()).toThrow('fail')

          a(1)
          expect(c()).toBe(1)
        })

        it('should keep graph consistent on errors in computeds', () => {
          const a = signal(0)
          const b = computed(() => {
            if (a() === 1) {
              throw new Error('fail')
            }

            return a()
          })
          const c = computed(() => b())

          expect(c()).toBe(0)

          a(1)
          expect(() => b()).toThrow('fail')

          a(2)
          expect(c()).toBe(2)
        })
      })
    })
  })
})
