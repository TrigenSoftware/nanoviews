import type {
  Child,
  Children
} from 'nanoviews'
import { isEmptyChild } from 'nanoviews/internals'

const textChars = /[&<]/g
const attributeChars = /[&"<>]/g
const AMPERSAND = 38
const LESS_THAN = 60
const GREATER_THAN = 62

// The scan is one regex test, and a string with nothing to escape comes back
// as it is, with nothing allocated for it
function escape(value: string, chars: RegExp) {
  let escaped = ''
  let last = 0

  chars.lastIndex = 0

  while (chars.test(value)) {
    const index = chars.lastIndex - 1
    const char = value.charCodeAt(index)

    escaped += value.slice(last, index) + (
      char === AMPERSAND
        ? '&amp;'
        : char === LESS_THAN
          ? '&lt;'
          : char === GREATER_THAN
            ? '&gt;'
            : '&quot;'
    )
    last = index + 1
  }

  return last ? escaped + value.slice(last) : value
}

/**
 * Escape text content. The tokenizer reacts to `&` and `<` in text, and to
 * nothing else
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeText(text: string) {
  return escape(text, textChars)
}

/**
 * Escape a quoted attribute value. `>` needs no escape there, but with it
 * escaped the first `>` of an element always ends its start tag, which is
 * where `shadow` and `dangerouslySetInnerHtml` put their content
 * @param value - Value to escape
 * @returns Escaped value
 */
export function escapeAttribute(value: string) {
  return escape(value, attributeChars)
}

interface RenderState {
  /**
   * The markup written so far.
   */
  html: string
  /**
   * Whether text goes in as it is, in an element whose text is not markup.
   */
  raw: boolean
  /**
   * The value of the `select` whose options are being written.
   */
  select: unknown
}

/**
 * The render in progress. Descriptions are built the way `mount` builds them,
 * but a description writes its markup here instead of returning a node, so
 * it returns nothing and a component returns its view, and whatever else a
 * child gives is text. Only the render builds a description, in its place,
 * as `mount` does: a description built by hand writes where it is called.
 * Every render has a state of its own: a young object takes the stores of
 * new strings without the write barrier of an old one, and a render inside
 * a render leaves the outer one as it was.
 */
// oxlint-disable-next-line import/no-mutable-exports
export let state: RenderState = createState()

export function createState(): RenderState {
  return {
    html: '',
    raw: false,
    select: undefined
  }
}

/**
 * Enter the state of a render
 * @param next - The state to enter
 * @returns The state that was entered before
 */
export function enter(next: RenderState) {
  const prev = state

  state = next

  return prev
}

/**
 * Where the content of an element written aside starts: right after its
 * start tag, and after the newline the parser drops in a `pre` and a
 * `textarea`, so the content keeps a newline it starts with. Attribute
 * values escape `>`, so the first one ends the start tag
 * @param host - The markup of the element
 * @returns The index of its content
 */
export function contentStart(host: string) {
  const start = host.indexOf('>') + 1

  return /^<(?:pre|textarea)[\s>]/.test(host) ? start + 1 : start
}

/**
 * Write a child. Every function it gives is called: a description writes
 * itself, a component gives its view, and an accessor its value, which is
 * text like the other primitives. So the descriptions of the server carry no
 * mark of a lazy child, which the client needs to tell them from the
 * accessors it binds
 * @param child - Child to write
 */
export function renderChild(child: Child) {
  let value: unknown = child

  while (typeof value === 'function') {
    value = (value as () => unknown)()
  }

  if (!isEmptyChild(value)) {
    // What is left is a primitive: an object child is a DOM node, and there
    // are none on the server
    const primitive = value as string | number
    const text = String(primitive)

    state.html += state.raw ? text : escapeText(text)
  }
}

export function renderChildren(children: Children | undefined) {
  if (children !== undefined) {
    for (let i = 0, len = children.length; i < len; i++) {
      renderChild(children[i])
    }
  }
}
