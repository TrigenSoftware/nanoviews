import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  computed,
  effect,
  effectScope,
  endBatch,
  pauseTracking,
  resumeTracking,
  signal,
  startBatch
} from './index.js'

describe('agera', () => {
  describe('effect', () => {
    it('should clear subscriptions when untracked by all subscribers', () => {
      let bRunTimes = 0
      const a = signal(1)
      const b = computed(() => {
        bRunTimes++
        return a() * 2
      })
      const stopEffect = effect(() => {
        b()
      })

      expect(bRunTimes).toBe(1)
      a(2)
      expect(bRunTimes).toBe(2)
      stopEffect()
      a(3)
      expect(bRunTimes).toBe(2)
    })

    it('should not run untracked inner effect', () => {
      const a = signal(3)
      const b = computed(() => a() > 0)

      effect(() => {
        if (b()) {
          effect(() => {
            if (a() === 0) {
              throw new Error('bad')
            }
          })
        }
      })

      decrement()
      decrement()
      decrement()

      function decrement() {
        a(a() - 1)
      }
    })

    it('should run outer effect first', () => {
      const a = signal(1)
      const b = signal(1)

      effect(() => {
        if (a()) {
          effect(() => {
            b()

            if (a() === 0) {
              throw new Error('bad')
            }
          })
        }
      })

      startBatch()
      b(0)
      a(0)
      endBatch()
    })

    it('should not trigger inner effect when resolve maybe dirty', () => {
      const a = signal(0)
      const b = computed(() => a() % 2)
      let innerTriggerTimes = 0

      effect(() => {
        effect(() => {
          b()
          innerTriggerTimes++

          if (innerTriggerTimes >= 2) {
            throw new Error('bad')
          }
        })
      })

      a(2)
    })

    it('should trigger inner effects in sequence', () => {
      const a = signal(0)
      const b = signal(0)
      const c = computed(() => a() - b())
      const order: string[] = []

      effect(() => {
        c()

        effect(() => {
          order.push('first inner')
          a()
        })

        effect(() => {
          order.push('last inner')
          a()
          b()
        })
      })

      order.length = 0

      startBatch()
      b(1)
      a(1)
      endBatch()

      expect(order).toEqual(['first inner', 'last inner'])
    })

    it('should trigger inner effects in sequence in effect scope', () => {
      const a = signal(0)
      const b = signal(0)
      const order: string[] = []

      effectScope(() => {
        effect(() => {
          order.push('first inner')
          a()
        })

        effect(() => {
          order.push('last inner')
          a()
          b()
        })
      })

      order.length = 0

      startBatch()
      b(1)
      a(1)
      endBatch()

      expect(order).toEqual(['first inner', 'last inner'])
    })

    it('should custom effect support batch', () => {
      function batchEffect(fn: () => void) {
        return effect(() => {
          startBatch()

          try {
            return fn()
          } finally {
            endBatch()
          }
        })
      }

      const logs: string[] = []
      const a = signal(0)
      const b = signal(0)
      const aa = computed(() => {
        logs.push('aa-0')

        if (a() === 0) {
          b(1)
        }

        logs.push('aa-1')
      })
      const bb = computed(() => {
        logs.push('bb')
        return b()
      })

      batchEffect(() => {
        bb()
      })
      batchEffect(() => {
        aa()
      })

      expect(logs).toEqual([
        'bb',
        'aa-0',
        'aa-1',
        'bb'
      ])
    })

    it('should duplicate subscribers do not affect the notify order', () => {
      const src1 = signal(0)
      const src2 = signal(0)
      const order: string[] = []

      effect(() => {
        order.push('a')
        pauseTracking()

        const isOne = src2() === 1

        resumeTracking()

        if (isOne) {
          src1()
        }

        src2()
        src1()
      })
      effect(() => {
        order.push('b')
        src1()
      })
      src2(1) // src1.subs: a -> b -> a

      order.length = 0
      src1(src1() + 1)

      expect(order).toEqual(['a', 'b'])
    })

    it('should pass warmup parameter to effect', () => {
      const $num = signal(0)
      const fn = vi.fn(() => {
        $num()
      })
      const stop = effect(fn)

      expect(fn).toBeCalledWith(true)

      $num(1)

      expect(fn).toBeCalledWith(undefined)

      stop()
    })

    it('should call destroy function before re-run and before stop', () => {
      const $num = signal(0)
      const log: string[] = []
      const stop = effect(() => {
        $num()
        log.push('effect')
        return () => log.push('destroy')
      })

      expect(log).toEqual(['effect'])

      $num(1)

      expect(log).toEqual([
        'effect',
        'destroy',
        'effect'
      ])

      stop()

      expect(log).toEqual([
        'effect',
        'destroy',
        'effect',
        'destroy'
      ])

      $num(2)

      expect(log).toEqual([
        'effect',
        'destroy',
        'effect',
        'destroy'
      ])
    })
  })

  describe('effectScope', () => {
    it('should not trigger after stop', () => {
      const count = signal(1)
      let triggers = 0
      const stopScope = effectScope(() => {
        effect(() => {
          triggers++
          count()
        })
      })

      expect(triggers).toBe(1)
      count(2)
      expect(triggers).toBe(2)
      stopScope()
      count(3)
      expect(triggers).toBe(2)
    })

    it('should call destroy function in child effects', () => {
      const $a = signal(0)
      const $b = signal(0)
      const log: string[] = []
      const stop = effectScope(() => {
        effect(() => {
          $a()
          log.push('a')
          return () => log.push('destroy-a')
        })
        effect(() => {
          $b()
          log.push('b')
          return () => log.push('destroy-b')
        })
      })

      expect(log).toEqual(['a', 'b'])

      $a(1)

      expect(log).toEqual([
        'a',
        'b',
        'destroy-a',
        'a'
      ])

      stop()

      expect(log).toEqual([
        'a',
        'b',
        'destroy-a',
        'a',
        'destroy-a',
        'destroy-b'
      ])

      $a(2)

      expect(log).toEqual([
        'a',
        'b',
        'destroy-a',
        'a',
        'destroy-a',
        'destroy-b'
      ])
    })

    it('should stop child effect scopes', () => {
      const $a = signal(0)
      const $b = signal(0)
      const log: string[] = []
      const stop = effectScope(() => {
        effectScope(() => {
          effect(() => {
            $a()
            log.push('a')
            return () => log.push('destroy-a')
          })
        })
        effectScope(() => {
          effect(() => {
            $b()
            log.push('b')
            return () => log.push('destroy-b')
          })
        })
      })

      expect(log).toEqual(['a', 'b'])

      $a(1)

      expect(log).toEqual([
        'a',
        'b',
        'destroy-a',
        'a'
      ])

      stop()

      expect(log).toEqual([
        'a',
        'b',
        'destroy-a',
        'a',
        'destroy-a',
        'destroy-b'
      ])

      $a(2)

      expect(log).toEqual([
        'a',
        'b',
        'destroy-a',
        'a',
        'destroy-a',
        'destroy-b'
      ])
    })

    describe('lazy', () => {
      it('should run effects lazily', () => {
        const $user = signal('dangreen')
        const $year = signal(2025)
        const $views = signal(2)
        const $tab = signal<'reads' | 'subs'>('reads')
        const $reads = signal(3)
        const $subs = signal(4)
        const log: string[] = []

        function header() {
          log.push('header')

          effect(() => {
            log.push(`header user ${$user()}`)

            return () => log.push('header user destroy')
          })
        }

        function footer() {
          log.push('footer')

          effect(() => {
            log.push(`footer year ${$year()}`)

            return () => log.push('footer year destroy')
          })
        }

        function reads() {
          log.push('reads')

          effect(() => {
            log.push(`reads ${$reads()}`)

            return () => log.push('reads destroy')
          })
        }

        function subs() {
          log.push('subs')

          effect(() => {
            log.push(`subs ${$subs()}`)

            return () => log.push('subs destroy')
          })
        }

        function body() {
          log.push('body')

          effect(() => {
            log.push(`body views ${$views()}`)

            return () => log.push('body views destroy')
          })

          const tab = $tab()
          const confition = (tab: string) => effectScope(() => {
            log.push(`body condition ${tab}`)

            if (tab === 'reads') {
              reads()
            } else {
              subs()
            }
          })
          let stop = confition(tab)

          effect((warmup) => {
            const tab = $tab()

            log.push(`body tab ${tab}`)

            if (!warmup) {
              stop = confition(tab)
            }

            return () => {
              log.push('body tab destroy')
              stop()
            }
          })
        }

        function page() {
          log.push('page')

          effect(() => {
            log.push('page mount')

            return () => log.push('page destroy')
          })

          header()
          body()
          footer()
        }

        const run = effectScope(page, true)

        expect(log).toEqual([
          'page',
          'header',
          'body',
          'body condition reads',
          'reads',
          'footer'
        ])

        log.length = 0

        const stop = run()

        expect(log).toEqual([
          'page mount',
          'header user dangreen',
          'body views 2',
          'reads 3',
          'body tab reads',
          'footer year 2025'
        ])

        log.length = 0
        $user('Dan Onoshko')

        expect(log).toEqual(['header user destroy', 'header user Dan Onoshko'])

        log.length = 0
        $year(2026)

        expect(log).toEqual(['footer year destroy', 'footer year 2026'])

        log.length = 0
        $views(3)

        expect(log).toEqual(['body views destroy', 'body views 3'])

        log.length = 0
        $tab('subs')

        expect(log).toEqual([
          'body tab destroy',
          'reads destroy',
          'body tab subs',
          'body condition subs',
          'subs',
          'subs 4'
        ])

        log.length = 0
        $reads(4)

        expect(log).toEqual([])

        $subs(5)

        expect(log).toEqual(['subs destroy', 'subs 5'])

        log.length = 0

        $tab('reads')

        expect(log).toEqual([
          'body tab destroy',
          'subs destroy',
          'body tab reads',
          'body condition reads',
          'reads',
          'reads 4'
        ])

        log.length = 0
        stop()

        expect(log).toEqual([
          'page destroy',
          'header user destroy',
          'body views destroy',
          'body tab destroy',
          'reads destroy',
          'footer year destroy'
        ])
      })
    })
  })

  describe('pauseTracking+resumeTracking', () => {
    it('should pause tracking', () => {
      const src = signal(0)
      const c = computed(() => {
        pauseTracking()

        const value = src()

        resumeTracking()
        return value
      })

      expect(c()).toBe(0)

      src(1)
      expect(c()).toBe(0)
    })
  })
})
