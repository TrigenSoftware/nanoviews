import {
  vi,
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
import { userEvent } from '@testing-library/user-event'
import { signal } from 'kida'
import {
  input,
  select,
  option,
  fragment
} from '../index.js'
import * as Stories from './controls.stories.js'
import type { Indeterminate } from './controls.js'

const {
  TextInput,
  Textarea,
  Select,
  MultipleSelect,
  Checkbox,
  Files
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('controls', () => {
      describe('value$', () => {
        it('should handle value of text input', () => {
          const value = signal('Hello, world!')

          render(TextInput({
            value
          }))

          const input = screen.getByRole<HTMLInputElement>('textbox')

          expect(input.value).toBe('Hello, world!')

          value('Hello, nanoviews!')

          expect(input.value).toBe('Hello, nanoviews!')

          fireEvent.change(input, {
            target: {
              value: 'user input'
            }
          })

          expect(input.value).toBe('user input')
        })

        it('should handle value of textarea', () => {
          const value = signal('Hello, world!')

          render(Textarea({
            value
          }))

          const textarea = screen.getByRole<HTMLTextAreaElement>('textbox')

          expect(textarea.value).toBe('Hello, world!')

          value('Hello, nanoviews!')

          expect(textarea.value).toBe('Hello, nanoviews!')

          fireEvent.change(textarea, {
            target: {
              value: 'user input'
            }
          })

          expect(textarea.value).toBe('user input')
        })

        it('should run alongside a handler for the same event, in either order', () => {
          const seen: string[] = []
          const $bound = signal('')
          const $reversed = signal('')
          const { container } = render(() => fragment(
            input({
              value$: $bound,
              onInput: () => seen.push(`bound:${$bound()}`)
            }),
            input({
              onInput: () => seen.push(`reversed:${$reversed()}`),
              value$: $reversed
            })
          ))
          const [bound, reversed] = Array.from(container.querySelectorAll('input'))

          fireEvent.input(bound, {
            target: {
              value: 'a'
            }
          })
          fireEvent.input(reversed, {
            target: {
              value: 'b'
            }
          })

          // both listeners run whatever the key order was; only what the
          // handler sees in the signal follows it, and the DOM value is
          // current either way
          expect($bound()).toBe('a')
          expect($reversed()).toBe('b')
          expect(seen).toEqual([
            'bound:a',
            'reversed:'
          ])
        })

        it('should follow a read-only accessor without writing back', () => {
          const $value = vi.fn(() => 'Hello, world!')
          const { container } = render(() => input({
            value$: $value
          }))
          const textbox = container.querySelector('input')!

          expect(textbox.value).toBe('Hello, world!')

          fireEvent.input(textbox, {
            target: {
              value: 'user input'
            }
          })

          expect(textbox.value).toBe('user input')
          expect($value).not.toHaveBeenCalledWith('user input')
        })
      })

      describe('selected$', () => {
        it('should handle value of select', () => {
          const value = signal('green')

          render(Select({
            value
          }))

          const select = screen.getByRole<HTMLSelectElement>('combobox')

          expect(select.value).toBe('green')

          value('red')

          expect(select.value).toBe('red')

          fireEvent.change(select, {
            target: {
              value: 'blue'
            }
          })

          expect(select.value).toBe('blue')
        })

        it('should handle multiple values of select', () => {
          const values = signal(['green', 'blue'])

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

        it('should follow a read-only accessor without writing back', () => {
          const $selected = vi.fn(() => 'green')
          const { container } = render(() => select({
            selected$: $selected
          })(
            option({
              value: 'red'
            })('Red'),
            option({
              value: 'green'
            })('Green'),
            option({
              value: 'blue'
            })('Blue')
          ))
          const combobox = container.querySelector('select')!

          expect(combobox.value).toBe('green')

          fireEvent.change(combobox, {
            target: {
              value: 'blue'
            }
          })

          expect(combobox.value).toBe('blue')
          expect($selected).not.toHaveBeenCalledWith('blue')
        })
      })

      describe('checked$', () => {
        it('should handle checked state of checkbox', () => {
          const checked = signal<boolean | typeof Indeterminate>(true)

          render(Checkbox({
            checked
          }))

          const checkbox = screen.getByRole<HTMLInputElement>('checkbox')

          expect(checkbox.checked).toBe(true)

          checked(false)

          expect(checkbox.checked).toBe(false)

          fireEvent.change(checkbox, {
            target: {
              checked: true
            }
          })

          expect(checkbox.checked).toBe(true)
        })

        it('should follow a read-only accessor without writing back', () => {
          const $checked = vi.fn(() => true)
          const { container } = render(() => input({
            type: 'checkbox',
            checked$: $checked
          }))
          const checkbox = container.querySelector('input')!

          expect(checkbox.checked).toBe(true)

          fireEvent.change(checkbox, {
            target: {
              checked: false
            }
          })

          expect(checkbox.checked).toBe(false)
          expect($checked).not.toHaveBeenCalledWith(false)
        })
      })

      describe('files$', () => {
        it('should save files to signal', async () => {
          const files = signal<File[]>([])
          const user = userEvent.setup()
          const file = new File(['hello'], 'hello.png', {
            type: 'image/png'
          })
          const { container } = render(Files({
            files
          }))
          const fileInput = container.firstChild?.firstChild as HTMLInputElement

          await user.upload(fileInput, file)

          expect(files()[0]).toBe(file)
        })
      })
    })
  })
})
