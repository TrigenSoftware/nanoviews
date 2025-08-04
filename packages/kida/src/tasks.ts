import type { TasksSet } from './types/index.js'

/**
 * Injection token for current tasks set.
 * @returns The current tasks set.
 */
export function Tasks() {
  return new Set<Promise<unknown>>()
}

/**
 * Wait for all running tasks to finish.
 * @param tasks - Tasks queue.
 * @returns Promise that resolves when all running tasks are finished.
 */
/* @__NO_SIDE_EFFECTS__ */
export function allTasks(tasks: TasksSet) {
  return Promise.allSettled([...tasks])
}

/**
 * Clean all tasks.
 * @param tasks - Tasks queue.
 */
export function cleanTasks(tasks: TasksSet) {
  tasks.clear()
}

/**
 * Define an asynchronous task.
 * @param tasks - Tasks queue.
 * @param task - The task promise.
 * @returns The task promise.
 */
export function addTask<T = void>(
  tasks: TasksSet,
  task: Promise<T>
) {
  const done = () => tasks.delete(task)

  tasks.add(task.then(done, done))

  return task
}

/**
 * Create a task runner.
 * @param tasks - Tasks queue.
 * @returns The task runner.
 */
/* @__NO_SIDE_EFFECTS__ */
export function createTasksRunner(tasks: TasksSet) {
  return (fn: () => Promise<unknown>) => addTask(tasks, fn())
}
