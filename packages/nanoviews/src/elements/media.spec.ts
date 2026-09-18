import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  fireEvent
} from '@nanoviews/testing-library'
import { signal } from 'kida'
import {
  audio,
  video
} from '../index.js'
import * as Stories from './media.stories.js'

const { Video } = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('media', () => {
      describe('muted', () => {
        it('should bind the muted state both ways', () => {
          const muted = signal(true)
          const { container } = render(Video({
            muted
          }))
          const player = container.querySelector('video')!

          expect(player.muted).toBe(true)

          muted(false)

          expect(player.muted).toBe(false)

          player.muted = true
          fireEvent.volumeChange(player)

          expect(muted()).toBe(true)
        })

        it('should follow a read-only accessor without writing back', () => {
          const $muted = vi.fn(() => true)
          const { container } = render(() => audio({
            muted: $muted
          })())
          const player = container.querySelector('audio')!

          expect(player.muted).toBe(true)

          player.muted = false
          fireEvent.volumeChange(player)

          expect($muted).not.toHaveBeenCalledWith(false)
        })

        it('should set a plain value through the property', () => {
          const { container } = render(() => video({
            controls: true,
            muted: true
          })())
          const player = container.querySelector('video')!

          expect(player.muted).toBe(true)
          expect(player.hasAttribute('controls')).toBe(true)
        })
      })
    })
  })
})
