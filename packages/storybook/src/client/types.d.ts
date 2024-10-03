import type {
  StoryContext as StoryContextBase,
  WebRenderer
} from '@storybook/types'
import type {
  AnyStore,
  Store,
  AnyFn
} from '@nanoviews/stores'

interface Block {
  c(): void
  m(target: Node, anchor?: Node | null): Node | null
  e(): void
  d(): void
  n(): Node | null
}

export type AnyProps = Record<string, any>

type OrAnyProps<T> = T extends AnyProps ? T : AnyProps

type EmptyValue = undefined | null | void

type NonEmptyValue<T> = T extends EmptyValue ? never : T

export type UniversalProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : NonEmptyValue<T[K]> extends AnyFn
      ? T[K]
      : T[K] extends AnyStore
        ? T[K]
        : Exclude<T[K], AnyStore> extends infer Primitive
          ? Primitive | Store<Primitive> | Extract<T[K], AnyStore>
          : never
}

export type StoreProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : NonEmptyValue<T[K]> extends AnyFn
      ? T[K]
      : T[K] extends AnyStore
        ? T[K]
        : Exclude<T[K], AnyStore> extends infer Primitive
          ? Store<Primitive> | Extract<T[K], AnyStore>
          : never
}

export type RawProps<T extends AnyProps> = {
  [K in keyof T]: T[K] extends EmptyValue
    ? T[K]
    : NonEmptyValue<T[K]> extends AnyFn
      ? T[K]
      : T[K] extends infer V
        ? V extends Store<infer U>
          ? U
          : V
        : never
}

export type ArgStores<T extends AnyProps> = {
  [K in keyof T as (Extract<T[K], AnyStore> extends infer S
    ? S extends AnyStore
      ? AnyStore extends S
        ? never
        : K
      : never
    : never)
  ]: T[K] extends Store<infer U>
    ? {
      $store(value: U): T[K]
    }
    : never
}

export type ArgStoresAnnotation<T extends AnyProps> = ArgStores<T> extends infer A
  ? {} extends A
    ? {}
    : {
      argTypes: A
    }
  : never

export type ComponentType<Props extends AnyProps = AnyProps> = (props: Props) => Block

export type NanoviewsStoryResult<Props extends AnyProps = AnyProps> = readonly [ComponentType<StoreProps<Props>>, RawProps<Props>]

export interface NanoviewsRenderer<Props extends AnyProps = null> extends WebRenderer {
  component: ComponentType<OrAnyProps<Props extends null ? this['T'] : Props>>
  storyResult: NanoviewsStoryResult<OrAnyProps<Props extends null ? this['T'] : Props>>
}

export type StoryContext = StoryContextBase<NanoviewsRenderer>
