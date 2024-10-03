import type {
  AnyProps,
  ComponentType,
  NanoviewsStoryResult,
  StoreProps,
  RawProps
} from './types'

export function nanoStory<T extends AnyProps = AnyProps>(story: ComponentType<StoreProps<T>>): (args: RawProps<T>) => NanoviewsStoryResult<T>
