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
  Indeterminate,
  form,
  input,
  textarea,
  select,
  option,
  datalist,
  fragment
} from '../index.js'
import * as Stories from './controls.stories.js'

const {
  TextInput,
  Textarea,
  Select,
  MultipleSelect,
  DynamicOptions,
  Checkbox,
  Files
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('controls', () => {
      describe('value', () => {
        it('should bind the value of a text input both ways', () => {
          const value = signal('Hello, world!')

          render(TextInput({
            value
          }))

          const input = screen.getByRole<HTMLInputElement>('textbox')

          expect(input.value).toBe('Hello, world!')

          value('Hello, nanoviews!')

          expect(input.value).toBe('Hello, nanoviews!')

          fireEvent.input(input, {
            target: {
              value: 'user input'
            }
          })

          expect(input.value).toBe('user input')
          expect(value()).toBe('user input')
        })

        it('should bind the value of a textarea both ways', () => {
          const value = signal('Hello, world!')

          render(Textarea({
            value
          }))

          const textarea = screen.getByRole<HTMLTextAreaElement>('textbox')

          expect(textarea.value).toBe('Hello, world!')

          value('Hello, nanoviews!')

          expect(textarea.value).toBe('Hello, nanoviews!')

          fireEvent.input(textarea, {
            target: {
              value: 'user input'
            }
          })

          expect(textarea.value).toBe('user input')
          expect(value()).toBe('user input')
        })

        it('should run alongside a handler for the same event, in either order', () => {
          const seen: string[] = []
          const $bound = signal('')
          const $reversed = signal('')
          const { container } = render(() => fragment(
            input({
              value: $bound,
              onInput: () => seen.push(`bound:${$bound()}`)
            }),
            input({
              onInput: () => seen.push(`reversed:${$reversed()}`),
              value: $reversed
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
            value: $value
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

        it('should take a plain value', () => {
          const { container } = render(() => input({
            value: 'Hello, world!'
          }))
          const textbox = container.querySelector('input')!

          expect(textbox.value).toBe('Hello, world!')

          fireEvent.input(textbox, {
            target: {
              value: 'user input'
            }
          })

          expect(textbox.value).toBe('user input')
        })

        it('should take an empty value as an empty text', () => {
          const { container } = render(() => fragment(
            input({
              value: undefined
            }),
            input({
              value: () => null
            })
          ))
          const [plain, reactive] = Array.from(container.querySelectorAll('input'))

          expect(plain.value).toBe('')
          expect(reactive.value).toBe('')
        })
      })

      describe('select value', () => {
        it('should bind the value of a select both ways', () => {
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
          expect(value()).toBe('blue')
        })

        it('should bind the values of a multiple select both ways', () => {
          const values = signal(['green', 'blue'])

          render(MultipleSelect({
            values
          }))

          expect(screen.getAllByRole<HTMLOptionElement>('option', {
            selected: true
          })).toHaveLength(2)

          const select = screen.getByRole<HTMLSelectElement>('listbox')

          fireEvent.change(select, {
            target: {
              value: 'blue'
            }
          })

          expect(screen.getAllByRole<HTMLOptionElement>('option', {
            selected: true
          })).toHaveLength(1)
          expect(values()).toEqual(['blue'])
        })

        it('should follow a read-only accessor without writing back', () => {
          const $selected = vi.fn(() => 'green')
          const { container } = render(() => select({
            value: $selected
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

        it('should take a plain value', () => {
          const { container } = render(() => select({
            value: 'blue'
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

          expect(container.querySelector('select')!.value).toBe('blue')
        })

        it('should select the options built later', () => {
          const value = signal('blue')
          const options = signal(['red'])

          render(DynamicOptions({
            value,
            options
          }))

          const select = screen.getByRole<HTMLSelectElement>('combobox')

          options([
            'red',
            'green',
            'blue'
          ])

          expect(select.value).toBe('blue')

          value('green')

          expect(select.value).toBe('green')
        })

        it('should match an option by its text without a value', () => {
          const { container } = render(() => select({
            value: 'Green'
          })(
            option()('Red'),
            option()('Green')
          ))

          expect(container.querySelector('select')!.value).toBe('Green')
        })

        it('should follow the value of an option', () => {
          const value = signal('blue')
          const $option = signal('red')
          const { container } = render(() => select({
            value
          })(
            option({
              value: 'green'
            })('Green'),
            option({
              value: $option
            })('Changing')
          ))
          const combobox = container.querySelector('select')!

          expect(combobox.value).toBe('green')

          $option('blue')

          expect(combobox.value).toBe('blue')
        })

        it('should build a select without a value and an option outside a select', () => {
          const onChange = vi.fn()
          const { container } = render(() => fragment(
            select({
              onChange
            })(
              option({
                value: 'a'
              })('A'),
              option({
                value: 'b'
              })('B')
            ),
            datalist({
              id: 'colors'
            })(
              option({
                value: 'red'
              }),
              option({
                value: 'green'
              })
            )
          ))
          const combobox = container.querySelector('select')!

          fireEvent.change(combobox, {
            target: {
              value: 'b'
            }
          })

          expect(onChange).toHaveBeenCalledTimes(1)
          expect(combobox.value).toBe('b')
          expect(container.querySelectorAll('datalist option')).toHaveLength(2)
        })
      })

      describe('checked', () => {
        it('should bind the checked state of a checkbox both ways', () => {
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
          expect(checked()).toBe(true)
        })

        it('should set the indeterminate state', () => {
          const checked = signal<boolean | typeof Indeterminate>(Indeterminate)

          render(Checkbox({
            checked
          }))

          const checkbox = screen.getByRole<HTMLInputElement>('checkbox')

          expect(checkbox.indeterminate).toBe(true)

          checked(false)

          expect(checkbox.indeterminate).toBe(false)
          expect(checkbox.checked).toBe(false)
        })

        it('should follow a read-only accessor without writing back', () => {
          const $checked = vi.fn(() => true)
          const { container } = render(() => input({
            type: 'checkbox',
            checked: $checked
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

        it('should take a plain value', () => {
          const { container } = render(() => input({
            type: 'checkbox',
            checked: true
          }))

          expect(container.querySelector('input')!.checked).toBe(true)
        })
      })

      describe('form reset', () => {
        it('should reset the controls to the values they are bound to', () => {
          const $text = signal('bound')
          const { container } = render(() => form()(
            input({
              value: 'static'
            }),
            input({
              value: $text
            }),
            input({
              type: 'checkbox',
              checked: true
            }),
            textarea({
              value: 'text'
            })('children'),
            select({
              value: 'b'
            })(
              option({
                value: 'a'
              })('A'),
              option({
                value: 'b'
              })('B')
            )
          ))
          const form_ = container.querySelector('form')!
          const [plain, bound, checkbox] = Array.from(container.querySelectorAll('input'))
          const textbox = container.querySelector('textarea')!
          const combobox = container.querySelector('select')!

          // `value` replaces the children as the default text
          expect(textbox.value).toBe('text')
          expect(textbox.textContent).toBe('text')

          fireEvent.input(plain, {
            target: {
              value: 'typed'
            }
          })
          fireEvent.input(bound, {
            target: {
              value: 'typed'
            }
          })
          fireEvent.change(checkbox, {
            target: {
              checked: false
            }
          })
          fireEvent.input(textbox, {
            target: {
              value: 'typed'
            }
          })
          fireEvent.change(combobox, {
            target: {
              value: 'a'
            }
          })

          form_.reset()

          expect(plain.value).toBe('static')
          // the default follows the signal, so the control stays at what the
          // user typed
          expect(bound.value).toBe('typed')
          expect(checkbox.checked).toBe(true)
          expect(textbox.value).toBe('text')
          expect(combobox.value).toBe('b')
        })
      })

      describe('file value', () => {
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

      describe('types', () => {
        it('should type the value by the kind of control', () => {
          input({
            value: 'text'
          })
          input({
            type: 'number',
            value: 5
          })
          input({
            type: 'checkbox',
            value: 'on',
            checked: signal(false)
          })
          input({
            type: 'file',
            value: signal<File[]>([])
          })
          input({
            type: 'text',
            // @ts-expect-error a text input has no checked state
            checked: true
          })
          input({
            type: 'file',
            // @ts-expect-error the value of a file input is the signal that receives the files
            value: 'x'
          })
          input({
            // @ts-expect-error the type is static
            type: signal('text')
          })
          select({
            value: 'a'
          })
          select({
            multiple: true,
            value: ['a']
          })
          select({
            // @ts-expect-error a single select holds one value
            value: ['a']
          })
          select({
            multiple: true,
            // @ts-expect-error a multiple select holds a list
            value: 'a'
          })
        })
      })
    })
  })
})
