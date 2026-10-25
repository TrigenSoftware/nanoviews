import {
  type Accessor,
  type WritableSignal,
  computed,
  record,
  signal
} from 'nanoviews/store'
import {
  button,
  div,
  input,
  label,
  li,
  span,
  trackBy,
  ul,
  component$,
  as_,
  for_,
  if_
} from 'nanoviews'
import type { City } from '../services/types.js'

interface AutocompleteProps {
  id: string
  label: string
  name: string
  $value: WritableSignal<string>
  $suggestions: Accessor<City[]>
}

const FIRST_SUGGESTION = 0

export const Autocomplete = component$(({
  id,
  label: labelText,
  name,
  $value,
  $suggestions
}: AutocompleteProps) => {
  const $isOpen = signal(false)
  const $activeIndex = signal(FIRST_SUGGESTION)
  const $hasSuggestions = computed(() => $isOpen() && $suggestions().length > 0)
  const select = (value: string) => {
    $value(value)
    $isOpen(false)
    $activeIndex(FIRST_SUGGESTION)
  }

  return div({
    class: 'autocomplete'
  })(
    label({
      class: 'autocomplete-label',
      for: id
    })(
      labelText
    ),
    div({
      class: 'autocomplete-control'
    })(
      input({
        'aria-autocomplete': 'list',
        'aria-controls': `${id}-suggestions`,
        'aria-expanded': $hasSuggestions,
        autoComplete: 'off',
        class: 'autocomplete-field',
        id,
        name,
        role: 'combobox',
        type: 'text',
        value: $value,
        onBlur() {
          $isOpen(false)
        },
        onFocus() {
          $isOpen(true)
        },
        onInput() {
          $isOpen(true)
          $activeIndex(FIRST_SUGGESTION)
        },
        onKeyDown(event) {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            $isOpen(true)
            $activeIndex(Math.min($activeIndex() + 1, $suggestions().length - 1))
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            $activeIndex(Math.max($activeIndex() - 1, FIRST_SUGGESTION))
          } else if (event.key === 'Enter' && $hasSuggestions()) {
            event.preventDefault()
            select($suggestions()[$activeIndex()].label)
          } else if (event.key === 'Escape') {
            $isOpen(false)
          }
        }
      }),
      if_($hasSuggestions)(
        () => ul({
          class: 'autocomplete-list',
          id: `${id}-suggestions`,
          role: 'listbox'
        })(
          for_($suggestions, trackBy('label'))(
            as_(record, ($city, $index) => li({
              role: 'presentation'
            })(
              button({
                'aria-selected': computed(() => $index() === $activeIndex()),
                class: computed(() => (
                  $index() === $activeIndex()
                    ? 'autocomplete-option autocomplete-option-active'
                    : 'autocomplete-option'
                )),
                role: 'option',
                type: 'button',
                onMouseDown(event) {
                  event.preventDefault()
                },
                onClick() {
                  select($city.$label())
                }
              })(
                span({
                  class: 'autocomplete-option-title'
                })(
                  $city.$name
                ),
                span({
                  class: 'autocomplete-option-meta'
                })(
                  $city.$country
                )
              )
            ))
          )
        )
      )
    )
  )
})
