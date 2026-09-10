import type {
  SVGAttributes,
  PickEffectAttributesByTarget,
  LazyChild,
  Children
} from '../internals/types/index.js'

export type IntrinsicElements = SVGElementTagNameMap

export type ElementName = keyof IntrinsicElements

export type PickElementType<Tag extends ElementName> = IntrinsicElements[Tag]

export type Attributes<Tag extends ElementName> =
  & PickEffectAttributesByTarget<PickElementType<Tag>>
  & SVGAttributes<PickElementType<Tag>>

export type VoidElementFactory<Tag extends ElementName> = (attributes?: Attributes<Tag>) => PickElementType<Tag>

export type LazyElement<Tag extends ElementName> = LazyChild<(...children: Children) => PickElementType<Tag>>

export type ElementFactory<Tag extends ElementName> = (attributes?: Attributes<Tag>) => LazyElement<Tag>
