import type {
  ProjectAnnotations,
  StoryAnnotations,
  ComponentAnnotations,
  ComposedStoryFn
} from 'storybook/internal/types'
import type {
  AnyProps,
  NanoviewsRenderer,
  NanoviewsMountRenderer,
  Render,
  UniversalProps,
  WithRender
} from './types.js'

export function setProjectAnnotations(
  projectAnnotations: ProjectAnnotations<NanoviewsRenderer> | ProjectAnnotations<NanoviewsRenderer>[]
): void

export function composeStory<TArgs extends AnyProps = AnyProps>(
  story: WithRender<StoryAnnotations<NanoviewsRenderer<TArgs>, TArgs, any>, TArgs>,
  componentAnnotations: WithRender<ComponentAnnotations<NanoviewsRenderer<TArgs>, TArgs>, TArgs>,
  projectAnnotations?: ProjectAnnotations<NanoviewsRenderer>,
  exportsName?: string
): ComposedStoryFn<NanoviewsMountRenderer<TArgs>, Partial<UniversalProps<TArgs>>>

type StoriesWithPartialProps<TModule> = {
  [K in keyof TModule as K extends 'default' ? never : TModule[K] extends { render?: Render<infer _> } ? K : never]: TModule[K] extends { render?: Render<infer TProps> }
    ? ComposedStoryFn<NanoviewsMountRenderer<TProps>, Partial<UniversalProps<TProps>>>
    : never
}

export function composeStories<Module extends {
  default: Omit<ComponentAnnotations<NanoviewsRenderer<any>, any>, 'decorators'>
}>(
  csfExports: Module,
  projectAnnotations?: ProjectAnnotations<NanoviewsRenderer>
): StoriesWithPartialProps<Module>
