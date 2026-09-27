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
import {
  b,
  i
} from '../elements/elements.js'
import { default_ } from './switch.js'
import { when_ } from './match.js'
import * as Stories from './showMatch.stories.js'
import { show_match_ } from './showMatch.js'

const {
  StaticValue,
  ReactiveValue,
  ReactiveValueWithoutDefault,
  KeptAlive
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('flow', () => {
    describe('show_match_', () => {
      it('should show the first case that holds among static values', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><b>Ready</b></div>')
      })

      it('should show the first case that holds', () => {
        const loading = signal(true)
        const error = signal(false)
        const { container } = render(ReactiveValue({
          loading,
          error
        }))

        expect(container.innerHTML).toBe('<div><i>Loading</i></div>')

        loading(false)

        expect(container.innerHTML).toBe('<div>Ready</div>')

        error(true)

        expect(container.innerHTML).toBe('<div><b>Error</b></div>')
      })

      it('should show nothing when no case holds and there is no default', () => {
        const loading = signal(true)
        const error = signal(false)
        const { container } = render(ReactiveValueWithoutDefault({
          loading,
          error
        }))

        loading(false)

        expect(container.innerHTML).toBe('<div></div>')
      })

      it('should build every case once, up front', () => {
        const loading = signal(true)
        const renderLoading = vi.fn(() => i()('Loading'))
        const renderReady = vi.fn(() => 'Ready')

        render(() => show_match_(
          when_(loading, renderLoading),
          default_(renderReady)
        ))

        expect(renderLoading).toHaveBeenCalledOnce()
        expect(renderReady).toHaveBeenCalledOnce()

        loading(false)
        loading(true)

        expect(renderLoading).toHaveBeenCalledOnce()
        expect(renderReady).toHaveBeenCalledOnce()
      })

      it('should keep the state of a case across the flips', () => {
        const loading = signal(false)
        const { container } = render(KeptAlive({
          loading
        }))
        const [counter] = container.getElementsByTagName('button')

        fireEvent.click(counter)
        loading(true)

        expect(container.innerHTML).toBe('<div><i>Loading</i></div>')

        loading(false)

        expect(container.getElementsByTagName('button')[0]).toBe(counter)
        expect(container.innerHTML).toBe('<div><button>Count: 1</button></div>')
      })

      it('should not read a case below the one that holds', () => {
        const loading = signal(true)
        const error = vi.fn(() => false)

        render(ReactiveValue({
          loading,
          error
        }))

        expect(error).not.toHaveBeenCalled()

        loading(false)

        expect(error).toHaveBeenCalled()
      })

      describe('types', () => {
        it('should turn away a child that takes the value of its case', () => {
          const $post = signal<{ title: string } | null>(null)

          show_match_(
            when_($post, () => b()('Post')),
            // @ts-expect-error the child lives while the post is null too
            when_($post, $post => b()(() => $post().title))
          )
        })
      })
    })
  })
})
