import {
  describe,
  it,
  expect
} from 'vitest'
import {
  render,
  act
} from '@testing-library/react'
import {
  type ReadableSignal,
  signal
} from 'kida'
import {
  useSignal,
  InjectionContext,
  useInject
} from './index.js'

describe('kida-react', () => {
  describe('useSignal', () => {
    it('should use signal store', () => {
      const $count = signal(0)

      function Test() {
        const count = useSignal($count)

        return (
          <div>
            {count}
          </div>
        )
      }

      const { container } = render(
        <Test/>
      )

      expect(container.innerHTML).toBe('<div>0</div>')

      act(() => $count(1))

      expect(container.innerHTML).toBe('<div>1</div>')
    })
  })

  describe('InjectionContext', () => {
    it('should provide dependency', () => {
      const $count = signal(0)

      function Factory(): ReadableSignal<number> | null {
        return null
      }

      function Test() {
        const $count = useInject(Factory)!
        const count = useSignal($count)

        return (
          <div>
            {count}
          </div>
        )
      }

      const { container } = render(
        <InjectionContext
          provide={[[Factory, $count]]}
        >
          <Test/>
        </InjectionContext>
      )

      expect(container.innerHTML).toBe('<div>0</div>')

      act(() => $count(1))

      expect(container.innerHTML).toBe('<div>1</div>')
    })
  })

  describe('useInject', () => {
    it('should inject dependency', () => {
      const $count = signal(0)

      function Factory() {
        return $count
      }

      function Test() {
        const $count = useInject(Factory)
        const count = useSignal($count)

        return (
          <div>
            {count}
          </div>
        )
      }

      const { container } = render(
        <InjectionContext>
          <Test/>
        </InjectionContext>
      )

      expect(container.innerHTML).toBe('<div>0</div>')

      act(() => $count(1))

      expect(container.innerHTML).toBe('<div>1</div>')
    })
  })
})
