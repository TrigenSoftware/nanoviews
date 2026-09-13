import type {
  SVGAttributes,
  PickEffectAttributesByTarget,
  LazyVoidElement,
  LazyElement
} from '../internals/types/index.js'

export type IntrinsicElements = SVGElementTagNameMap

export type ElementName = keyof IntrinsicElements

export type PickElementType<Tag extends ElementName> = IntrinsicElements[Tag]

export type Attributes<Tag extends ElementName> =
  & PickEffectAttributesByTarget<PickElementType<Tag>>
  & SVGAttributes<PickElementType<Tag>>

export type VoidElementFactory<Tag extends ElementName> = (attributes?: Attributes<Tag>) => LazyVoidElement<PickElementType<Tag>>

export type ElementFactory<Tag extends ElementName> = (attributes?: Attributes<Tag>) => LazyElement<PickElementType<Tag>>
