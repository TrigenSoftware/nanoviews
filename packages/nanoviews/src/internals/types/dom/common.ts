import type {
  Accessor,
  Signalish
} from 'kida'
import type {
  AnyFn,
  EmptyValue
} from '../common.js'

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
 * A part of a `class` list: a string, a nested list, or an accessor of either.
 * A list joins its truthy strings with spaces, drops the rest, and joins a
 * nested list in place.
 */
export type ClassPart = Signalish<string | boolean | 0 | EmptyValue | readonly ClassPart[]>

/**
 * A `class` value: a string, an accessor of one, or a list of parts. Only a
 * list joins an accessor of a list and drops `true` and `0`: on their own they
 * would be written as text.
 */
export type ClassValue = Signalish<string | false | EmptyValue> | readonly ClassPart[]

/**
 * What `classList` returns for the given parts: an accessor when one of them is an accessor for
 * sure, a string when none can be one or hold one, and either otherwise.
 */
export type ClassList<V extends readonly unknown[]> = true extends { [K in keyof V]: [V[K]] extends [AnyFn] ? true : false }[number]
  ? Accessor<string>
  : Extract<V[number], AnyFn | readonly unknown[]> extends never
    ? string
    : Signalish<string>

/**
 * A `ref` value: a callback or a writable signal that receives the element
 * once it is built, and `null` once it is unmounted. Both are checked against
 * the element; one of a wider type, that of its tree or `Element`, fits too.
 * The two members share the parameter, so an untyped arrow is still typed.
 * The first is the callback: anything it returns is fine, and it has no
 * `node`, which keeps a signal off it. The second is what a writable signal
 * fits with its setter; its getter returns the element, and `void | null`
 * turns it down, so a signal of another element has no way in.
 */
export type ElementRef<T> =
  | (((ref: T | null) => void) & { node?: never })
  | ((ref: T | null) => void | null)
