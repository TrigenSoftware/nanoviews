export type TasksPool = Set<Promise<unknown>>

export type Task<T = void> = Promise<T> | (() => Promise<T>)

export type TasksRunner = <T>(fn: Task<T>) => Promise<T>
