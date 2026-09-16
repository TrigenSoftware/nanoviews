import type {
  Signalish,
  WritableSignal
} from 'kida'
import type { EmptyValue } from '../common.js'

/**
 * Used to represent DOM API's where users can either pass
 * true or false as a boolean or as its equivalent strings.
 */
export type Booleanish = boolean | 'true' | 'false'

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin MDN}
 */
export type CrossOrigin = 'anonymous' | 'use-credentials' | '' | EmptyValue

/**
 * A `class` value: a string, an accessor, or a list of parts. A list joins its
 * truthy strings with spaces, drops the rest, and joins a nested list in place.
 */
export type ClassValue = Signalish<string | boolean | 0 | EmptyValue | readonly ClassValue[]>

/**
 * A `ref` value: a signal that holds the element from its build to its
 * unmount, then `null`. A signal is invariant, so it may be declared with the
 * element's own type, the type of its tree, or `Element`.
 */
export type ElementRef<T, Tree> =
  | WritableSignal<T | null>
  | WritableSignal<Tree | null>
  | WritableSignal<Element | null>
