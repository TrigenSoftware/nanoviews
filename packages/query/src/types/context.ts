
export type OnEveryError = (error: unknown, stopped: boolean) => void

export type OnSuccess<T> = (data: T) => void

export type OnError = (error: unknown) => void

export type OnSettled<T> = (data: T | undefined, error: unknown) => void
