import {
  describe,
  it,
  expect
} from 'vitest'
import {
  waitCurrentTasks,
  tasksPool
} from './tasks.js'

describe('kida', () => {
  describe('tasks', () => {
    describe('allTasks', () => {
      it('should wait resolved task', async () => {
        const tasks = new Set<Promise<unknown>>()
        const task = tasksPool(tasks)
        let resolve: () => void
        const promise = task(() => new Promise<void>((r) => {
          resolve = r
        }))
        let stamp = ''
        const waitTasks = waitCurrentTasks(tasks)

        waitTasks.then(() => {
          stamp += ' allTasks '
        })
        promise.then(() => {
          stamp += ' task '
        })

        resolve!()
        await Promise.all([waitTasks, promise])

        expect(stamp).toBe(' task  allTasks ')
      })

      it('should wait rejected task', async () => {
        const tasks = new Set<Promise<unknown>>()
        const task = tasksPool(tasks)
        let reject: () => void
        const promise = task(() => new Promise<void>((_, r) => {
          reject = r
        }))
        let stamp = ''
        const waitTasks = waitCurrentTasks(tasks)

        waitTasks.then(() => {
          stamp += ' allTasks '
        })
        promise.catch(() => {
          stamp += ' task '
        })

        reject!()
        await Promise.allSettled([waitTasks, promise])

        expect(stamp).toBe(' task  allTasks ')
      })
    })
  })
})
