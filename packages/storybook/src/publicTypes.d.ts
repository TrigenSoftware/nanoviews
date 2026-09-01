import type {
  Args,
  ArgsFromMeta,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  StoryAnnotations,
  StoryContext as GenericStoryContext,
  StrictArgs,
  ProjectAnnotations
} from 'storybook/internal/types'
import type {
  SetOptional,
  Simplify
} from 'type-fest'
import type {
  AnyProps,
  NanoviewsRenderer,
  ComponentType,
  OrAnyProps,
  RawProps,
  Render,
  WithRender
} from './types.js'

export type {
  Args,
  ArgTypes,
  Parameters,
  StrictArgs
} from 'storybook/internal/types'

/**
 * Metadata to configure the stories for a component.
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<CmpOrArgs = Args> = CmpOrArgs extends ComponentType<infer Props>
  ? WithRender<ComponentAnnotations<NanoviewsRenderer<RawProps<Props>>, RawProps<Props>>, RawProps<Props>>
  : WithRender<
    ComponentAnnotations<NanoviewsRenderer<OrAnyProps<CmpOrArgs>>, RawProps<OrAnyProps<CmpOrArgs>>>,
    RawProps<OrAnyProps<CmpOrArgs>>
  >

/**
 * Story function that represents a CSFv2 component example.
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<CmpOrArgs = Args> = CmpOrArgs extends ComponentType<infer Props>
  ? Render<RawProps<Props>> & WithRender<StoryAnnotations<NanoviewsRenderer<RawProps<Props>>, RawProps<Props>>, RawProps<Props>>
  : Render<RawProps<OrAnyProps<CmpOrArgs>>> & WithRender<
    StoryAnnotations<NanoviewsRenderer<OrAnyProps<CmpOrArgs>>, RawProps<OrAnyProps<CmpOrArgs>>>,
    RawProps<OrAnyProps<CmpOrArgs>>
  >

/**
 * Story object that represents a CSFv3 component example.
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<MetaOrCmpOrArgs = Args> = MetaOrCmpOrArgs extends {
  render?: Function
  component?: ComponentType<infer Props>
  args?: infer DefaultArgs
}
  ? Simplify<RawProps<Props> & ArgsFromMeta<NanoviewsRenderer, Omit<MetaOrCmpOrArgs, 'render'>>> extends infer TArgs
    ? TArgs extends AnyProps
      ? WithRender<
        StoryAnnotations<NanoviewsRenderer<TArgs>, TArgs, SetOptional<TArgs, Extract<keyof TArgs, keyof DefaultArgs>>>,
        TArgs
      >
      : never
    : never
  : MetaOrCmpOrArgs extends ComponentType<infer Props>
    ? WithRender<StoryAnnotations<NanoviewsRenderer<RawProps<Props>>, RawProps<Props>>, RawProps<Props>>
    : WithRender<
      StoryAnnotations<NanoviewsRenderer<OrAnyProps<MetaOrCmpOrArgs>>, RawProps<OrAnyProps<MetaOrCmpOrArgs>>>,
      RawProps<OrAnyProps<MetaOrCmpOrArgs>>
    >

export type {
  NanoviewsRenderer,
  NanoviewsMountRenderer,
  NanoviewsStoryResult,
  ComponentType,
  RawProps,
  SignalProps,
  UniversalProps
} from './types.js'

/**
 * A decorator wraps the rendered view. Like a story's own `render`, it is called with SIGNALS:
 * parameterize it with the signal-props shape, not with the plain args shape —
 * `Decorator<{ label: WritableSignal<string> }>`, not `Decorator<{ label: string }>`.
 */
export type Decorator<Args = StrictArgs> = DecoratorFunction<NanoviewsRenderer, Args>
export type Loader<Args = StrictArgs> = LoaderFunction<NanoviewsRenderer, Args>
export type StoryContext<Args = StrictArgs> = GenericStoryContext<NanoviewsRenderer, Args>
export type Preview = ProjectAnnotations<NanoviewsRenderer>
