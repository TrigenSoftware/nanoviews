export interface Context<T = unknown> {
  i: symbol
  v: T
}

export type ContextLayer = Map<symbol, unknown>
