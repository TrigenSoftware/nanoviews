import type {
  ReadableRecord,
  ReadableSignal,
  Mountable
} from 'kida'
import type { Location } from './navigation.js'

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S]

type PathToParams<PathArray, Value = string, Params = {}> = PathArray extends [
  infer First,
  ...infer Rest
]
  ? First extends `:${infer Param}`
    ? First extends `:${infer Param}?`
      ? PathToParams<Rest, Value, Params & Partial<Record<Param, Value>>>
      : PathToParams<Rest, Value, Params & Record<Param, Value>>
    : Rest extends []
      ? First extends '*'
        ? Params & { wildcard: Value }
        : PathToParams<Rest, Value, Params>
      : PathToParams<Rest, Value, Params>
  : Params

type Simplify<T> = {
  [K in keyof T]: T[K]
} & {}

type ParseUrl<Path extends string, Value = string> = Simplify<PathToParams<Split<Path, '/'>, Value>>

type RemoveTrailingSlash<T extends string> = T extends '/' ? T : T extends `${infer U}/` ? U : T

export type Paths<R extends Routes> = {
  [K in keyof R]: ParseUrl<R[K], string | number> extends infer Params
    ? Params extends Record<string, never>
      ? RemoveTrailingSlash<R[K]>
      : {} extends Params
        ? (params?: Params) => string
        : (params: Params) => string
    : never
}

export type Routes = Record<string, string>

export type RouteMatch<R extends Routes, K extends keyof R = keyof R> = {
  [K in keyof R]: {
    route: K
    params: ParseUrl<R[K]>
  }
}[K]

export type RouteLocation<R extends Routes> = Location & (RouteMatch<R> | {
  route: null
  params: {}
})

export type RouteLocationSignal<R extends Routes> = Mountable<ReadableSignal<RouteLocation<R>>>

export type RouteLocationRecord<R extends Routes> = ReadableRecord<RouteLocationSignal<R>>
