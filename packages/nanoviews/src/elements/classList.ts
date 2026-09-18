import {
  type ClassList,
  type ClassValue,
  cx
} from '../internals/index.js'

/**
 * Build a `class` from parts.
 *
 * Every truthy string part is joined with a space, everything else is
 * dropped. A part may be an accessor or a nested list, so the class follows
 * the parts, and a component can fold the `class` it received into its own.
 * The `class` attribute joins a list the same way, so this is for a class
 * built away from an element. With no accessor among the parts, the nested
 * lists included, the class never changes and comes back as a plain string.
 * @param parts - Class names, accessors and lists of them, falsy values to skip
 * @returns The joined class names, or an accessor of them when a part is an accessor
 * @example
 * ```ts
 * const $class = classList('button', () => $primary() && 'button_primary')
 *
 * $class() // 'button button_primary'
 * ```
 */
/* @__NO_SIDE_EFFECTS__ */
export function classList<V extends ClassValue[]>(...parts: V) {
  return cx(parts) as ClassList<V>
}
