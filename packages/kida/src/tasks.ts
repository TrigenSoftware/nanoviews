import type { TasksSet } from './types/index.js'
import { inject } from './di.js'

/**
 * Wait for all currently running tasks to finish.
 * @param tasksSet - Tasks queue.
 * @returns Promise that resolves when all currently running tasks are finished.
 */
export function waitCurrentTasks(tasksSet: TasksSet) {
  return Promise.allSettled(tasksSet)
}

/**
 * Wait for all tasks to finish.
 * @param tasksSet - Tasks queue.
 * @returns Promise that resolves when all tasks are finished.
 */
export async function waitTasks(tasksSet: TasksSet) {
  while (tasksSet.size) {
    await waitCurrentTasks(tasksSet)
  }
}

/**
 * Define an asynchronous task.
 * @param tasksSet - Tasks queue.
 * @param task - The task promise.
 * @returns The task promise.
 */
export function addTask<T = void>(
  tasksSet: TasksSet,
  task: Promise<T>
) {
  const done = (): boolean => tasksSet.delete(taskDone)
  const taskDone = task.then(done, done)

  tasksSet.add(taskDone)

  return task
}

/**
 * Create a tasks pool.
 * @param tasksSet - Tasks pool storage.
 * @returns The function to run task within the pool.
 */
/* @__NO_SIDE_EFFECTS__ */
export function tasksPool(
  tasksSet: TasksSet = new Set()
) {
  return <T>(fn: () => Promise<T>) => addTask(tasksSet, fn())
}

/**
 * DI factory for tasks set.
 * @returns The tasks set.
 */
export function $TasksSet() {
  return new Set<Promise<unknown>>()
}

/**
 * DI factory for tasks pool.
 * @returns The function to run task within the pool.
 */
export function $TasksPool() {
  const tasksSet = inject($TasksSet)

  return tasksPool(tasksSet)
}
