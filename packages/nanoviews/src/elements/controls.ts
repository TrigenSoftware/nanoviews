import {
  type Injectable,
  type Signalish,
  type WritableSignal,
  type EmptyValue,
  InjectionContext,
  getContext,
  unsafeRun,
  isAccessor,
  isWritable,
  deferEffect,
  $get
} from 'kida'
import {
  type Attributes,
  type AttributeRecord,
  type Children,
  lazyChild,
  createNode,
  createElement,
  appendChildren,
  setAttribute,
  setAttributes
} from '../internals/index.js'

// https://caniuse.com/?search=oninput onInput doesn't fire an input event when (un)checking a checkbox or radio button, or when changing the selected file(s) of an <input type="file">

/**
 * The third state of a checkbox, for `checked`
 */
export const Indeterminate = Symbol.for('Indeterminate')

type TextboxElement = HTMLInputElement | HTMLTextAreaElement

type Value = string | number | EmptyValue

type Checked = boolean | typeof Indeterminate | EmptyValue

type Selected = Signalish<string | readonly string[] | EmptyValue>

/**
 * Bind a property of a control: a plain value is set once, an accessor drives
 * the property, and a writable signal also takes the user's input
 * @param control - The control
 * @param $value - The value
 * @param set - Property setter
 * @param get - Property getter
 * @param eventName - The event the user's input comes with
 */
function bind<E extends Element, V>(
  control: E,
  $value: Signalish<V>,
  set: (control: E, value: V) => void,
  get: (control: E) => V,
  eventName: string
) {
  if (isAccessor($value)) {
    deferEffect(() => {
      set(control, $value())
    }, true)

    // A read-only accessor, a computed say, only drives the control: the
    // user's input has nowhere to go, so it gets no listener.
    // The registration dies with the element, so the binding needs no
    // teardown - and no effect node to carry one. It reads the DOM and writes
    // a signal, and a write subscribes nobody, so it needs no tracking barrier
    // either
    if (isWritable<WritableSignal<V>>($value)) {
      control.addEventListener(eventName, () => $value(get(control)))
    }
  } else {
    set(control, $value)
  }
}

function setValue(control: TextboxElement, value: Value) {
  // The default follows the value, the React way, so a form reset keeps the
  // control at it
  control.value = control.defaultValue = (value ?? '') as string
}

function getValue(control: TextboxElement | HTMLOptionElement) {
  return control.value
}

function setChecked(control: HTMLInputElement, value: Checked) {
  if (value === Indeterminate) {
    control.indeterminate = true
  } else {
    control.indeterminate = false
    control.checked = control.defaultChecked = value as boolean
  }
}

function getChecked(control: HTMLInputElement): Checked {
  return control.indeterminate ? Indeterminate : control.checked
}

function setControlAttribute(
  control: TextboxElement,
  name: string,
  $value: unknown,
  attributes: AttributeRecord
) {
  if (name === 'value') {
    if (attributes.type === 'file') {
      // The files come from the user only, so the signal just takes them
      control.addEventListener('change', () => ($value as WritableSignal<File[]>)(Array.from((control as HTMLInputElement).files!)))
    } else {
      bind(control, $value as Signalish<Value>, setValue, getValue, 'input')
    }
  } else if (name === 'checked') {
    bind(control as HTMLInputElement, $value as Signalish<Checked>, setChecked, getChecked, 'change')
  } else {
    setAttribute(control, name, $value)
  }
}

/**
 * Describe an `input`. `value` and `checked` are the live state of the
 * control, bound through the DOM properties: a plain value is set once, an
 * accessor is followed, and a writable signal also receives the user's input.
 * The default follows the value, so a form reset keeps the control at it.
 * The `value` of a file input is a signal that receives the picked files
 * @param attributes - Element attributes
 * @returns Void element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function input(attributes?: Attributes<'input'>) {
  return lazyChild(() => createNode('input', attributes, setControlAttribute))
}

function buildTextarea(
  tag: 'textarea',
  attributes: Attributes<'textarea'> | undefined,
  children: Children | undefined
) {
  // The children are the default text of the control, and `value` replaces
  // it, so they go in first
  const textarea = appendChildren(document.createElement(tag), children)

  if (attributes !== undefined) {
    setAttributes(textarea, attributes, setControlAttribute)
  }

  return textarea
}

/**
 * Describe a `textarea`. `value` is the live text of the control, bound
 * through the DOM property: a plain value is set once, an accessor is
 * followed, and a writable signal also receives what the user types. It is
 * the default text too, in place of the children, so a form reset keeps it
 * @param attributes - Element attributes
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function textarea(attributes?: Attributes<'textarea'>) {
  return createElement('textarea', attributes, buildTextarea)
}

// The value a select holds reaches its options through the injection context
// the select builds them under: every option binds its own selectedness, so
// the ones built later, by a `for_` say, follow the value too. The key is
// never called: an option looks it up in find mode, and finds nothing outside
// a select
const SelectValue$: Injectable<Selected> = () => undefined

function setSelectAttribute(
  select: HTMLSelectElement,
  name: string,
  $value: unknown
) {
  if (name === 'value') {
    const $selected = $value as Selected

    // The options follow the value, the select itself only reports the choice
    if (isAccessor($selected) && isWritable<WritableSignal<string | readonly string[]>>($selected)) {
      select.addEventListener('change', () => $selected(
        select.multiple
          ? Array.from(select.selectedOptions, getValue)
          : select.value
      ))
    }
  } else {
    setAttribute(select, name, $value)
  }
}

function buildSelect(
  tag: 'select',
  attributes: Attributes<'select'> | undefined,
  children: Children | undefined
) {
  const select = createNode(tag, attributes, setSelectAttribute)
  const $value = attributes?.value

  return $value === undefined
    ? appendChildren(select, children)
    : unsafeRun(
      new InjectionContext([[SelectValue$, $value]], getContext()),
      appendChildren,
      select,
      children
    ) as HTMLSelectElement
}

/**
 * Describe a `select`. `value` is the value of the selected option, or the
 * list of them under `multiple`: a plain value is set once, an accessor is
 * followed, and a writable signal also receives the user's choice. The
 * options follow the value, the ones built later included, and so does
 * their default, so a form reset keeps the choice
 * @param attributes - Element attributes
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function select(attributes?: Attributes<'select'>) {
  return createElement('select', attributes, buildSelect)
}

function isSelected($selected: Selected, value: string) {
  const values = $get($selected)

  return Array.isArray(values)
    ? values.includes(value)
    : values === value
}

function buildOption(
  tag: 'option',
  attributes: Attributes<'option'> | undefined,
  children: Children | undefined
) {
  const option = appendChildren(createNode(tag, attributes), children)
  // The value of the select the option is built under, if any
  const $selected = getContext()?.get(SelectValue$, true)

  if ($selected !== undefined) {
    const $value = attributes?.value
    // The option's own value is read through its accessor, to follow it. An
    // option without a `value` attribute is worth its text, which is why the
    // DOM is asked once the children are in. The default follows the
    // selection, the React way, so a form reset keeps it
    const update = () => {
      option.selected = option.defaultSelected = isSelected($selected, String($get($value) ?? option.value))
    }

    if (isAccessor($selected) || isAccessor($value)) {
      deferEffect(update, true)
    } else {
      update()
    }
  }

  return option
}

/**
 * Describe an `option`. Under a `select` with a `value`, the option is
 * selected when its value is the one the select holds, and it follows both
 * @param attributes - Element attributes
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function option(attributes?: Attributes<'option'>) {
  return createElement('option', attributes, buildOption)
}
