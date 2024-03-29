import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  screen,
  fireEvent
} from '@nanoviews/testing-library'
import { atom } from 'nanostores'
import * as Stories from './controls.stories.js'

const {
  TextInput,
  Textarea,
  Select,
  MultipleSelect,
  Checkbox
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('controls', () => {
      describe('value$', () => {
        it('should handle value of text input', () => {
          const value = atom('Hello, world!')

          render(TextInput({
            value
          }))

          const input = screen.getByRole<HTMLInputElement>('textbox')

          expect(input.value).toBe('Hello, world!')

          value.set('Hello, nanoviews!')

          expect(input.value).toBe('Hello, nanoviews!')

          fireEvent.change(input, {
            target: {
              value: 'user input'
            }
          })

          expect(input.value).toBe('user input')
        })

        it('should handle value of textarea', () => {
          const value = atom('Hello, world!')

          render(Textarea({
            value
          }))

          const textarea = screen.getByRole<HTMLTextAreaElement>('textbox')

          expect(textarea.value).toBe('Hello, world!')

          value.set('Hello, nanoviews!')

          expect(textarea.value).toBe('Hello, nanoviews!')

          fireEvent.change(textarea, {
            target: {
              value: 'user input'
            }
          })

          expect(textarea.value).toBe('user input')
        })
      })

      describe('selected$', () => {
        it('should handle value of select', () => {
          const value = atom('green')

          render(Select({
            value
          }))

          const select = screen.getByRole<HTMLSelectElement>('combobox')

          expect(select.value).toBe('green')

          value.set('red')

          expect(select.value).toBe('red')

          fireEvent.change(select, {
            target: {
              value: 'blue'
            }
          })

          expect(select.value).toBe('blue')
        })

        it('should handle multiple values of select', () => {
          const values = atom(['green', 'blue'])

          render(MultipleSelect({
            values
          }))

          expect(screen.getAllByRole<HTMLSelectElement>('option', {
            selected: true
          })).toHaveLength(2)

          const select = screen.getByRole<HTMLSelectElement>('listbox')

          fireEvent.change(select, {
            target: {
              value: 'blue'
            }
          })

          expect(screen.getAllByRole<HTMLSelectElement>('option', {
            selected: true
          })).toHaveLength(1)
        })
      })

      describe('checked$', () => {
        it('should handle checked state of checkbox', () => {
          const checked = atom(true)

          render(Checkbox({
            checked
          }))

          const checkbox = screen.getByRole<HTMLInputElement>('checkbox')

          expect(checkbox.checked).toBe(true)

          checked.set(false)

          expect(checkbox.checked).toBe(false)

          fireEvent.change(checkbox, {
            target: {
              checked: true
            }
          })

          expect(checkbox.checked).toBe(true)
        })
      })
    })
  })
})
