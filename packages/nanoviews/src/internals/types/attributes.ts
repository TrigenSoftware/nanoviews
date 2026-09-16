import type { Signalish } from 'kida'
import type { Primitive } from './common.js'
import type {
  ElementName,
  IntrinsicElementsAttributes
} from './dom/elements.js'

export type PrimitiveAttributeValue = Signalish<Primitive>

export type Attributes<Tag extends ElementName> = IntrinsicElementsAttributes[Tag]
