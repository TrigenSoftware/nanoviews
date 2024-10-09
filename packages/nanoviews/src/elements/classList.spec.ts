import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from '@nanoviews/stores'
import * as Stories from './classList.stories.js'

const {
  StaticString,
  ReactiveString,
  StaticStrings,
  ReactiveStringsArray,
  ReactiveStrings,
  NestedStrings,
  EmptyValues,
  ClassIf,
  ClassSwitch
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('classList$', () => {
      it('should render static string', () => {
        const { container } = render(StaticString())

        expect(container.innerHTML).toBe('<div><div class="static-class">Hello, world!</div></div>')
      })

      it('should render reactive string', () => {
        const className = atom('class-a')
        const { container } = render(ReactiveString({
          className
        }))

        expect(container.innerHTML).toBe('<div><div class="class-a">Hello, world!</div></div>')

        className.set('class-b')

        expect(container.innerHTML).toBe('<div><div class="class-b">Hello, world!</div></div>')
      })

      it('should render static strings', () => {
        const { container } = render(StaticStrings())

        expect(container.innerHTML).toBe('<div><div class="class-a class-b">Hello, world!</div></div>')
      })

      it('should render reactive strings array', () => {
        const classList = atom(['class-a', 'class-b'])
        const { container } = render(ReactiveStringsArray({
          classList
        }))

        expect(container.innerHTML).toBe('<div><div class="class-a class-b">Hello, world!</div></div>')

        classList.set(['class-c', 'class-d'])

        expect(container.innerHTML).toBe('<div><div class="class-c class-d">Hello, world!</div></div>')
      })

      it('should render reactive strings', () => {
        const className = atom('class-a')
        const { container } = render(ReactiveStrings({
          className
        }))

        expect(container.innerHTML).toBe('<div><div class="class-a">Hello, world!</div></div>')

        className.set('class-b')

        expect(container.innerHTML).toBe('<div><div class="class-b">Hello, world!</div></div>')
      })

      it('should render nested strings', () => {
        const className = atom('class-a')
        const { container } = render(NestedStrings({
          className
        }))

        expect(container.innerHTML).toBe('<div><div class="class-a class-b class-c">Hello, world!</div></div>')

        className.set('class-d')

        expect(container.innerHTML).toBe('<div><div class="class-b class-c class-d">Hello, world!</div></div>')
      })

      it('should render empty values', () => {
        const className = atom('class-a')
        const { container } = render(EmptyValues({
          className
        }))

        expect(container.innerHTML).toBe('<div><div class="class-a">Hello, world!</div></div>')

        className.set('')

        expect(container.innerHTML).toBe('<div><div class="">Hello, world!</div></div>')
      })

      it('should handle className string', () => {
        const className = atom('class-a class-b')
        const { container } = render(ReactiveString({
          className
        }))

        expect(container.innerHTML).toBe('<div><div class="class-a class-b">Hello, world!</div></div>')

        className.set('class-c')

        expect(container.innerHTML).toBe('<div><div class="class-c">Hello, world!</div></div>')
      })

      it('should hanlde classIf$ utility', () => {
        const className = atom('class-a')
        const enabled = atom(true)
        const { container } = render(ClassIf({
          className,
          enabled
        }))

        expect(container.innerHTML).toBe('<div><div class="class-a">Hello, world!</div></div>')

        enabled.set(false)

        expect(container.innerHTML).toBe('<div><div class="">Hello, world!</div></div>')
      })

      it('should handle classSwitch$ utility', () => {
        const theme = atom<'primary' | 'secondary'>('primary')
        const { container } = render(ClassSwitch({
          theme
        }))

        expect(container.innerHTML).toBe('<div><div class="theme-primary">Hello, world!</div></div>')

        theme.set('secondary')

        expect(container.innerHTML).toBe('<div><div class="theme-secondary">Hello, world!</div></div>')
      })
    })
  })
})
