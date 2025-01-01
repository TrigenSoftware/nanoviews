import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import type {
  EventListener,
  EventTarget
} from './types/emitter.js'
import { $$CHANGE } from './symbols.js'
import {
  addListener,
  removeListener,
  dispatchLifecycle,
  dispatchAbortableLifecycle,
  dispatchChange,
  cleanupQueue
} from './emitter.js'

const $$event = Symbol()

describe('stores', () => {
  describe('internals', () => {
    describe('emitter', () => {
      it('should add event listener', () => {
        const target: EventTarget = {}
        const listener = () => {}
        let listeners = addListener(target, $$event, listener)

        expect(listeners.length).toBe(1)
        expect(target[$$event]).toEqual([listener])

        const listener2 = () => {}

        listeners = addListener(target, $$event, listener2)

        expect(listeners.length).toBe(2)
        expect(target[$$event]).toEqual([listener, listener2])
      })

      it('should remove event listener', () => {
        const target: EventTarget = {}
        const listener = () => {}
        const listeners = addListener(target, $$event, listener)

        expect(listeners.length).toBe(1)
        expect(target[$$event]).toEqual([listener])

        removeListener(listeners, listener)

        expect(target[$$event]).toEqual([])
      })

      it('should lifecycle dispatch event', () => {
        const target: EventTarget = {}
        const listener = vi.fn()
        const listeners = addListener(target, $$event, listener)

        dispatchLifecycle(target, $$event)

        expect(listener).toHaveBeenCalledTimes(1)

        removeListener(listeners, listener)

        dispatchLifecycle(target, $$event)

        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should abort lifecycle event dispatch', () => {
        const target: EventTarget = {}
        const listener = vi.fn((abort): void => {
          abort()
        })
        const listeners = addListener(target, $$event, listener)

        expect(dispatchAbortableLifecycle(target, $$event)).toBe(false)
        expect(listener).toHaveBeenCalledTimes(1)

        removeListener(listeners, listener)

        expect(dispatchAbortableLifecycle(target, $$event)).toBe(true)
        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should dispatch lifecycle event with args', () => {
        const target: EventTarget = {}
        const listener = vi.fn()
        const listeners = addListener(target, $$event, listener)

        dispatchLifecycle(target, $$event, [1, 2])

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(1, 2, {})

        removeListener(listeners, listener)

        dispatchLifecycle(target, $$event)

        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should dispatch change event', () => {
        const target: EventTarget = {}
        const listener = vi.fn()
        const listeners = addListener(target, $$CHANGE, listener)

        dispatchChange(target, 2, 1)

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(2, 1)

        removeListener(listeners, listener)

        dispatchChange(target, 3, 2)

        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should add same listener twice', () => {
        const target: EventTarget = {}
        const listener = vi.fn()
        const listeners = addListener(target, $$event, listener)

        addListener(target, $$event, listener)

        dispatchLifecycle(target, $$event)

        expect(listener).toHaveBeenCalledTimes(2)

        removeListener(listeners, listener)
        dispatchLifecycle(target, $$event)

        expect(listener).toHaveBeenCalledTimes(3)
      })

      it('should handle double off call', () => {
        const target: EventTarget = {}
        const listener1 = () => {}
        const listener2 = () => {}
        const listeners1 = addListener(target, $$event, listener1)
        const listeners2 = addListener(target, $$event, listener2)

        expect(target[$$event]).toHaveLength(2)

        removeListener(listeners1, listener1)
        removeListener(listeners1, listener1)

        expect(target[$$event]).toHaveLength(1)

        removeListener(listeners2, listener2)
      })

      it('should mutate listeners while dispatching change', () => {
        const on = (target: EventTarget, listener: EventListener) => {
          const listeners = addListener(target, $$CHANGE, listener)

          return () => {
            cleanupQueue(listener)
            removeListener(listeners, listener)
          }
        }
        const events: string[] = []
        const target: EventTarget = {}
        let off3: (() => void) | undefined
        const off1 = on(target, (v) => {
          events.push(`1:${v}`)
          off2()

          if (!off3) {
            off3 = on(target, (v2) => {
              events.push(`3:${v2}`)
            })
          }
        })
        const off2 = on(target, (v) => {
          events.push(`2:${v}`)
        })

        expect(events).toEqual([])

        dispatchChange(target, 1, undefined)

        expect(events).toEqual(['1:1'])

        dispatchChange(target, 2, undefined)

        expect(events).toEqual([
          '1:1',
          '1:2',
          '3:2'
        ])

        off1()
        off3?.()
      })

      it('should share object between listeners', () => {
        const events: string[] = []
        const target: EventTarget = {}

        addListener(target, $$event, (shared) => {
          shared.i = 0
          events.push(`1:${shared.i++}`)
        })
        addListener(target, $$event, (shared) => {
          events.push(`2:${shared.i++}`)
        })

        dispatchLifecycle(target, $$event)

        expect(events).toEqual(['1:0', '2:1'])
      })
    })
  })
})
