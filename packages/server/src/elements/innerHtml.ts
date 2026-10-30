import type {
  Child,
  LazyChild
} from 'nanoviews'
import {
  type Signalish,
  $get
} from 'kida'
import {
  state,
  renderChild,
  contentStart
} from '../internals/render.js'

function writeInnerHtml(this: Child, $html: Signalish<string>) {
  // The element is written aside, and the HTML replaces whatever it holds,
  // as `innerHTML` does
  const { html } = state

  state.html = ''
  renderChild(this)

  const host = state.html
  const end = host.lastIndexOf('</')

  // A void element has no content to replace, and stays as it is
  state.html = html + (end < 0 ? host : host.slice(0, contentStart(host)) + $get($html) + host.slice(end))
}

/**
 * Dangerously set inner HTML to element
 * @param factory - Element description or factory
 * @param $html - HTML string or store with it
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function dangerouslySetInnerHtml<T extends Element>(
  factory: () => T,
  $html: Signalish<string>
) {
  return writeInnerHtml.bind(factory as unknown as Child, $html) as unknown as LazyChild<() => T>
}
