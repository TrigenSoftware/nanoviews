import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import type {
  GetHook,
  ReadableSignal
} from './types/index.js'
import { $$CHANGE } from './symbols.js'
import { signal } from './signal.js'
import {
  listen,
  subscribe,
  onMount
} from './lifecycle.js'
import { batch } from './effect.js'
import { computed } from './computed.js'

describe('stores', () => {
  describe('internals', () => {
    describe('computed', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('should compute signle value', () => {
        const $a = signal(1)
        const $b = computed(get => `${get($a) + 1}`)
        const listener = vi.fn()

        expect($b.get()).toBe('2')

        const off = listen($b, listener)

        $a.set(2)

        expect(listener).toHaveBeenCalledWith('3', '2')
        expect(listener).toHaveBeenCalledTimes(1)
        expect($b.get()).toBe('3')

        $a.set(3)
        $a.set(4)

        expect(listener).toHaveBeenCalledWith('5', '4')
        expect(listener).toHaveBeenCalledTimes(3)
        expect($b.get()).toBe('5')

        off()
        vi.runAllTimers()
      })

      it('should lazy compute while turned off', () => {
        const $a = signal(1)
        const $b = computed(get => `${get($a) + 1}`)

        expect($b.get()).toBe('2')

        $a.set(2)

        expect($b.get()).toBe('3')
      })

      it('should compute single value with debounce', () => {
        const $a = signal(1)
        const $b = computed(get => `${get($a) + 1}`, batch)
        const listener = vi.fn()

        expect($b.get()).toBe('2')

        const off = listen($b, listener)

        $a.set(2)

        expect(listener).toHaveBeenCalledTimes(0)
        vi.runAllTimers()
        expect(listener).toHaveBeenCalledWith('3', '2')
        expect(listener).toHaveBeenCalledTimes(1)
        expect($b.get()).toBe('3')

        $a.set(3)
        $a.set(4)

        expect(listener).toHaveBeenCalledTimes(1)
        vi.runAllTimers()
        expect(listener).toHaveBeenCalledWith('5', '3')
        expect(listener).toHaveBeenCalledTimes(2)
        expect($b.get()).toBe('5')

        off()
        vi.runAllTimers()
      })

      it('should not dispatch change after get', () => {
        const $a = signal(1)
        const $b = computed(get => `${get($a) + 1}`)
        const listener = vi.fn()

        expect($b.get()).toBe('2')

        const off = listen($b, listener)

        expect(listener).toHaveBeenCalledTimes(0)

        off()
        vi.runAllTimers()
      })

      it('should not dispatch change after mount', () => {
        const $a = signal(1)
        const $b = computed(get => `${get($a) + 1}`)
        const listener = vi.fn()
        const off = listen($b, listener)

        expect(listener).toHaveBeenCalledTimes(0)

        off()
        vi.runAllTimers()
      })

      it('should dispatch change after set in mount', () => {
        const $a = signal(1)
        const $b = computed(get => `${get($a) + 1}`)

        onMount($b, () => {
          $a.set(2)
        })

        const listener = vi.fn()
        const off = listen($b, listener)

        expect(listener).toHaveBeenCalledTimes(1)

        off()
        vi.runAllTimers()
      })

      it('should clean up on unmount', () => {
        const $a = signal(1)
        const $b = computed(get => `${get($a) + 1}`)

        expect(($a as any)[$$CHANGE]?.length).toBe(undefined)
        expect(($b as any)[$$CHANGE]?.length).toBe(undefined)

        const off = listen($b, () => {})

        expect(($a as any)[$$CHANGE]?.length).toBe(1)
        expect(($b as any)[$$CHANGE]?.length).toBe(1)

        off()
        vi.runAllTimers()

        expect(($a as any)[$$CHANGE]?.length).toBe(0)
        expect(($b as any)[$$CHANGE]?.length).toBe(0)
      })

      it('should compute multiple values', () => {
        const $a = signal(1)
        const $b = signal(2)
        const $c = computed(get => `${get($a) + get($b)}`)
        const listener = vi.fn()

        expect($c.get()).toBe('3')

        const off = listen($c, listener)

        $a.set(2)

        expect(listener).toHaveBeenCalledWith('4', '3')
        expect(listener).toHaveBeenCalledTimes(1)
        expect($c.get()).toBe('4')

        $b.set(3)

        expect(listener).toHaveBeenCalledWith('5', '4')
        expect(listener).toHaveBeenCalledTimes(2)
        expect($c.get()).toBe('5')

        off()
        vi.runAllTimers()
      })

      it('should compute multiple values with debounce', () => {
        const $a = signal(1)
        const $b = signal(2)
        const $c = computed(get => `${get($a) + get($b)}`, batch)
        const listener = vi.fn()

        expect($c.get()).toBe('3')

        const off = listen($c, listener)

        $a.set(2)

        expect(listener).toHaveBeenCalledTimes(0)
        vi.runAllTimers()
        expect(listener).toHaveBeenCalledWith('4', '3')
        expect(listener).toHaveBeenCalledTimes(1)
        expect($c.get()).toBe('4')

        $a.set(3)
        $b.set(3)

        expect(listener).toHaveBeenCalledTimes(1)
        vi.runAllTimers()
        expect(listener).toHaveBeenCalledWith('6', '4')
        expect(listener).toHaveBeenCalledTimes(2)
        expect($c.get()).toBe('6')

        off()
        vi.runAllTimers()
      })

      const replacer = ($signal: ReadableSignal<string>, a: string, b: string) => (get: GetHook) => get($signal).replace(a, b)

      it('should prevent diamond dependency problem 1', () => {
        const $store = signal(0)
        const values: string[] = []
        const $a = computed(get => `a${get($store)}`)
        const $b = computed(replacer($a, 'a', 'b'))
        const $c = computed(replacer($a, 'a', 'c'))
        const $d = computed(replacer($a, 'a', 'd'))
        const $combined = computed(get => `${get($b)}${get($c)}${get($d)}`)
        const unsubscribe = subscribe($combined, (v) => {
          values.push(v)
        })

        expect(values).toEqual(['b0c0d0'])

        $store.set(1)
        $store.set(2)

        expect(values).toEqual([
          'b0c0d0',
          'b1c1d1',
          'b2c2d2'
        ])

        unsubscribe()
      })

      it('should prevent diamond dependency problem 2', () => {
        const $store = signal(0)
        const values: string[] = []
        const $a = computed(get => `a${get($store)}`)
        const $b = computed(replacer($a, 'a', 'b'))
        const $c = computed(replacer($b, 'b', 'c'))
        const $d = computed(replacer($c, 'c', 'd'))
        const $e = computed(replacer($d, 'd', 'e'))
        const $combined = computed(get => `${get($a)}${get($e)}`)
        const unsubscribe = subscribe($combined, (v) => {
          values.push(v)
        })

        expect(values).toEqual(['a0e0'])

        $store.set(1)
        expect(values).toEqual(['a0e0', 'a1e1'])

        unsubscribe()
      })

      it('should prevent diamond dependency problem 3', () => {
        const $store = signal(0)
        const values: string[] = []
        const $a = computed(get => `a${get($store)}`)
        const $b = computed(replacer($a, 'a', 'b'))
        const $c = computed(replacer($b, 'b', 'c'))
        const $d = computed(replacer($c, 'c', 'd'))
        const $combined = computed(get => `${get($a)}${get($b)}${get($c)}${get($d)}`)
        const unsubscribe = subscribe($combined, (v) => {
          values.push(v)
        })

        expect(values).toEqual(['a0b0c0d0'])

        $store.set(1)
        expect(values).toEqual(['a0b0c0d0', 'a1b1c1d1'])

        unsubscribe()
      })

      it('should prevent diamond dependency problem 4 (complex)', () => {
        const $store1 = signal(0)
        const $store2 = signal(0)
        const values: string[] = []
        const fn =
          (name: string, ...stores: ReadableSignal<number | string | undefined>[]) => (get: GetHook) => `${name}${stores.map(get).join('')}`
        const $a = computed(fn('a', $store1))
        const $b = computed(fn('b', $store2))
        const $c = computed(fn('c', $a, $b))
        const $d = computed(fn('d', $a))
        const $e = computed(fn('e', $c, $d))
        const $f = computed(fn('f', $e))
        const $g = computed(fn('g', $f))
        const $combined1 = computed(get => `${get($e)}`)
        const $combined2 = computed(get => `${get($e)}${get($g)}`)
        const unsubscribe1 = subscribe($combined1, (v) => {
          values.push(v)
        })
        const unsubscribe2 = subscribe($combined2, (v) => {
          values.push(v)
        })

        expect(values).toEqual(['eca0b0da0', 'eca0b0da0gfeca0b0da0'])

        $store1.set(1)
        $store2.set(2)

        expect(values).toEqual([
          'eca0b0da0',
          'eca0b0da0gfeca0b0da0',
          'eca1b0da1',
          'eca1b0da1gfeca1b0da1',
          'eca1b2da1',
          'eca1b2da1gfeca1b2da1'
        ])

        unsubscribe1()
        unsubscribe2()
      })

      it('should prevent diamond dependency problem 5', () => {
        let events = ''
        const $firstName = signal('John')
        const $lastName = signal('Doe')
        const $fullName = computed((get) => {
          events += 'full '
          return `${get($firstName)} ${get($lastName)}`
        })
        const $isFirstShort = computed((get) => {
          events += 'short '
          return get($firstName).length < 10
        })
        const $displayName = computed((get) => {
          events += 'display '
          return get($isFirstShort) ? get($fullName) : get($firstName)
        })

        expect(events).toBe('')

        const unsubscribe = listen($displayName, () => {})

        expect($displayName.get()).toBe('John Doe')
        expect(events).toBe('display short full ')

        $firstName.set('Benedict')
        expect($displayName.get()).toBe('Benedict Doe')
        expect(events).toBe('display short full short full display ')

        $firstName.set('Montgomery')
        expect($displayName.get()).toBe('Montgomery')
        expect(events).toBe('display short full short full display short full display ')

        unsubscribe()
      })

      it('should prevent diamond dependency problem 6', () => {
        const $store1 = signal(0)
        const $store2 = signal(0)
        const values: string[] = []
        const $a = computed(get => `a${get($store1)}`)
        const $b = computed(get => `b${get($store2)}`)
        const $c = computed(get => get($b).replace('b', 'c'))
        const $combined = computed(get => `${get($a)}${get($c)}`)
        const unsubscribe = subscribe($combined, (v) => {
          values.push(v)
        })

        expect(values).toEqual(['a0c0'])

        $store1.set(1)
        expect(values).toEqual(['a0c0', 'a1c0'])

        unsubscribe()
      })

      it('should set value inside listener', () => {
        const $val = signal(1)
        const $computed1 = computed(get => get($val))
        const $computed2 = computed(get => get($computed1))
        const events: string[] = []
        const listener1 = (val: number) => events.push(`val ${val}`)
        const listener2 = (computed2: number) => {
          events.push(`computed2 ${computed2}`)

          if (computed2 % 2 === 1) {
            $val.set($val.get() + 1)
          }
        }
        const off = listen($val, listener1)
        const off2 = listen($computed2, listener2)

        listener1($val.get())
        listener2($computed2.get())

        expect(events).toEqual([
          'val 1',
          'computed2 1',
          'val 2',
          'computed2 2'
        ])

        $val.set(3)

        expect(events).toEqual([
          'val 1',
          'computed2 1',
          'val 2',
          'computed2 2',
          'val 3',
          'computed2 3',
          'val 4',
          'computed2 4'
        ])

        off()
        off2()
      })
    })
  })
})
