import type {
  DecoratorFunction,
  LegacyStoryFn,
  RenderContext
} from 'storybook/internal/types'
import type { Child } from 'nanoviews'
import type {
  AnyProps,
  SignalProps,
  StoryContext,
  NanoviewsRenderer,
  NanoviewsMountRenderer
} from './types.js'

export function applyDecorators(
  storyFn: LegacyStoryFn<NanoviewsRenderer>,
  decorators: DecoratorFunction<NanoviewsRenderer>[]
): LegacyStoryFn<NanoviewsMountRenderer>

export function render(props: SignalProps<AnyProps>, context: StoryContext): Child

export function renderToCanvas(
  { storyFn, showMain, forceRemount }: RenderContext<NanoviewsMountRenderer>,
  canvasElement: NanoviewsMountRenderer['canvasElement']
): () => void
