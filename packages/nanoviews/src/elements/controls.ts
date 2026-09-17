import {
  type Accessor,
  $get,
  deferEffect,
  isAccessor,
  isEmpty,
  isWritable
} from 'kida'
import {
  type Attributes,
  createVoidElement,
  createElement,
  setAttribute
} from '../internals/index.js'

/**
 * The third state of a checkbox, for `checked`
 */
export const Indeterminate = Symbol.for('Indeterminate')

type InputElement = HTMLInputElement | HTMLTextAreaElement

type InputProperty = 'checked' | 'defaultChecked' | 'value' | 'defaultValue'

function setInput(
  input: InputElement,
  property: InputProperty,
  next: unknown
) {
  if (property === 'checked' || property === 'defaultChecked') {
    // The third state is a flag of its own: the check underneath is left
    // alone
    if (!((input as HTMLInputElement).indeterminate = next === Indeterminate)) {
      (input as HTMLInputElement)[property] = next as boolean
    }
  } else if (property === 'defaultValue') {
    input.defaultValue = next as string
  } else if (input.value !== next) {
    // The browser moves the caret to the end when a different value is
    // written, so the selection is put back, the way React does after a
    // commit. It is `null` on the types without a selection, `number` or
    // `email` say
    const { selectionStart, selectionEnd } = input

    input.value = next as string

    if (selectionStart !== null) {
      input.setSelectionRange(selectionStart, selectionEnd)
    }
  }
}

function setInputAttribute(
  input: InputElement,
  name: string,
  value: unknown
) {
  const isLive = name === 'checked' || name === 'value'

  // The state of a control and its default are properties, bound through an
  // accessor or set once by a plain value; every other attribute stays an
  // attribute
  if (isLive || name === 'defaultChecked' || name === 'defaultValue') {
    // The accessor is typed as one of `unknown`: the writer casts the value
    // to the property it writes
    if (isAccessor<Accessor<unknown>>(value)) {
      deferEffect(() => {
        // An empty value is an empty text, and no check either
        setInput(input, name, value() ?? '')
      }, true)

      // The state, and the state only, is two-way: the user's input goes to
      // a writable signal. A read-only accessor, a computed say, only drives
      // the control
      if (isLive && isWritable(value)) {
        input.addEventListener(
          name === 'checked' ? 'change' : 'input',
          () => value((input as HTMLInputElement)[name])
        )
      }
    } else if (!isEmpty(value)) {
      setInput(input, name, value)
    }
  } else {
    setAttribute(input, name, value)
  }
}

/* @__NO_SIDE_EFFECTS__ */
export function input(attributes?: Attributes<'input'>) {
  return createVoidElement('input', attributes, setInputAttribute)
}

/* @__NO_SIDE_EFFECTS__ */
export function textarea(attributes?: Attributes<'textarea'>) {
  return createVoidElement('textarea', attributes, setInputAttribute)
}

type SelectedProperty = 'selected' | 'defaultSelected'

// What the user picked: one value, or the list of them under `multiple`
function getSelected(select: HTMLSelectElement) {
  return select.multiple
    ? Array.from(select.selectedOptions, option => option.value)
    : select.value
}

// Every option gets the property written: `selected` for the value,
// `defaultSelected` for the default
function selectOptions(
  select: HTMLSelectElement,
  property: SelectedProperty,
  values: unknown
) {
  const options = select.options
  const isList = Array.isArray(values)

  for (let i = 0, len = options.length, option: HTMLOptionElement; i < len; i++) {
    option = options[i]
    option[property] = isList
      ? values.includes(option.value)
      : values === option.value
  }
}

function setSelectAttribute(
  select: HTMLSelectElement,
  name: string,
  value: unknown
) {
  const isLive = name === 'value'

  if (isLive || name === 'defaultValue') {
    // A plain empty value has nothing to select
    if (!isEmpty(value)) {
      const property: SelectedProperty = isLive ? 'selected' : 'defaultSelected'
      const apply = () => selectOptions(select, property, $get(value))

      // The options come after the attributes, so a plain value is applied
      // by the observer, once the children are in. The options built later,
      // by a `for_` or async data, and an option whose `value` attribute
      // changes come the same way, a microtask later, as in Svelte. The read
      // is untracked there, the callback runs outside any effect
      new MutationObserver(apply).observe(select, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value']
      })

      if (isAccessor(value)) {
        // Deferred on purpose: the first run lands at the scope start, once
        // the tree is in. Tracked, so it follows the accessor
        deferEffect(apply)

        // The signal is written by the user only, on a change
        if (isLive && isWritable(value)) {
          select.addEventListener('change', () => value(getSelected(select)))
        }
      }
    }
  } else {
    setAttribute(select, name, value)
  }
}

/* @__NO_SIDE_EFFECTS__ */
export function select(attributes?: Attributes<'select'>) {
  return createElement('select', attributes, setSelectAttribute)
}
