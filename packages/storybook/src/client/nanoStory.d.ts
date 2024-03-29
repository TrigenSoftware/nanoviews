import type {
  AnyProps,
  ComponentType,
  NanoviewsStoryResult,
  AtomProps
} from './types'

export function nanoStory<T extends AnyProps = AnyProps>(story: ComponentType<AtomProps<T>>): (args: T) => NanoviewsStoryResult<T>
