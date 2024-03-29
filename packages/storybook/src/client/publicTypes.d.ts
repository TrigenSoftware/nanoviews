import type {
  AnnotatedStoryFn,
  Args,
  ArgsFromMeta,
  ArgsStoryFn,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
  ProjectAnnotations
} from '@storybook/types'
import type { SetOptional, Simplify } from 'type-fest'
import type { NanoviewsRenderer, ComponentType, RawProps } from './types'

export type { Args, ArgTypes, Parameters, StrictArgs } from '@storybook/types'

/**
 * Metadata to configure the stories for a component.
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<CmpOrArgs = Args> = CmpOrArgs extends ComponentType<infer Props>
  ? ComponentAnnotations<NanoviewsRenderer, RawProps<Props>>
  : ComponentAnnotations<NanoviewsRenderer, CmpOrArgs>

/**
 * Story function that represents a CSFv2 component example.
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<CmpOrArgs = Args> = CmpOrArgs extends ComponentType<infer Props>
  ? AnnotatedStoryFn<NanoviewsRenderer, RawProps<Props>>
  : AnnotatedStoryFn<NanoviewsRenderer, CmpOrArgs>

/**
 * Story object that represents a CSFv3 component example.
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<MetaOrCmpOrArgs = Args> = MetaOrCmpOrArgs extends {
  render?: ArgsStoryFn<NanoviewsRenderer, any>
  component?: ComponentType<infer Props>
  args?: infer DefaultArgs
}
  ? Simplify<RawProps<Props> & ArgsFromMeta<NanoviewsRenderer, MetaOrCmpOrArgs>> extends infer TArgs
    ? StoryAnnotations<NanoviewsRenderer, TArgs, SetOptional<TArgs, Extract<keyof TArgs, keyof DefaultArgs>>>
    : never
  : MetaOrCmpOrArgs extends ComponentType<infer Props>
    ? StoryAnnotations<NanoviewsRenderer, RawProps<Props>>
    : StoryAnnotations<NanoviewsRenderer, MetaOrCmpOrArgs>

export type { NanoviewsRenderer }

export type Decorator<Args = StrictArgs> = DecoratorFunction<NanoviewsRenderer, Args>
export type Loader<Args = StrictArgs> = LoaderFunction<NanoviewsRenderer, Args>
export type StoryContext<Args = StrictArgs> = GenericStoryContext<NanoviewsRenderer, Args>
export type Preview = ProjectAnnotations<NanoviewsRenderer>
