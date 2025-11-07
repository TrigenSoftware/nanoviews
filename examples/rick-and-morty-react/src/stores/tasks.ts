import {
  type TasksSet,
  channel
} from 'kida'

export const tasks: TasksSet = new Set()

export const [
  task,
  $loading,
  $error
] = channel(tasks)
