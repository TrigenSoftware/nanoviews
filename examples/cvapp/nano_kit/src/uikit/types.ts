import type {
  Attributes,
  ElementName,
  ElementFactory
} from 'nanoviews'

/**
 * Props for a component that can render as a different HTML element, given by its factory.
 */
export type AsElementProps<T extends ElementName> = {
  as?: ElementFactory<T>
} & Attributes<T>
