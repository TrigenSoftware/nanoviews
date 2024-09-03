import {
  describe,
  it,
  expect
} from 'vitest'
import {
  allTasks,
  task
} from './tasks.js'

describe('stores', () => {
  describe('tasks', () => {
    describe('allTasks', () => {
      it('should wait zero tasks', async () => {
        await allTasks()
      })

      it('should wait resolved task', async () => {
        let resolve: () => void
        const promise = task(() => new Promise<void>((r) => {
          resolve = r
        }))
        let stamp = ''
        const waitTasks = allTasks()

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
        let reject: () => void
        const promise = task(() => new Promise<void>((_, r) => {
          reject = r
        }))
        let stamp = ''
        const waitTasks = allTasks()

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
