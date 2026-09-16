import {
  type Accessor,
  type WritableSignal,
  isAccessor,
  isFunction,
  deferEffect,
  untracked,
  $get
} from 'kida'
import type {
  ClassValue,
  Primitive,
  TargetEventHandler
} from '../types/index.js'
import { isEmpty } from '../utils.js'
import { cx } from './classList.js'
import { setStyle } from './style.js'

export type AttributeRecord = Record<string, unknown>

/**
 * Set one attribute of an element: the loop hands it every attribute that is
 * not an event handler
 */
export type AttributeSetter<E extends Element> = (
  element: E,
  name: string,
  value: unknown,
  attributes: AttributeRecord
) => void

// A boolean attribute is switched off by its absence, so `false` leaves it
// out, the way a React reader expects. The enumerated attributes and the
// `aria-*` and `data-*` families carry the literal string instead
function isEmptyAttribute(name: string, value: unknown) {
  return isEmpty(value) || value === false && !/^(?:aria-|data-|draggable$|contentEditable$|spellCheck$)/.test(name)
}

export function setAttribute(element: Element, name: string, $value: unknown) {
  // A few names are bindings rather than attributes. Each is told apart by
  // its name first: the compare is a pointer one for the keys of a literal,
  // and it fails for almost every attribute
  if (name === 'ref') {
    // The signal holds the element from its build to its unmount
    ($value as WritableSignal<Element | null>)(element)
    deferEffect(() => () => ($value as WritableSignal<Element | null>)(null))

    return
  }

  if (name === 'autoFocus') {
    // The `autofocus` attribute is honoured once per page load, so the
    // element is focused by hand instead, once it is in the document
    if ($get($value)) {
      deferEffect(() => {
        (element as HTMLElement).focus()
      })
    }

    return
  }

  if (name === 'style' && $value && typeof $value === 'object') {
    setStyle(element as HTMLElement, $value)

    return
  }

  // A class may come as a list of parts, joined by an accessor that follows
  // them
  if (name === 'class' && Array.isArray($value)) {
    $value = cx($value as readonly ClassValue[])
  }

  // A static attribute is the common case: apply it without building the
  // setter closures a reactive binding needs
  if (isAccessor<Accessor<Primitive>>($value)) {
    deferEffect(() => {
      const value = $value()

      if (isEmptyAttribute(name, value)) {
        element.removeAttribute(name)
      } else {
        element.setAttribute(name, value as string)
      }
    }, true)
  } else if (!isEmptyAttribute(name, $value)) {
    element.setAttribute(name, $value as string)
  }
}

export function isEventHandler(key: string, value: unknown): value is TargetEventHandler {
  return key.startsWith('on') && isFunction(value)
}

// Building the event name allocates a string the browser has to atomize on
// every `addEventListener`; keyed by the prop name, the same string object is
// handed over every time
const eventNames: Record<string, string> = {}

export function setEventListener(element: Element, name: string, value: TargetEventHandler) {
  // `onGotPointerCapture` and `onLostPointerCapture` end with `Capture`
  // themselves, and are ordinary bubbling events
  const capture = name.endsWith('Capture') && !name.endsWith('PointerCapture')

  element.addEventListener(
    eventNames[name] ??= name.slice(2, capture ? -7 : undefined).toLowerCase(),
    // A handler is user code: it must not subscribe whatever effect happens to
    // be running when the event is dispatched synchronously from inside one -
    // `autoFocus` calls `focus()` from an effect, and that is not exotic
    event => untracked(() => (value as EventListener).call(element, event)),
    capture
  )
}

/**
 * Set reactive attributes to element
 * @todo Maybe we can implement validation for dev build
 *       https://github.com/facebook/react/blob/2f8f7760223241665f472a2a9be16650473bce39/packages/react-dom-bindings/src/shared/ReactDOMUnknownPropertyHook.js
 *       https://github.com/facebook/react/blob/2f8f7760223241665f472a2a9be16650473bce39/packages/react-dom-bindings/src/client/ReactDOMComponent.js
 * @param element - Target element
 * @param attributes - Target attributes
 * @param set - Attribute setter, for an element that binds some of its attributes its own way
 */
export function setAttributes<E extends Element, A extends object>(
  element: E,
  attributes: A,
  set: AttributeSetter<E> = setAttribute
) {
  for (const key in attributes) {
    const value = (attributes as AttributeRecord)[key]

    if (isEventHandler(key, value)) {
      setEventListener(element, key, value)
    } else {
      set(element, key, value, attributes as AttributeRecord)
    }
  }
}
