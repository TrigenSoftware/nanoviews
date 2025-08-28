import type { ReadableSignal } from 'kida'

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S]

type PathToParams<PathArray, Params = {}> = PathArray extends [
  infer First,
  ...infer Rest
]
  ? First extends `:${infer Param}`
    ? First extends `:${infer Param}?`
      ? PathToParams<Rest, Params & Partial<Record<Param, string>>>
      : PathToParams<Rest, Params & Record<Param, string>>
    : Rest extends []
      ? First extends '*'
        ? Params & { wildcard: string }
        : PathToParams<Rest, Params>
      : PathToParams<Rest, Params>
  : Params

type Simplify<T> = {
  [K in keyof T]: T[K]
} & {}

type ParseUrl<Path extends string> = Simplify<PathToParams<Split<Path, '/'>>>

export type Routes = Record<string, string>

export type RouteMatch<R extends Routes, K extends keyof R = keyof R> = {
  [K in keyof R]: {
    route: K
    params: ParseUrl<R[K]>
  }
}[K]

export type RouteMatchSignal<R extends Routes> = ReadableSignal<RouteMatch<R> | {
  route: null
  params: {}
}>

type RemoveTrailingSlash<T extends string> = T extends '/' ? T : T extends `${infer U}/` ? U : T

export type Paths<R extends Routes> = {
  [K in keyof R]: ParseUrl<R[K]> extends Record<string, never>
    ? RemoveTrailingSlash<R[K]>
    : {} extends ParseUrl<R[K]>
      ? (params?: ParseUrl<R[K]>) => string
      : (params: ParseUrl<R[K]>) => string
}
