import type {
  ElementName,
  PickElementType
} from './dom/elements.js'
import type { Attributes } from './attributes.js'
import type { Children } from './children.js'

export type VoidElementFactory<Tag extends ElementName> = (attributes?: Attributes<Tag>) => PickElementType<Tag>

export type LazyElement<Tag extends ElementName> = (...children: Children) => PickElementType<Tag>

export type ElementFactory<Tag extends ElementName> = (attributes?: Attributes<Tag>) => LazyElement<Tag>
