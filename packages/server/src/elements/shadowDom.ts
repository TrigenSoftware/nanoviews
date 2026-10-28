import type {
  Child,
  Children,
  LazyElement
} from 'nanoviews'
import {
  state,
  renderChild,
  renderChildren,
  contentStart
} from '../internals/render.js'

/**
 * Describe an element with a shadow root: the children go into the root. In
 * markup the root is a declarative one, a `template` that comes first in the
 * host and holds the children
 * @param factory - Element description or factory
 * @param options - Shadow root options
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function shadow<T extends Element>(
  factory: () => T,
  options: ShadowRootInit
) {
  let children: Children | undefined
  const description = (...args: Children) => {
    if (args.length) {
      children = args

      return description
    }

    // The host is written aside, and the root goes first in its content
    const { html } = state

    state.html = ''
    renderChild(factory as unknown as Child)

    const host = state.html
    const start = contentStart(host)

    state.html = `${html}${host.slice(0, start)}<template shadowrootmode="${options.mode}"${
      options.delegatesFocus ? ' shadowrootdelegatesfocus' : ''
    }${
      options.serializable ? ' shadowrootserializable' : ''
    }${
      options.clonable ? ' shadowrootclonable' : ''
    }>`
    renderChildren(children)
    state.html += `</template>${host.slice(start)}`
  }

  return description as unknown as LazyElement<T>
}
