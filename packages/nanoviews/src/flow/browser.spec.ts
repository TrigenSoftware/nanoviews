import {
  describe,
  it,
  expect,
  vi
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import {
  signal,
  inject,
  provide
} from 'kida'
import { context$ } from '../component/context.js'
import { b } from '../elements/elements.js'
import * as Stories from './browser.stories.js'
import { browser_ } from './browser.js'

const { Language } = composeStories(Stories)

function Theme$() {
  return signal('light')
}

describe('nanoviews', () => {
  describe('flow', () => {
    describe('browser_', () => {
      it('should build the child in place', () => {
        const { container } = render(Language())

        expect(container.innerHTML).toBe(`<div><b>${navigator.language}</b></div>`)
      })

      it('should never build the fallback', () => {
        const fallback = vi.fn(() => b()('loading'))
        const { container } = render(() => browser_(() => b()('chart'), fallback))

        expect(container.innerHTML).toBe('<div><b>chart</b></div>')
        expect(fallback).not.toHaveBeenCalled()
      })

      it('should build the child within the context it is placed in', () => {
        const { container } = render(() => context$(provide(Theme$, signal('dark')))(
          browser_(() => b()(
            inject(Theme$)
          ))
        ))

        expect(container.innerHTML).toBe('<div><b>dark</b></div>')
      })
    })
  })
})
