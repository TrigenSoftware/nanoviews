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
  describe('activation', () => {
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
      const log: string[] = []

      onActivate($a, (active) => {
        log.push(active ? 'a mount' : 'a unmount')

        if (active) {
          $a(2)
        }
      })

      const listener = vi.fn(() => {
        log.push(`effect ${$a()}`)
      })
      const stop = effect(listener)

      expect(log).toEqual([
        'effect 1',
        'a mount',
        'effect 2'
      ])
      log.length = 0

      expect(listener).toHaveBeenCalledTimes(2)

      stop()

      expect(log).toEqual(['a unmount'])
    })

    it('should propagate changes from transitive onActivate callback', () => {
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
        'effect 2',
        'a mount',
        'b mount',
        'computed 3',
        'effect 3'
      ])
      log.length = 0

      expect(listener).toHaveBeenCalledTimes(2)

      stop()

      expect(log).toEqual(['b unmount', 'a unmount'])
    })

    it('should propagate changes from onActivate callback to itself', () => {
      const $a = signal(1)
      const $b = computed(() => {
        const v = `${$a() + 1}`

        log.push(`computed ${v}`)

        return v
      })
      const log: string[] = []

      onActivate($a, (active) => {
        log.push(active ? 'a mount' : 'a unmount')

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
        'effect 2',
        'a mount',
        'computed 3',
        'effect 3'
      ])

      expect(listener).toHaveBeenCalledTimes(2)

      stop()
    })

    it('should not trigger dependency activation by cold computed', () => {
      const $src = signal(0)
      const listener = vi.fn()

      onActivate($src, listener)

      const $double = computed(() => $src() * 2)

      $double()

      expect(listener).not.toHaveBeenCalled()

      effect(() => {
        $double()
      })()

      expect(listener.mock.calls).toEqual([[true], [false]])
    })

    it('should handle conditional computed dependencies', () => {
      const $a = signal(1)
      const $b = signal(2)
      const $c = signal(true)
      const $d = computed(() => ($c() ? $a() : $b()) * 2)
      const aListener = vi.fn()
      const bListener = vi.fn()
      const cListener = vi.fn()
      const dListener = vi.fn()

      onActivate($a, aListener)
      onActivate($b, bListener)
      onActivate($c, cListener)
      onActivate($d, dListener)

      $d()

      expect(aListener).not.toHaveBeenCalled()
      expect(bListener).not.toHaveBeenCalled()
      expect(cListener).not.toHaveBeenCalled()
      expect(dListener).not.toHaveBeenCalled()

      $c(false)

      expect(aListener).not.toHaveBeenCalled()
      expect(bListener).not.toHaveBeenCalled()
      expect(cListener).not.toHaveBeenCalled()
      expect(dListener).not.toHaveBeenCalled()

      const stop = effect(() => {
        $d()
      })

      expect(aListener.mock.calls).toEqual([])
      expect(bListener.mock.calls).toEqual([[true]])
      expect(cListener.mock.calls).toEqual([[true]])
      expect(dListener.mock.calls).toEqual([[true]])

      $c(true)

      expect(aListener.mock.calls).toEqual([[true]])
      expect(bListener.mock.calls).toEqual([[true], [false]])
      expect(cListener.mock.calls).toEqual([[true]])
      expect(dListener.mock.calls).toEqual([[true]])

      $d()

      expect(aListener.mock.calls).toEqual([[true]])
      expect(bListener.mock.calls).toEqual([[true], [false]])
      expect(cListener.mock.calls).toEqual([[true]])
      expect(dListener.mock.calls).toEqual([[true]])

      stop()

      expect(aListener.mock.calls).toEqual([[true], [false]])
      expect(bListener.mock.calls).toEqual([[true], [false]])
      expect(cListener.mock.calls).toEqual([[true], [false]])
      expect(dListener.mock.calls).toEqual([[true], [false]])
    })

    it('should handle different subscribers types', () => {
      const $value = signal(1)
      const $coldUse = signal(true)
      const $cold = computed(() => ($coldUse() ? $value() * 2 : -1))
      const $hotUse = signal(true)
      const $hot = computed(() => ($hotUse() ? $value() * 2 : -1))
      const valueListener = vi.fn()
      const coldListener = vi.fn()
      const hotListener = vi.fn()

      onActivate($value, valueListener)
      onActivate($cold, coldListener)
      onActivate($hot, hotListener)

      $cold()

      expect(valueListener).toHaveBeenCalledTimes(0)
      expect(coldListener).toHaveBeenCalledTimes(0)
      expect(hotListener).toHaveBeenCalledTimes(0)

      $coldUse(false)

      expect(valueListener).toHaveBeenCalledTimes(0)
      expect(coldListener).toHaveBeenCalledTimes(0)
      expect(hotListener).toHaveBeenCalledTimes(0)

      const stop = effect(() => {
        $hot()
      })

      expect(valueListener.mock.calls).toEqual([[true]])
      expect(coldListener).toHaveBeenCalledTimes(0)
      expect(hotListener.mock.calls).toEqual([[true]])

      $coldUse(true)

      expect(valueListener.mock.calls).toEqual([[true]])
      expect(coldListener).toHaveBeenCalledTimes(0)
      expect(hotListener.mock.calls).toEqual([[true]])

      $coldUse(false)

      expect(valueListener.mock.calls).toEqual([[true]])
      expect(coldListener).toHaveBeenCalledTimes(0)
      expect(hotListener.mock.calls).toEqual([[true]])

      $hotUse(false)

      expect(valueListener.mock.calls).toEqual([[true], [false]])
      expect(coldListener).toHaveBeenCalledTimes(0)
      expect(hotListener.mock.calls).toEqual([[true]])

      $coldUse(true)

      expect(valueListener.mock.calls).toEqual([[true], [false]])
      expect(coldListener).toHaveBeenCalledTimes(0)
      expect(hotListener.mock.calls).toEqual([[true]])

      stop()

      expect(valueListener.mock.calls).toEqual([[true], [false]])
      expect(coldListener).toHaveBeenCalledTimes(0)
      expect(hotListener.mock.calls).toEqual([[true], [false]])
    })

    it('should handle nested computeds', () => {
      const $a = signal(1)
      const $useA = signal(true)
      const $computedA = computed(() => ($useA() ? $a() : 1) * 2)
      const $b = signal(10)
      const $computedB = computed(() => $computedA() * $b())
      const $c = signal(100)
      const $computedC = computed(() => $computedB() + $c())
      const aListener = vi.fn()
      const useAListener = vi.fn()
      const bListener = vi.fn()
      const cListener = vi.fn()
      const computedAListener = vi.fn()
      const computedBListener = vi.fn()
      const computedCListener = vi.fn()

      onActivate($a, aListener)
      onActivate($useA, useAListener)
      onActivate($b, bListener)
      onActivate($c, cListener)
      onActivate($computedA, computedAListener)
      onActivate($computedB, computedBListener)
      onActivate($computedC, computedCListener)

      const stop = effect(() => {
        $computedC()
      })

      expect(aListener.mock.calls).toEqual([[true]])
      expect(useAListener.mock.calls).toEqual([[true]])
      expect(bListener.mock.calls).toEqual([[true]])
      expect(cListener.mock.calls).toEqual([[true]])
      expect(computedAListener.mock.calls).toEqual([[true]])
      expect(computedBListener.mock.calls).toEqual([[true]])
      expect(computedCListener.mock.calls).toEqual([[true]])

      $useA(false)

      expect(aListener.mock.calls).toEqual([[true], [false]])
      expect(useAListener.mock.calls).toEqual([[true]])
      expect(bListener.mock.calls).toEqual([[true]])
      expect(cListener.mock.calls).toEqual([[true]])
      expect(computedAListener.mock.calls).toEqual([[true]])
      expect(computedBListener.mock.calls).toEqual([[true]])
      expect(computedCListener.mock.calls).toEqual([[true]])

      $useA(true)

      expect(aListener.mock.calls).toEqual([
        [true],
        [false],
        [true]
      ])
      expect(useAListener.mock.calls).toEqual([[true]])
      expect(bListener.mock.calls).toEqual([[true]])
      expect(cListener.mock.calls).toEqual([[true]])
      expect(computedAListener.mock.calls).toEqual([[true]])
      expect(computedBListener.mock.calls).toEqual([[true]])
      expect(computedCListener.mock.calls).toEqual([[true]])

      stop()

      expect(aListener.mock.calls).toEqual([
        [true],
        [false],
        [true],
        [false]
      ])
      expect(useAListener.mock.calls).toEqual([[true], [false]])
      expect(bListener.mock.calls).toEqual([[true], [false]])
      expect(cListener.mock.calls).toEqual([[true], [false]])
      expect(computedAListener.mock.calls).toEqual([[true], [false]])
      expect(computedBListener.mock.calls).toEqual([[true], [false]])
      expect(computedCListener.mock.calls).toEqual([[true], [false]])
    })

    it('should handle diamond dependency graph', () => {
      const $a = signal(1)
      const $b = computed(() => $a() * 2)
      const $c = computed(() => $a() * 3)
      const $d = computed(() => $b() + $c())
      const aListener = vi.fn()
      const bListener = vi.fn()
      const cListener = vi.fn()
      const dListener = vi.fn()

      onActivate($a, aListener)
      onActivate($b, bListener)
      onActivate($c, cListener)
      onActivate($d, dListener)

      const stop = effect(() => {
        $d()
      })

      expect($a.signal.effects).toBe(2)
      expect(aListener.mock.calls).toEqual([[true]])
      expect(bListener.mock.calls).toEqual([[true]])
      expect(cListener.mock.calls).toEqual([[true]])
      expect(dListener.mock.calls).toEqual([[true]])

      stop()

      expect($a.signal.effects).toBe(0)
      expect(aListener.mock.calls).toEqual([[true], [false]])
      expect(bListener.mock.calls).toEqual([[true], [false]])
      expect(cListener.mock.calls).toEqual([[true], [false]])
      expect(dListener.mock.calls).toEqual([[true], [false]])
    })

    it('should handle several effects on same computed', () => {
      const $a = signal(1)
      const $b = computed(() => $a() * 2)
      const aListener = vi.fn()
      const bListener = vi.fn()

      onActivate($a, aListener)
      onActivate($b, bListener)

      const stop1 = effect(() => {
        $b()
      })
      const stop2 = effect(() => {
        $b()
      })

      expect($a.signal.effects).toBe(2)
      expect(aListener.mock.calls).toEqual([[true]])
      expect(bListener.mock.calls).toEqual([[true]])

      stop1()

      expect($a.signal.effects).toBe(1)
      expect(aListener.mock.calls).toEqual([[true]])
      expect(bListener.mock.calls).toEqual([[true]])

      stop2()

      expect($a.signal.effects).toBe(0)
      expect(aListener.mock.calls).toEqual([[true], [false]])
      expect(bListener.mock.calls).toEqual([[true], [false]])
    })
  })
})
