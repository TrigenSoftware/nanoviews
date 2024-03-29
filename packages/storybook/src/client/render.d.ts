import type {
  Args,
  RenderContext
} from '@storybook/types'
import type {
  StoryContext,
  NanoviewsRenderer,
  NanoviewsStoryResult
} from './types'

export function render(args: Args, context: StoryContext): NanoviewsStoryResult

export function renderToCanvas(
  { storyFn, showMain, forceRemount }: RenderContext<NanoviewsRenderer>,
  canvasElement: NanoviewsRenderer['canvasElement']
): () => void
