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
import { signal } from 'kida'
import {
  Indeterminate,
  form,
  input,
  textarea,
  select,
  option,
  fragment
} from '../index.js'
import * as Stories from './controls.stories.js'

const {
  TextInput,
  Textarea,
  TextareaDefaultValue,
  Checkbox,
  Select,
  MultipleSelect,
  SelectDefaultValue,
  DynamicOptions
} = composeStories(Stories)
// The observer of a select delivers a microtask later
const tick = () => Promise.resolve()

describe('nanoviews', () => {
  describe('elements', () => {
    describe('controls', () => {
      describe('input', () => {
        describe('value', () => {
          it('should bind the value both ways', () => {
            const value = signal('Hello, world!')

            render(TextInput({
              value
            }))

            const textbox = screen.getByRole<HTMLInputElement>('textbox')

            expect(textbox.value).toBe('Hello, world!')

            value('Hello, nanoviews!')

            expect(textbox.value).toBe('Hello, nanoviews!')

            fireEvent.input(textbox, {
              target: {
                value: 'user input'
              }
            })

            expect(textbox.value).toBe('user input')
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

          it('should take an empty value as an empty text', () => {
            const { container } = render(() => input({
              value: () => undefined
            }))

            expect(container.querySelector('input')!.value).toBe('')
          })

          it('should keep the caret in place when the value is rewritten', () => {
            const $value = signal('abc')
            const { container } = render(() => input({
              value: $value,
              onInput: () => $value(text => text.toUpperCase())
            }))
            const textbox = container.querySelector('input')!

            textbox.value = 'abxc'
            textbox.setSelectionRange(3, 3)
            fireEvent.input(textbox)

            expect($value()).toBe('ABXC')
            expect(textbox.value).toBe('ABXC')
            expect(textbox.selectionStart).toBe(3)
          })

          it('should set a plain value', () => {
            const { container } = render(() => input({
              value: 'Hello, world!'
            }))
            const textbox = container.querySelector('input')!

            expect(textbox.value).toBe('Hello, world!')
            expect(textbox.hasAttribute('value')).toBe(false)

            fireEvent.input(textbox, {
              target: {
                value: 'user input'
              }
            })

            expect(textbox.value).toBe('user input')
          })

          it('should follow a default value one way', () => {
            const $default = signal('a')
            const { container } = render(() => input({
              defaultValue: $default
            }))
            const textbox = container.querySelector('input')!

            expect(textbox.value).toBe('a')
            expect(textbox.defaultValue).toBe('a')

            $default('b')

            expect(textbox.defaultValue).toBe('b')

            fireEvent.input(textbox, {
              target: {
                value: 'typed'
              }
            })

            expect($default()).toBe('b')
          })

          it('should reset a form to the default values', () => {
            const { container } = render(() => form()(
              input({
                defaultValue: 'static'
              }),
              input({
                type: 'checkbox',
                defaultChecked: true
              })
            ))
            const [textbox, checkbox] = Array.from(container.querySelectorAll('input'))

            expect(textbox.value).toBe('static')
            expect(checkbox.checked).toBe(true)

            fireEvent.input(textbox, {
              target: {
                value: 'typed'
              }
            })
            fireEvent.change(checkbox, {
              target: {
                checked: false
              }
            })

            container.querySelector('form')!.reset()

            expect(textbox.value).toBe('static')
            expect(checkbox.checked).toBe(true)
          })
        })

        describe('checked', () => {
          it('should bind the checked state both ways', () => {
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

          it('should set the indeterminate state by a plain value', () => {
            const { container } = render(() => input({
              type: 'checkbox',
              checked: Indeterminate
            }))
            const checkbox = container.querySelector('input')!

            expect(checkbox.indeterminate).toBe(true)
            expect(checkbox.checked).toBe(false)
          })

          it('should set a plain value', () => {
            const { container } = render(() => input({
              type: 'checkbox',
              checked: true
            }))
            const checkbox = container.querySelector('input')!

            expect(checkbox.checked).toBe(true)
            expect(checkbox.hasAttribute('checked')).toBe(false)
          })
        })
      })

      describe('select', () => {
        it('should bind the value both ways', () => {
          const value = signal('green')

          render(Select({
            value
          }))

          const combobox = screen.getByRole<HTMLSelectElement>('combobox')

          expect(combobox.value).toBe('green')

          value('red')

          expect(combobox.value).toBe('red')

          fireEvent.change(combobox, {
            target: {
              value: 'blue'
            }
          })

          expect(combobox.value).toBe('blue')
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

          const listbox = screen.getByRole<HTMLSelectElement>('listbox')

          fireEvent.change(listbox, {
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

        it('should select a plain value once the options are in', async () => {
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

          await tick()

          expect(container.querySelector('select')!.value).toBe('blue')
        })

        it('should select the options built later', async () => {
          const value = signal('blue')
          const options = signal(['red'])

          render(DynamicOptions({
            value,
            options
          }))

          const combobox = screen.getByRole<HTMLSelectElement>('combobox')

          options([
            'red',
            'green',
            'blue'
          ])
          await tick()

          expect(combobox.value).toBe('blue')

          value('green')

          expect(combobox.value).toBe('green')
        })

        it('should follow the value of an option', async () => {
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
          await tick()

          expect(combobox.value).toBe('blue')
        })

        it('should set a default value once the options are in', async () => {
          const { container } = render(SelectDefaultValue())
          const combobox = container.querySelector('select')!

          await tick()

          expect(combobox.value).toBe('green')
          expect(container.querySelector('option[value="green"]')!.hasAttribute('selected')).toBe(true)
        })

        it('should reset a form to the default value', async () => {
          const { container } = render(() => form()(
            select({
              defaultValue: 'green'
            })(
              option({
                value: 'red'
              })('Red'),
              option({
                value: 'green'
              })('Green')
            )
          ))
          const combobox = container.querySelector('select')!

          await tick()

          expect(combobox.value).toBe('green')

          fireEvent.change(combobox, {
            target: {
              value: 'red'
            }
          })

          expect(combobox.value).toBe('red')

          container.querySelector('form')!.reset()

          expect(combobox.value).toBe('green')
        })

        it('should follow a default value one way', () => {
          const $default = signal('red')
          const { container } = render(() => select({
            defaultValue: $default
          })(
            option({
              value: 'red'
            })('Red'),
            option({
              value: 'green'
            })('Green')
          ))
          const combobox = container.querySelector('select')!

          expect(combobox.value).toBe('red')

          $default('green')

          expect(container.querySelector('option[value="green"]')!.hasAttribute('selected')).toBe(true)

          fireEvent.change(combobox, {
            target: {
              value: 'red'
            }
          })

          expect($default()).toBe('green')
        })

        it('should build a select without a value', () => {
          const onChange = vi.fn()
          const { container } = render(() => select({
            onChange
          })(
            option({
              value: 'a'
            })('A'),
            option({
              value: 'b'
            })('B')
          ))
          const combobox = container.querySelector('select')!

          fireEvent.change(combobox, {
            target: {
              value: 'b'
            }
          })

          expect(onChange).toHaveBeenCalledTimes(1)
          expect(combobox.value).toBe('b')
        })
      })

      describe('textarea', () => {
        it('should bind the value both ways', () => {
          const value = signal('Hello, world!')

          render(Textarea({
            value
          }))

          const textbox = screen.getByRole<HTMLTextAreaElement>('textbox')

          expect(textbox.value).toBe('Hello, world!')

          value('Hello, nanoviews!')

          expect(textbox.value).toBe('Hello, nanoviews!')

          fireEvent.input(textbox, {
            target: {
              value: 'user input'
            }
          })

          expect(textbox.value).toBe('user input')
          expect(value()).toBe('user input')
        })

        it('should set a default value as the text', () => {
          const { container } = render(TextareaDefaultValue())
          const textbox = container.querySelector('textarea')!

          expect(textbox.value).toBe('Default Value')
          expect(textbox.textContent).toBe('Default Value')
        })

        it('should reset a form to the default value', () => {
          const { container } = render(() => form()(
            textarea({
              defaultValue: 'text'
            })
          ))
          const textbox = container.querySelector('textarea')!

          fireEvent.input(textbox, {
            target: {
              value: 'typed'
            }
          })

          container.querySelector('form')!.reset()

          expect(textbox.value).toBe('text')
        })
      })

      describe('input', () => {
        describe('other attributes', () => {
          it('should keep the other reactive attributes bound', () => {
            const $placeholder = signal('Name')
            const $disabled = signal(false)
            const { container } = render(() => input({
              placeholder: $placeholder,
              disabled: $disabled,
              class: ['field', () => $disabled() && 'field_disabled']
            }))
            const textbox = container.querySelector('input')!

            expect(textbox.placeholder).toBe('Name')
            expect(textbox.disabled).toBe(false)
            expect(textbox.className).toBe('field')

            $placeholder('Full name')
            $disabled(true)

            expect(textbox.placeholder).toBe('Full name')
            expect(textbox.disabled).toBe(true)
            expect(textbox.className).toBe('field field_disabled')
          })
        })
      })
    })
  })
})
