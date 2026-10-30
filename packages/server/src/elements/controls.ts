import {
  type Attributes,
  type Children,
  type LazyElement,
  type LazyVoidElement,
  type Primitive,
  Indeterminate
} from 'nanoviews'
import { isEmptyAttribute } from 'nanoviews/internals'
import {
  type Accessor,
  $get,
  isAccessor,
  isEmpty
} from 'kida'
import {
  state,
  renderChildren,
  escapeText,
  escapeAttribute
} from '../internals/render.js'
import { stringifyAttributes } from '../internals/attributes.js'
import { writeElement } from '../internals/element.js'

// The names a control writes itself, as its state
const inputState = new Set(['value', 'defaultValue', 'checked', 'defaultChecked'])
const selectState = new Set(['value', 'defaultValue'])
const optionState = new Set(['selected'])

// What a control shows before any script runs: the live state, else the
// default. The markup has one attribute for both, so only that one is
// written. An accessor is the live state even when empty, as on the client,
// which writes `''` then
function getShownValue($live: unknown, $default: unknown): Primitive | typeof Indeterminate {
  const live = isAccessor<Accessor<unknown>>($live) ? $live() ?? '' : $live

  return (isEmpty(live) ? $get($default) : live) as Primitive | typeof Indeterminate
}

// A control is its writer bound to its attributes, as a void element is,
// and the bare writer without them
function writeInput(this: Attributes<'input'>) {
  const value = getShownValue(this.value, this.defaultValue)
  const checked = getShownValue(this.checked, this.defaultChecked)

  // The third state has no markup: the check under it shows
  state.html += `<input${stringifyAttributes(this, inputState)}${
    !isEmpty(value) && value !== '' ? ` value="${escapeAttribute(String(value))}"` : ''
  }${
    (checked === Indeterminate ? $get(this.defaultChecked) : checked) ? ' checked' : ''
  }>`
}

function writeBareInput() {
  state.html += '<input>'
}

/* @__NO_SIDE_EFFECTS__ */
export function input(attributes?: Attributes<'input'>) {
  return (
    attributes === undefined ? writeBareInput : writeInput.bind(attributes)
  ) as unknown as LazyVoidElement<HTMLInputElement>
}

// The parser drops a newline right after the start tag, and reads a carriage
// return as a newline before that: the text is always given a newline to
// drop, which costs less than a look at how it starts, and keeps the line
// break it may start with
function writeTextarea(this: Attributes<'textarea'>) {
  const value = getShownValue(this.value, this.defaultValue)

  state.html += `<textarea${stringifyAttributes(this, inputState)}>\n${
    isEmpty(value) ? '' : escapeText(String(value))
  }</textarea>`
}

function writeBareTextarea() {
  state.html += '<textarea></textarea>'
}

/* @__NO_SIDE_EFFECTS__ */
export function textarea(attributes?: Attributes<'textarea'>) {
  return (
    attributes === undefined ? writeBareTextarea : writeTextarea.bind(attributes)
  ) as unknown as LazyVoidElement<HTMLTextAreaElement>
}

function writeSelect(
  attributes: Attributes<'select'> | undefined,
  children: Children | undefined
) {
  state.html += attributes === undefined ? '<select>' : `<select${stringifyAttributes(attributes, selectState)}>`
  // The options look at the value while they are written. Selects do not
  // nest, so there is no other value to put back after them. An empty live
  // value selects none, as on the client, and the browser shows the first
  state.select = getShownValue(attributes?.value, attributes?.defaultValue)

  renderChildren(children)

  state.select = undefined
  state.html += '</select>'
}

const optionEntities = /&(?:amp|lt);/g

function decodeOptionEntity(entity: string) {
  return entity === '&amp;' ? '&' : '<'
}

// The value of an option, as the DOM gives it: the `value` attribute, else
// the text with its white space collapsed and stripped. The text is the
// content without its tags, which end at the first `>`, since attribute
// values escape it
function optionValue($value: unknown, content: string) {
  const value = $get($value)

  return isEmptyAttribute('value', value)
    ? content
      .replace(/<[^>]*>/g, '')
      .replace(optionEntities, decodeOptionEntity)
      .replace(/[\t\n\f\r ]+/g, ' ')
      .replace(/^ | $/g, '')
    : String(value)
}

function writeOption(
  attributes: Attributes<'option'> | undefined,
  children: Children | undefined
) {
  const {
    select,
    html
  } = state

  if (isEmpty(select)) {
    writeElement('<option', '</option>', attributes, children)
    return
  }

  // Under a select with a value, the value picks the options, and their own
  // `selected` is left out. The content is written aside first: the text of
  // an option without a value is what the value is compared with
  state.html = ''
  renderChildren(children)

  const content = state.html
  const value = optionValue(attributes?.value, content)

  state.html = `${html}<option${attributes === undefined ? '' : stringifyAttributes(attributes, optionState)}${
    (Array.isArray(select) ? select.includes(value) : select === value) ? ' selected' : ''
  }>${content}</option>`
}

/* @__NO_SIDE_EFFECTS__ */
export function select(attributes?: Attributes<'select'>) {
  let children: Children | undefined
  const description = (...args: Children) => {
    if (args.length) {
      children = args

      return description
    }

    writeSelect(attributes, children)
  }

  return description as unknown as LazyElement<HTMLSelectElement>
}

/* @__NO_SIDE_EFFECTS__ */
export function option(attributes?: Attributes<'option'>) {
  let children: Children | undefined
  const description = (...args: Children) => {
    if (args.length) {
      children = args

      return description
    }

    writeOption(attributes, children)
  }

  return description as unknown as LazyElement<HTMLOptionElement>
}
