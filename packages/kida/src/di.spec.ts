import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  InjectionContext,
  getContext,
  run,
  inject,
  action
} from './di.js'

describe('stores', () => {
  describe('di', () => {
    describe('getContext', () => {
      it('should return current context', () => {
        const context = new InjectionContext()
        const fn = vi.fn(() => {
          expect(getContext()).toBe(context)
        })

        expect(getContext()).toBeUndefined()

        run(context, fn)

        expect(fn).toHaveBeenCalledTimes(1)
        expect(getContext()).toBeUndefined()
      })
    })

    describe('run', () => {
      it('should run undefined context', () => {
        const fn = vi.fn(() => {
          expect(getContext()).toBeUndefined()
        })

        run(undefined, fn)

        expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should run context', () => {
        const context = new InjectionContext()
        const fn = vi.fn(() => {
          expect(getContext()).toBe(context)
        })

        run(context, fn)

        expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should run nested contexts', () => {
        const parent = new InjectionContext()
        const child = new InjectionContext(parent)
        const fn = vi.fn(() => {
          expect(getContext()).toBe(child)
        })

        run(parent, () => {
          expect(getContext()).toBe(parent)

          run(child, fn)

          expect(getContext()).toBe(parent)
        })

        expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should restore context after error', () => {
        const context = new InjectionContext()

        expect(() => run(context, () => {
          throw new Error()
        })).toThrow()

        expect(getContext()).toBeUndefined()
      })
    })

    describe('InjectionContext + inject', () => {
      it('should inject dependency', () => {
        const context = new InjectionContext()
        const factory = vi.fn(() => 42)

        run(context, () => {
          const value = inject(factory)

          expect(value).toBe(42)

          inject(factory)
        })

        expect(factory).toHaveBeenCalledTimes(1)
      })

      it('should inject provided dependency', () => {
        const factory = vi.fn(() => 42)
        const context = new InjectionContext(undefined, [[factory, 404]])
        const app = vi.fn(() => {
          const value = inject(factory)

          expect(value).toBe(404)

          inject(factory)
        })

        run(context, app)

        expect(app).toHaveBeenCalledTimes(1)
        expect(factory).toHaveBeenCalledTimes(0)
      })

      it('should define dependency in root context', () => {
        const factory = vi.fn(() => 42)
        const root = new InjectionContext()
        const child = new InjectionContext(root)
        const childApp = vi.fn(() => {
          const value = inject(factory)

          expect(value).toBe(42)

          inject(factory)
        })
        const app = vi.fn(() => {
          run(child, childApp)
        })

        run(root, app)

        expect(app).toHaveBeenCalledTimes(1)
        expect(childApp).toHaveBeenCalledTimes(1)
        expect(factory).toHaveBeenCalledTimes(1)
        expect(root.has(factory)).toBe(true)
        expect(child.has(factory)).toBe(true)
      })

      it('should get dependency from root context', () => {
        const factory = vi.fn(() => 42)
        const root = new InjectionContext()
        const child = new InjectionContext(root)
        const childApp = vi.fn(() => {
          const value = inject(factory)

          expect(value).toBe(42)
        })
        const app = vi.fn(() => {
          const value = inject(factory)

          expect(value).toBe(42)

          run(child, childApp)
        })

        run(root, app)

        expect(app).toHaveBeenCalledTimes(1)
        expect(childApp).toHaveBeenCalledTimes(1)
        expect(factory).toHaveBeenCalledTimes(1)
        expect(root.has(factory)).toBe(true)
        expect(child.has(factory)).toBe(true)
      })
    })

    describe('action', () => {
      it('should bind function to current context', () => {
        const factory = () => 42
        const act = () => {
          const value = inject(factory)

          return value - 2
        }
        const context = new InjectionContext()
        let fn: () => number

        run(context, () => {
          fn = action(act)
        })

        expect(fn!()).toBe(40)
      })
    })
  })
})
