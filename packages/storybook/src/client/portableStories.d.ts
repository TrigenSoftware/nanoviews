import type {
  Args,
  ProjectAnnotations,
  StoryAnnotationsOrFn,
  Store_CSFExports,
  StoriesWithPartialProps,
  ComponentAnnotations,
  ComposedStoryFn
} from '@storybook/types'
import type {
  NanoviewsRenderer,
  UniversalProps
} from './types'

export function setProjectAnnotations(
  projectAnnotations: ProjectAnnotations<NanoviewsRenderer> | ProjectAnnotations<NanoviewsRenderer>[]
): void

export function composeStory<TArgs extends Args = Args>(
  story: StoryAnnotationsOrFn<NanoviewsRenderer, TArgs>,
  componentAnnotations: ComponentAnnotations<NanoviewsRenderer, TArgs>,
  projectAnnotations?: ProjectAnnotations<NanoviewsRenderer>,
  exportsName?: string
): ComposedStoryFn<NanoviewsRenderer, UniversalProps<Partial<TArgs>>>

type PortableStoriesProps<S extends Record<string, ComposedStoryFn>> = {
  [K in keyof S]: S[K] extends ComposedStoryFn<infer TRenderer, infer TProps>
    ? ComposedStoryFn<TRenderer, UniversalProps<TProps>>
    : never
}

export function composeStories<Module extends Store_CSFExports<NanoviewsRenderer, any>>(
  csfExports: Module,
  projectAnnotations?: ProjectAnnotations<NanoviewsRenderer>
): PortableStoriesProps<Omit<StoriesWithPartialProps<NanoviewsRenderer, Module>, keyof Store_CSFExports>>
