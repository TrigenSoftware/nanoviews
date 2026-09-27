import {
  describe,
  it,
  expect,
  vi
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  fireEvent
} from '@nanoviews/testing-library'
import { signal } from 'kida'
import { b } from '../elements/elements.js'
import { effect$ } from '../component/effect.js'
import {
  case_,
  default_
} from './switch.js'
import * as Stories from './showSwitch.stories.js'
import { show_switch_ } from './showSwitch.js'

const {
  StaticValue,
  ReactiveValue,
  ReactiveValueWithoutDefault,
  KeptAlive
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('flow', () => {
    describe('show_switch_', () => {
      it('should render the case of a static value', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><b>Counter</b></div>')
      })

      it('should build no other case for a static value', () => {
        const text = vi.fn(() => b()('Text'))

        render(() => show_switch_('counter')(
          case_('counter', () => b()('Counter')),
          case_('text', text)
        ))

        expect(text).not.toHaveBeenCalled()
      })

      it('should render the default for a static value that no case matches', () => {
        const { container } = render(() => show_switch_('other')(
          case_('counter', () => b()('Counter')),
          default_(() => 'Other')
        ))

        expect(container.innerHTML).toBe('<div>Other</div>')
      })

      it('should render nothing for a static value that no case matches without a default', () => {
        const { container } = render(() => show_switch_('other')(
          case_('counter', () => b()('Counter'))
        ))

        expect(container.innerHTML).toBe('<div></div>')
      })

      it('should show the case of a reactive value', () => {
        const tab = signal<'counter' | 'text' | 'other'>('counter')
        const { container } = render(ReactiveValue({
          tab
        }))

        expect(container.innerHTML).toBe('<div><b>Counter</b></div>')

        tab('text')

        expect(container.innerHTML).toBe('<div><b>Text</b></div>')

        tab('other')

        expect(container.innerHTML).toBe('<div>Other</div>')
      })

      it('should show nothing when no case matches and there is no default', () => {
        const tab = signal<'counter' | 'text' | 'other'>('counter')
        const { container } = render(ReactiveValueWithoutDefault({
          tab
        }))

        tab('other')

        expect(container.innerHTML).toBe('<div></div>')
      })

      it('should build every case once, up front', () => {
        const tab = signal('a')
        const renderA = vi.fn(() => b()('A'))
        const renderB = vi.fn(() => b()('B'))

        render(() => show_switch_(tab)(
          case_('a', renderA),
          case_('b', renderB)
        ))

        expect(renderA).toHaveBeenCalledOnce()
        expect(renderB).toHaveBeenCalledOnce()

        tab('b')
        tab('a')
        tab('b')

        expect(renderA).toHaveBeenCalledOnce()
        expect(renderB).toHaveBeenCalledOnce()
      })

      it('should bring back the same tree of a case, kept up to date while parked', () => {
        const tab = signal<'counter' | 'text' | 'other'>('text')
        const text = signal('a')
        const { container } = render(KeptAlive({
          tab,
          text
        }))
        const [node] = container.getElementsByTagName('b')

        tab('counter')
        text('b')
        tab('text')

        expect(container.innerHTML).toBe('<div><b>b</b></div>')
        expect(container.getElementsByTagName('b')[0]).toBe(node)
      })

      it('should keep the state of a case across the switches', () => {
        const tab = signal<'counter' | 'text' | 'other'>('counter')
        const { container } = render(KeptAlive({
          tab
        }))
        const [counter] = container.getElementsByTagName('button')

        fireEvent.click(counter)
        tab('text')
        tab('counter')

        expect(container.getElementsByTagName('button')[0]).toBe(counter)
        expect(container.innerHTML).toBe('<div><button>Count: 1</button></div>')
      })

      it('should run the effects of the shown case alone', () => {
        const tab = signal('a')
        const log: string[] = []

        render(() => show_switch_(tab)(
          case_('a', () => {
            effect$(() => {
              log.push('a')

              return () => log.push('a cleanup')
            })

            return b()('A')
          }),
          case_('b', () => {
            effect$(() => {
              log.push('b')
            })

            return b()('B')
          })
        ))

        expect(log).toEqual(['a'])

        log.length = 0
        tab('b')

        expect(log).toEqual(['a cleanup', 'b'])
      })
    })
  })
})
