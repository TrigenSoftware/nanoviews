import type {
  StoryContext as StoryContextBase,
  WebRenderer
} from 'storybook/internal/types'
import type {
  AnyWritableSignal,
  WritableSignal,
  AnyFn
} from 'nanoviews/store'
import type {
  Child,
  NonEmptyValue,
  EmptyValue
} from 'nanoviews'

export type { RenderContext } from 'storybook/internal/types'

export type AnyProps = Record<string, any>

export type OrAnyProps<T> = T extends AnyProps ? T : AnyProps

export type UniversalProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : T[K] extends AnyWritableSignal
      ? T[K]
      : NonEmptyValue<T[K]> extends AnyFn
        ? T[K]
        : Exclude<T[K], AnyWritableSignal> extends infer Primitive
          ? Primitive | WritableSignal<Primitive> | Extract<T[K], AnyWritableSignal>
          : never
}

export type SignalProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : T[K] extends AnyWritableSignal
      ? T[K]
      : NonEmptyValue<T[K]> extends AnyFn
        ? T[K]
        : Exclude<T[K], AnyWritableSignal> extends infer Primitive
          ? WritableSignal<Primitive> | Extract<T[K], AnyWritableSignal>
          : never
}

export type RawProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : T[K] extends infer V
      ? V extends WritableSignal<infer U>
        ? U
        : V
      : never
}

export type ComponentType<Props extends AnyProps = AnyProps> = (props: Props) => Child

/**
 * A story's own render: like any Nanoviews component, it gets signals and returns a view.
 */
export type Render<TArgs extends AnyProps> = (
  props: SignalProps<TArgs>,
  context: StoryContextBase<NanoviewsRenderer<TArgs>, SignalProps<TArgs>>
) => Child

export type WithRender<TAnnotations, TArgs extends AnyProps> = Omit<TAnnotations, 'render'> & {
  render?: Render<TArgs>
}

/**
 * What the renderer hands to `renderToCanvas` and to a portable story: the view creator
 * and the signal props to create it with.
 */
export type NanoviewsStoryResult<Props extends AnyProps = AnyProps> = readonly [
  ComponentType<SignalProps<Props>>,
  SignalProps<Props>
]

export interface NanoviewsRenderer<Props extends AnyProps | null = null> extends WebRenderer {
  component: ComponentType<Props extends null
    ? this['T'] extends AnyProps ? SignalProps<this['T']> : any
    : SignalProps<OrAnyProps<Props>>>
  storyResult: Child
}

/**
 * The renderer as seen after `applyDecorators`, which defers the whole decorated
 * story into the `[view, props]` tuple.
 */
export interface NanoviewsMountRenderer<Props extends AnyProps | null = null> extends WebRenderer {
  component: ComponentType<Props extends null
    ? this['T'] extends AnyProps ? SignalProps<this['T']> : any
    : SignalProps<OrAnyProps<Props>>>
  storyResult: NanoviewsStoryResult<OrAnyProps<Props extends null ? this['T'] : Props>>
}

export type StoryContext = StoryContextBase<NanoviewsRenderer>
