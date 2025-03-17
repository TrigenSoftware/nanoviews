/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
import {
  type WritableSignal,
  isSignal,
  effect
} from 'kida'
import {
  type ValueOrWritableSignal,
  type UnknownAttributes,
  valueProperty,
  checkedProperty,
  indeterminateProperty,
  optionsProperty,
  multipleProperty,
  selectedProperty,
  onChangeEvent,
  onInputEvent,
  isEmpty,
  noop,
  createEffectAttribute,
  effectAttributeValidate
} from '../internals/index.js'

// https://caniuse.com/?search=oninput onInput doesn't fire an input event when (un)checking a checkbox or radio button, or when changing the selected file(s) of an <input type="file">

export const Indeterminate = Symbol.for('Indeterminate')

type Value = ValueOrWritableSignal<string>

type CheckedPrimitive = boolean | typeof Indeterminate

type Checked = ValueOrWritableSignal<boolean> | ValueOrWritableSignal<CheckedPrimitive>

type SelectedPrimitive = string | string[]

type Selected = ValueOrWritableSignal<string> | ValueOrWritableSignal<string[]> | ValueOrWritableSignal<SelectedPrimitive>

type FilesPrimitive = File[]

type Files = ValueOrWritableSignal<FilesPrimitive>

type TextboxElement = HTMLInputElement | HTMLTextAreaElement

type CheckboxElement = HTMLInputElement

type ComboboxElement = HTMLSelectElement

type FileElement = HTMLInputElement

function createElementPropertySetter<E extends Element, V>(
  eventName: string,
  create: (control: E, value: V) => void,
  mount: (control: E, value: V) => void,
  update: (control: E, value: V) => void,
  getValue: (control: E) => V,
  validate?: (attributes: UnknownAttributes) => void
) {
  return (
    control: E,
    $value: ValueOrWritableSignal<V>,
    attributes: UnknownAttributes
  ): void => {
    if (import.meta.env.DEV) {
      validate?.(attributes)
    }

    if (!isEmpty($value)) {
      if (isSignal<WritableSignal<V>>($value)) {
        const eventListener = () => $value(getValue(control))
        const value = $value()

        create(control, value)

        effect(() => {
          mount(control, value)
          control.addEventListener(eventName, eventListener)

          return () => control.removeEventListener(eventName, eventListener)
        })

        effect((warmup) => {
          const value = $value()

          if (!warmup) {
            update(control, value)
          }
        })
      } else {
        create(control, $value)
        effect(() => mount(control, $value))
      }
    }
  }
}

function setValue(
  control: TextboxElement,
  value: string
) {
  control[valueProperty] = value
}

function getValue(control: TextboxElement) {
  return control[valueProperty]
}

/**
 * Effect attribute to set and read text value of input element
 */
export const value$ = /* @__PURE__ */ createEffectAttribute<'value$', TextboxElement, Value>(
  'value$',
  createElementPropertySetter(
    onInputEvent,
    setValue,
    noop,
    setValue,
    getValue,
    import.meta.env.DEV
      ? attributes => effectAttributeValidate(
        attributes,
        'value',
        'value$'
      )
      : undefined
  )
)

function setChecked(
  control: CheckboxElement,
  value: CheckedPrimitive
) {
  if (value === Indeterminate) {
    control[indeterminateProperty] = true
  } else {
    control[indeterminateProperty] = false
    control.checked = value as boolean
  }
}

function getChecked(control: CheckboxElement): CheckedPrimitive {
  return control[indeterminateProperty] ? Indeterminate : control[checkedProperty]
}

/**
 * Effect attribute to set and read checked value of checkbox or radio button element
 */
export const checked$ = /* @__PURE__ */ createEffectAttribute<'checked$', CheckboxElement, ValueOrWritableSignal<CheckedPrimitive>>(
  'checked$',
  createElementPropertySetter(
    onChangeEvent,
    setChecked,
    noop,
    setChecked,
    getChecked,
    import.meta.env.DEV
      ? attributes => effectAttributeValidate(
        attributes,
        'checked',
        'checked$'
      )
      : noop
  )
)

function setSelected(
  control: ComboboxElement,
  values: SelectedPrimitive
) {
  const options = control[optionsProperty]
  const len = options.length
  const test = Array.isArray(values)
    ? (v: string) => values.includes(v)
    : (v: string) => values === v

  if (len) {
    for (let i = 0, option: HTMLOptionElement; i < len; i++) {
      option = options[i]
      option[selectedProperty] = test(option[valueProperty])
    }
  }
}

function getSelected(control: ComboboxElement): SelectedPrimitive {
  const isMultiple = control[multipleProperty]
  const options = control[optionsProperty]
  const len = options.length
  const values: string[] = []

  if (len) {
    for (let i = 0, option: HTMLOptionElement; i < len; i++) {
      option = options[i]

      if (option[selectedProperty]) {
        if (isMultiple) {
          values.push(option[valueProperty])
        } else {
          return option[valueProperty]
        }
      }
    }
  }

  return values
}

/**
 * Effect attribute to set and read selected value of combobox element
 */
export const selected$ = /* @__PURE__ */ createEffectAttribute<'selected$', ComboboxElement, ValueOrWritableSignal<SelectedPrimitive>>(
  'selected$',
  createElementPropertySetter(
    onChangeEvent,
    (control: ComboboxElement, value: SelectedPrimitive) => {
      control.multiple = Array.isArray(value)
    },
    setSelected,
    setSelected,
    getSelected,
    import.meta.env.DEV
      ? attributes => effectAttributeValidate(
        attributes,
        ['value', 'multiple'],
        'selected$'
      )
      : noop
  )
)

function getFiles(control: FileElement): FilesPrimitive {
  return Array.from(control.files!)
}

/**
 * Effect attribute to read files of file input element
 */
export const files$ = /* @__PURE__ */ createEffectAttribute<'files$', FileElement, Files>(
  'files$',
  createElementPropertySetter(
    onChangeEvent,
    noop,
    noop,
    noop,
    getFiles
  )
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    value$: Value
    checked$: Checked
    selected$: Selected
    files$: Files
  }

  interface EffectAttributeTargets {
    value$: TextboxElement
    checked$: CheckboxElement
    selected$: ComboboxElement
    files$: FileElement
  }
}
