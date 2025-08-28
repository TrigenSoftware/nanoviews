export interface PageMatchRef<E extends string, P> {
  e: E
  p: P
}

export interface LayoutMatchRef<R extends string, P, L> {
  l: L
  p: (
    | PageMatchRef<R, P>
    | LayoutMatchRef<R, P, L>
  )[]
}
