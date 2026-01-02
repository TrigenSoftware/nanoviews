import type {
  ClientContext,
  QueryClientContext,
  MutationClientContext
} from '../ClientContext.js'

export type ClientSetting<T extends QueryClientContext | MutationClientContext = QueryClientContext | MutationClientContext> = (ctx: T) => void

export type AnyClientSetting = ClientSetting<QueryClientContext> | ClientSetting<MutationClientContext> | ClientSetting

export type ClientExtension<E> = <T>(ctx: ClientContext, client: T) => T & E

export type AnyClientExtension = ClientExtension<{}>

type Extension<S extends (AnyClientSetting | AnyClientExtension)[]> = S extends [infer First, ...infer Rest]
  ? First extends ClientExtension<infer E>
    ? Rest extends (AnyClientSetting | AnyClientExtension)[]
      ? Extension<Rest> & E
      : E
    : Rest extends (AnyClientSetting | AnyClientExtension)[]
      ? Extension<Rest>
      : {}
  : {}

type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type ExtendedClient<T, S extends (AnyClientSetting | AnyClientExtension)[]> = Prettify<T & Extension<S>>
