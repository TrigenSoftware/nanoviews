import type {
  ValueOrStore,
  EmptyValue,
  UnknownAttributes,
  StrictEffect,
  Destroy
} from '../internals/index.js'
import {
  valueAttribute,
  checkedAttribute,
  onChangeEvent,
  onInputEvent,
  isStore,
  isEmpty,
  isReadonlyArray,
  isArray,
  createEffectAttribute,
  effectAttributeValidate
} from '../internals/index.js'

export const Indeterminate = Symbol.for('Indeterminate')

type Value = ValueOrStore<string | EmptyValue>

type Checked = ValueOrStore<boolean | typeof Indeterminate | EmptyValue>

type Selected = ValueOrStore<string | EmptyValue> | ValueOrStore<string[] | EmptyValue>

type TextboxElement = HTMLInputElement | HTMLTextAreaElement

type ComboboxElement = HTMLSelectElement

type CheckboxElement = HTMLInputElement

// I don't want do additional runtime check, input data is guaranteed to be correct
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ControlElement = Record<string, any> & Element

function setAttribute(
  control: ControlElement,
  name: string,
  value: unknown,
  prevValue?: unknown
) {
  if (name === checkedAttribute) {
    if (value === Indeterminate) {
      control.indeterminate = value
    } else if (prevValue === Indeterminate) {
      control.indeterminate = false
    }
  }

  control[name] = value
}

function getAttribute(
  control: ControlElement,
  name: string
) {
  if (control.indeterminate) {
    return Indeterminate
  }

  return control[name] as unknown
}

function setControlAttribute(
  control: TextboxElement,
  attributes: UnknownAttributes,
  eventName: typeof onChangeEvent | typeof onInputEvent,
  name: typeof valueAttribute,
  $value: Value
): StrictEffect<void>

function setControlAttribute(
  control: CheckboxElement,
  attributes: UnknownAttributes,
  eventName: typeof onChangeEvent | typeof onInputEvent,
  name: typeof checkedAttribute,
  $value: Checked
): StrictEffect<void>

function setControlAttribute(
  control: ControlElement,
  attributes: UnknownAttributes,
  eventName: typeof onChangeEvent | typeof onInputEvent,
  name: string,
  $value: unknown
) {
  if (import.meta.env.DEV) {
    effectAttributeValidate(
      attributes,
      name,
      `${name}$`
    )
  }

  if (!isEmpty($value)) {
    if (isStore($value)) {
      const eventListener = () => {
        $value.set(getAttribute(control, name))
      }

      setAttribute(control, name, $value.get())

      return () => {
        control.addEventListener(eventName, eventListener)

        let destroy: Destroy | null = $value.listen((value, prevValue) => {
          setAttribute(control, name, value, prevValue)
        })

        return () => {
          control.removeEventListener(eventName, eventListener)
          destroy!()
          destroy = null
        }
      }
    }

    setAttribute(control, name, $value)
  }
}

function setValueByType(
  control: TextboxElement,
  attributes: UnknownAttributes,
  type: string | undefined,
  $value: Value
) {
  // https://caniuse.com/?search=oninput onInput doesn't fire an input event when (un)checking a checkbox or radio button, or when changing the selected file(s) of an <input type="file">
  const eventName = type === 'file' ? onChangeEvent : onInputEvent

  return setControlAttribute(control, attributes, eventName, valueAttribute, $value)
}

function setValue(
  control: TextboxElement,
  $value: Value,
  attributes: { type?: ValueOrStore<string> }
) {
  const { type } = attributes

  if (isStore(type)) {
    let effect: StrictEffect<void> | null = setValueByType(control, attributes, type.get(), $value)

    return () => {
      let destroy: Destroy | null = effect!()

      effect = null

      let unsubscribe: Destroy | null = type.listen((type) => {
        destroy!()
        destroy = setValueByType(control, attributes, type, $value)()
      })

      return () => {
        unsubscribe!()
        destroy!()
        destroy = null
        unsubscribe = null
      }
    }
  }

  return setValueByType(control, attributes, type, $value)
}

function setSelectedOptions(options: HTMLOptionsCollection, values: string | readonly string[] | EmptyValue) {
  const test = isReadonlyArray(values)
    ? (v: string) => values.includes(v)
    : (v: string) => values === v

  for (let i = 0, len = options.length, option = options[i]; i < len; option = options[++i]) {
    option.selected = test(option.value)
  }
}

function getSelectedOptions(options: HTMLOptionsCollection, isMultiple?: boolean) {
  const values: string[] = []

  for (let i = 0, len = options.length, option = options[i]; i < len; option = options[++i]) {
    if (option.selected) {
      if (isMultiple) {
        values.push(option.value)
      } else {
        return option.value
      }
    }
  }

  return values
}

function setSelected(
  control: ComboboxElement,
  $value: ValueOrStore<string | string[] | EmptyValue>,
  attributes: UnknownAttributes
) {
  if (import.meta.env.DEV) {
    effectAttributeValidate(
      attributes,
      ['value', 'multiple'],
      'selected$'
    )
  }

  if (!isEmpty($value)) {
    const set = (value: string | readonly string[] | EmptyValue) => setSelectedOptions(control.options, value)

    if (isStore($value)) {
      const value = $value.get()
      const isMultiple = isArray(value)
      const get = () => getSelectedOptions(control.options, isMultiple)
      const eventListener = () => {
        $value.set(get())
      }

      if (isMultiple) {
        control.multiple = true
      }

      return () => {
        set(value)
        control.addEventListener(onChangeEvent, eventListener)

        let destroy: Destroy | null = $value.listen(set)

        return () => {
          control.removeEventListener(onChangeEvent, eventListener)
          destroy!()
          destroy = null
        }
      }
    }

    if (isArray($value)) {
      control.multiple = true
    }

    return () => set($value)
  }
}

/**
 * Effect attribute to set and read checked value of checkbox or radio button element
 */
export const checked$ = /* @__PURE__ */ createEffectAttribute<'checked', CheckboxElement, Checked>(
  (control, $checked, attributes) => setControlAttribute(control, attributes, onChangeEvent, checkedAttribute, $checked)
)

/**
 * Effect attribute to set and read text value of input element
 */
export const value$ = /* @__PURE__ */ createEffectAttribute<'value', TextboxElement, Value>(setValue)

/**
 * Effect attribute to set and read selected value of combobox element
 */
export const selected$ = /* @__PURE__ */ createEffectAttribute<'selected', ComboboxElement, Selected>(setSelected)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    [checked$]: Checked
    [value$]: Value
    [selected$]: Selected
  }

  interface EffectAttributeTargets {
    [checked$]: CheckboxElement
    [value$]: TextboxElement
    [selected$]: ComboboxElement
  }
}
