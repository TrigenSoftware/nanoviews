import type {
  StoryContext as StoryContextBase,
  WebRenderer
} from '@storybook/types'
import type { WritableAtom } from 'nanostores'

interface Block {
  c(): void
  m(target: Node, anchor?: Node | null): Node | null
  e(): void
  d(): void
}

export type AnyFn = (...args: any) => any

export type AnyProps = Record<string, any>

type OrAnyProps<T> = T extends AnyProps ? T : AnyProps

type EmptyValue = undefined | null | void

type NonEmptyValue<T> = T extends EmptyValue ? never : T

export type UniversalProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : NonEmptyValue<T[K]> extends AnyFn
      ? T[K]
      : T[K] extends WritableAtom
        ? T[K]
        : Exclude<T[K], WritableAtom> extends infer Primitive
          ? Primitive | WritableAtom<Primitive>
          : never
}

export type AtomProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : NonEmptyValue<T[K]> extends AnyFn
      ? T[K]
      : T[K] extends WritableAtom
        ? T[K]
        : Exclude<T[K], WritableAtom> extends infer Primitive
          ? WritableAtom<Primitive>
          : never
}

export type RawProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : NonEmptyValue<T[K]> extends AnyFn
      ? T[K]
      : Extract<T[K], WritableAtom> extends WritableAtom<infer U>
        ? U
        : T[K]
}

export type ComponentType<Props extends AnyProps = AnyProps> = (props: Props) => Block

export type NanoviewsStoryResult<Props extends AnyProps = AnyProps> = readonly [ComponentType<AtomProps<Props>>, Props]

export interface NanoviewsRenderer extends WebRenderer {
  component: ComponentType<AtomProps<OrAnyProps<this['T']>>>
  storyResult: NanoviewsStoryResult<OrAnyProps<this['T']>>
}

export type StoryContext = StoryContextBase<NanoviewsRenderer>
