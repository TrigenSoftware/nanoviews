import type {
  Routes,
  ParseUrl
} from './types.js'

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
