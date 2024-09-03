import { noop } from './utils.js'

let tasks = 0
let resolves: (() => void)[] = []

/**
 * Start an asynchronous task.
 * @returns Function to end the task.
 */
export function startTask() {
  tasks++

  return () => {
    tasks--

    if (!tasks) {
      const prevResolves = resolves

      resolves = []

      prevResolves.forEach(resolve => resolve())
    }
  }
}

/**
 * Wait for all running tasks to finish.
 * @returns Promise that resolves when all running tasks are finished.
 */
export function allTasks() {
  if (!tasks) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    resolves.push(resolve)
  })
}

/**
 * Clean all tasks.
 */
export function cleanTasks() {
  tasks = 0
}

/**
 * Define an asynchronous task.
 * @param fn - Async task function.
 * @returns The task promise.
 */
export function task<T = void>(fn: () => Promise<T>) {
  const end = startTask()
  const task = fn()

  void task.catch(noop).finally(end)

  return task
}
