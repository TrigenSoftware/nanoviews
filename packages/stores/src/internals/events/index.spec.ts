import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  EventTargetSymbol,
  on,
  dispatch
} from './index.js'

describe('stores', () => {
  describe('internals', () => {
    describe('events', () => {
      it('should add event listener', () => {
        const target = {
          [EventTargetSymbol]: new Map()
        }
        const listener = () => {}
        const onFirstListener = vi.fn()

        on(target, 'event', listener, 0, onFirstListener)

        expect(onFirstListener).toHaveBeenCalledTimes(1)
        expect(target[EventTargetSymbol].get('event')).toEqual([listener, 0])

        const listener2 = () => {}

        on(target, 'event', listener2, 0, onFirstListener)

        expect(onFirstListener).toHaveBeenCalledTimes(1)
        expect(target[EventTargetSymbol].get('event')).toEqual([
          listener,
          0,
          listener2,
          0
        ])
      })

      it('should remove event listener', () => {
        const target = {
          [EventTargetSymbol]: new Map()
        }
        const listener = () => {}
        const onFirstListener = vi.fn()
        const off = on(target, 'event', listener, 0, onFirstListener)

        expect(onFirstListener).toHaveBeenCalledTimes(1)
        expect(target[EventTargetSymbol].get('event')).toEqual([listener, 0])

        off()

        expect(target[EventTargetSymbol].get('event')).toBeUndefined()
      })

      it('should dispatch event', () => {
        const target = {
          [EventTargetSymbol]: new Map()
        }
        const listener = vi.fn()
        const off = on(target, 'event', listener)

        expect(dispatch(target, 'event')).toBe(true)
        expect(listener).toHaveBeenCalledTimes(1)

        off()

        expect(dispatch(target, 'event')).toBe(true)
        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should abort event dispatch', () => {
        const target = {
          [EventTargetSymbol]: new Map()
        }
        const listener = vi.fn((abort): void => {
          abort()
        })
        const off = on(target, 'event', listener)

        expect(dispatch(target, 'event')).toBe(false)
        expect(listener).toHaveBeenCalledTimes(1)

        off()

        expect(dispatch(target, 'event')).toBe(true)
        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should dispatch event with args', () => {
        const target = {
          [EventTargetSymbol]: new Map()
        }
        const listener = vi.fn()
        const off = on(target, 'event', listener)

        expect(dispatch(target, 'event', [1, 2])).toBe(true)
        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(1, 2, expect.any(Function), {})

        off()

        expect(dispatch(target, 'event')).toBe(true)
        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should add same listener twice', () => {
        const target = {
          [EventTargetSymbol]: new Map()
        }
        const listener = vi.fn()
        const off1 = on(target, 'event', listener)

        on(target, 'event', listener)

        dispatch(target, 'event')

        expect(listener).toHaveBeenCalledTimes(2)

        off1()
        dispatch(target, 'event')

        expect(listener).toHaveBeenCalledTimes(3)
      })

      it('should handle double off call', () => {
        const target = {
          [EventTargetSymbol]: new Map()
        }
        const off1 = on(target, 'event', () => {})
        const off2 = on(target, 'event', () => {})

        expect(target[EventTargetSymbol].get('event')).toHaveLength(4)

        off1()
        off1()

        expect(target[EventTargetSymbol].get('event')).toHaveLength(2)

        off2()
      })

      it('should not mutate listeners while dispatching', () => {
        const events: string[] = []
        const target = {
          [EventTargetSymbol]: new Map()
        }
        let off3: (() => void) | undefined
        const off1 = on(target, 'event', (v) => {
          events.push(`1:${v}`)
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          off2()
          off3 = on(target, 'event', (v2) => {
            events.push(`3:${v2}`)
          })
        })
        const off2 = on(target, 'event', (v) => {
          events.push(`2:${v}`)
        })

        dispatch(target, 'event', [1])

        expect(events).toEqual(['1:1', '2:1'])

        dispatch(target, 'event', [2])

        expect(events).toEqual([
          '1:1',
          '2:1',
          '1:2',
          '3:2'
        ])

        off1()
        off3?.()
      })

      it('should share object between listeners', () => {
        const events: string[] = []
        const target = {
          [EventTargetSymbol]: new Map()
        }

        on(target, 'event', (_abort, shared) => {
          shared.i = 0
          events.push(`1:${shared.i++}`)
        })
        on(target, 'event', (_abort, shared) => {
          events.push(`2:${shared.i++}`)
        })

        dispatch(target, 'event')

        expect(events).toEqual(['1:0', '2:1'])
      })
    })
  })
})
