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
  createEffectScope,
  batch,
  untracked,
  signal,
  onMounted,
  mountable
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

      batch(() => {
        b(0)
        a(0)
      })
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

      batch(() => {
        b(1)
        a(1)
      })

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

      batch(() => {
        b(1)
        a(1)
      })

      expect(order).toEqual(['first inner', 'last inner'])
    })

    it('should custom effect support batch', () => {
      function batchEffect(fn: () => void) {
        return effect(() => batch(fn))
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

        const isOne = untracked(src2) === 1

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

    it('should handle clinchy effects', () => {
      const $yepnope = signal(true)
      const logs: string[] = []
      // eslint-disable-next-line prefer-const
      let stopChild: () => void
      const stop = effect((warmup) => {
        logs.push('root start')
        $yepnope()

        if (warmup) {
          return () => {
            logs.push('root warmup stop')
            stopChild()
          }
        }

        return () => logs.push('root stop')
      })

      stopChild = effect(() => {
        logs.push('child start')
        $yepnope()
        return () => logs.push('child stop')
      })

      expect(logs).toEqual(['root start', 'child start'])
      logs.length = 0

      $yepnope(false)

      expect(logs).toEqual([
        'root warmup stop',
        'child stop',
        'root start'
      ])
      logs.length = 0

      stop()

      expect(logs).toEqual(['root stop'])
    })

    it('should allow signal update in effect destroy function', () => {
      const $a = signal(0)
      const $b = signal(0)
      const logs: string[] = []
      const astop = effect(() => {
        logs.push(`a effect ${$a()}`)

        return () => {
          logs.push('a destroy')
          $b($b() + 1)
        }
      })
      const bstop = effect(() => {
        logs.push(`b effect ${$b()}`)

        return () => logs.push('b destroy')
      })

      expect(logs).toEqual(['a effect 0', 'b effect 0'])
      logs.length = 0

      $a(1)

      expect(logs).toEqual([
        'a destroy',
        'b destroy',
        'b effect 1',
        'a effect 1'
      ])
      logs.length = 0

      astop()

      expect(logs).toEqual([
        'a destroy',
        'b destroy',
        'b effect 2'
      ])
      logs.length = 0

      bstop()

      expect(logs).toEqual(['b destroy'])
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

    it('should not prevent signal change propagation', () => {
      const $value = signal(0)
      const logs: string[] = []
      const stop = effectScope(() => {
        effect(() => {
          logs.push(`value effect ${$value()}`)

          return () => logs.push('value destroy')
        })

        $value(1)
      })

      $value(2)

      expect(logs).toEqual([
        'value effect 0',
        'value destroy',
        'value effect 1',
        'value destroy',
        'value effect 2'
      ])
      logs.length = 0

      stop()

      $value(3)

      expect(logs).toEqual(['value destroy'])
    })

    it('should be fitable for loop', () => {
      const logs: string[] = []
      const $items = signal([
        'one',
        'two',
        'three'
      ])
      const $index = signal(0)
      const aEffectScope = createEffectScope()
      let destroyItemEffect: () => void
      const loopStart = aEffectScope(() => {
        logs.push('loop scope init')

        const $item = computed(() => $items()[$index()])

        destroyItemEffect = effect(() => {
          logs.push(`item effect ${$item()}`)

          return () => logs.push('item destroy')
        })
      }, true)
      let loopDestroy: () => void
      const itemsDestroy = effect((warmup) => {
        logs.push('items effect')

        $items()

        if (warmup) {
          logs.push('items effect warmup')
          loopDestroy = loopStart()
        } else {
          logs.push('items effect update')
          $index(1)
        }
      })

      expect(logs).toEqual([
        'loop scope init',
        'items effect',
        'items effect warmup',
        'item effect one'
      ])
      logs.length = 0

      $items([
        'two',
        'one',
        'three'
      ])

      expect(logs).toEqual(['items effect', 'items effect update'])

      destroyItemEffect!()
      loopDestroy!()
      itemsDestroy()
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
          log.push(`reads init ${$reads()}`)

          effect(() => {
            log.push(`reads ${$reads()}`)

            return () => log.push('reads destroy')
          })
        }

        function subs() {
          log.push(`subs init ${$subs()}`)

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
          }, true)
          let start = confition(tab)
          let stop: () => void

          effect((warmup) => {
            const tab = $tab()

            log.push(`body tab ${tab}`)

            if (!warmup) {
              log.push(`body tab effect render ${tab}`)
              start = confition(tab)
              stop = start()
            } else {
              log.push(`body tab initial effect render ${tab}`)
              stop = start()
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
          'reads init 3',
          'footer'
        ])

        log.length = 0

        const stop = run()

        expect(log).toEqual([
          'page mount',
          'header user dangreen',
          'body views 2',
          'body tab reads',
          'body tab initial effect render reads',
          'reads 3',
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
          'body tab effect render subs',
          'body condition subs',
          'subs init 4',
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
          'body tab effect render reads',
          'body condition reads',
          'reads init 4',
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

      it('should trigger signal activation after start', () => {
        const $num = mountable(signal(0))
        const callback = vi.fn()

        onMounted($num, callback)

        const start = effectScope(() => {
          $num()

          effect(() => {
            $num()
          })
        }, true)

        expect(callback).not.toHaveBeenCalled()

        const stop = start()

        expect(callback).toHaveBeenCalledTimes(1)

        stop()
      })

      it('should trigger computed dep activation after start', () => {
        const $num = mountable(signal(1))
        const $double = computed(() => $num() * 2)
        const callback = vi.fn()

        onMounted($num, callback)

        const start = effectScope(() => {
          $double()

          effect(() => {
            $double()
          })
        }, true)

        expect(callback).not.toHaveBeenCalled()

        const stop = start()

        expect(callback).toHaveBeenCalledTimes(1)

        stop()
      })

      it('should trigger computed activation after start', () => {
        const $num = mountable(signal(0))
        const $double = mountable(computed(() => $num() * 2))
        const callback = vi.fn()
        const computedCallback = vi.fn()

        onMounted($num, callback)
        onMounted($double, computedCallback)

        const start = effectScope(() => {
          $double()

          effect(() => {
            $double()
          })
        }, true)

        expect(callback).not.toHaveBeenCalled()
        expect(computedCallback).not.toHaveBeenCalled()

        const stop = start()

        expect(callback).toHaveBeenCalledTimes(1)
        expect(computedCallback).toHaveBeenCalledTimes(1)

        stop()
      })

      it('should ignore update', () => {
        const $num = signal(0)
        const onEffect = vi.fn()
        const start = effectScope(() => {
          effect(() => {
            onEffect($num())
          })
        }, true)

        expect(onEffect).not.toBeCalled()

        $num(2)

        expect(onEffect).not.toBeCalled()

        const stop = start()

        expect(onEffect).toBeCalledWith(2)

        stop()
      })
    })
  })

  describe('createEffectScope', () => {
    it('should not trigger after stop', () => {
      const effectScope = createEffectScope()
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
      const effectScope = createEffectScope()
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
      const rootEffectScope = createEffectScope()
      const $a = signal(0)
      const $b = signal(0)
      const log: string[] = []
      const stop = rootEffectScope(() => {
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

    it('should accumulate effects', () => {
      const rootEffectScope = createEffectScope()
      const logs: string[] = []
      const $a = signal(0)
      const $b = signal(0)

      rootEffectScope(() => {
        effect(() => {
          logs.push(`a effect ${$a()}`)

          return () => logs.push('a effect destroy')
        })

        effectScope(() => {
          effect(() => {
            logs.push(`b effect ${$b()}`)

            return () => logs.push('b effect destroy')
          })
        })
      })

      expect(logs).toEqual(['a effect 0', 'b effect 0'])
      logs.length = 0

      $b(1)

      expect(logs).toEqual(['b effect destroy', 'b effect 1'])
      logs.length = 0

      const $c = signal(0)

      rootEffectScope(() => {
        effect(() => {
          logs.push(`c effect ${$c()}`)

          return () => logs.push('c effect destroy')
        })
      })

      expect(logs).toEqual(['c effect 0'])
      logs.length = 0

      const $d = signal(0)
      let effectStop: () => void
      const stop = rootEffectScope(() => {
        effectStop = effect(() => {
          logs.push(`d effect ${$d()}`)

          return () => logs.push('d effect destroy')
        })
      })

      expect(logs).toEqual(['d effect 0'])
      logs.length = 0

      $d(1)

      expect(logs).toEqual(['d effect destroy', 'd effect 1'])
      logs.length = 0

      effectStop!()

      expect(logs).toEqual(['d effect destroy'])
      logs.length = 0

      stop()

      expect(logs).toEqual([
        'a effect destroy',
        'b effect destroy',
        'c effect destroy'
      ])
      logs.length = 0

      $a(3)
      $b(4)
      $c(5)
      $d(6)

      expect(logs).toEqual([])
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
          log.push(`reads init ${$reads()}`)

          effect(() => {
            log.push(`reads ${$reads()}`)

            return () => log.push('reads destroy')
          })
        }

        function subs() {
          log.push(`subs init ${$subs()}`)

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
          const effectScope = createEffectScope()
          const confition = (tab: string) => effectScope(() => {
            log.push(`body condition ${tab}`)

            if (tab === 'reads') {
              reads()
            } else {
              subs()
            }
          }, true)
          let start = confition(tab)
          let stop: () => void

          effect((warmup) => {
            const tab = $tab()

            log.push(`body tab ${tab}`)

            if (!warmup) {
              log.push(`body tab effect render ${tab}`)
              start = confition(tab)
              stop = start()
            } else {
              log.push(`body tab initial effect render ${tab}`)
              stop = start()
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
          'reads init 3',
          'footer'
        ])

        log.length = 0

        const stop = run()

        expect(log).toEqual([
          'page mount',
          'header user dangreen',
          'body views 2',
          'body tab reads',
          'body tab initial effect render reads',
          'reads 3',
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
          'body tab effect render subs',
          'body condition subs',
          'subs init 4',
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
          'body tab effect render reads',
          'body condition reads',
          'reads init 4',
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

      it('should accumulate effects', () => {
        const rootEffectScope = createEffectScope()
        const logs: string[] = []
        const $a = signal(0)
        const $b = signal(0)
        const start = rootEffectScope(() => {
          logs.push(`a scope ${$a()}`)

          effect(() => {
            logs.push(`a effect ${$a()}`)

            return () => logs.push('a effect destroy')
          })

          effectScope(() => {
            logs.push(`b scope ${$b()}`)

            effect(() => {
              logs.push(`b effect ${$b()}`)

              return () => logs.push('b effect destroy')
            })
          })
        }, true)

        expect(logs).toEqual(['a scope 0', 'b scope 0'])
        logs.length = 0

        const stop = start()

        expect(logs).toEqual(['a effect 0', 'b effect 0'])
        logs.length = 0

        $b(1)

        expect(logs).toEqual(['b effect destroy', 'b effect 1'])
        logs.length = 0

        const $c = signal(0)

        rootEffectScope(() => {
          effect(() => {
            logs.push(`c effect ${$c()}`)

            return () => logs.push('c effect destroy')
          })
        })

        expect(logs).toEqual(['c effect 0'])
        logs.length = 0

        const $d = signal(0)

        rootEffectScope(() => {
          effect(() => {
            logs.push(`d effect ${$d()}`)

            return () => logs.push('d effect destroy')
          })
        })

        expect(logs).toEqual(['d effect 0'])
        logs.length = 0

        $d(1)

        expect(logs).toEqual(['d effect destroy', 'd effect 1'])
        logs.length = 0

        stop()

        expect(logs).toEqual([
          'a effect destroy',
          'b effect destroy',
          'c effect destroy',
          'd effect destroy'
        ])
        logs.length = 0

        $a(3)
        $b(4)
        $c(5)
        $d(6)

        expect(logs).toEqual([])
      })

      it('should not break child effects', () => {
        const $items = signal([
          1,
          2,
          3
        ])
        const aEffectScope = createEffectScope()
        const onChange = vi.fn()
        const createItem = (i: number) => effect(() => {
          onChange($items()[i])
        })
        const startScope = aEffectScope(() => {
          $items().forEach((_, i) => {
            createItem(i)
          })
        }, true)
        let stopScope
        const stop = effect((warmup) => {
          $items()

          if (warmup) {
            stopScope = startScope()
          } else {
            aEffectScope(() => {})
          }
        })

        expect(onChange.mock.calls).toEqual([
          [1],
          [2],
          [3]
        ])
        onChange.mock.calls.length = 0

        $items([
          4,
          5,
          6
        ])

        expect(onChange.mock.calls).toEqual([
          [4],
          [5],
          [6]
        ])

        stopScope!()
        stop()
      })
    })
  })

  describe('untracked', () => {
    it('should pause tracking', () => {
      const src = signal(0)
      const c = computed(() => untracked(src))

      expect(c()).toBe(0)

      src(1)
      expect(c()).toBe(0)
    })
  })
})
