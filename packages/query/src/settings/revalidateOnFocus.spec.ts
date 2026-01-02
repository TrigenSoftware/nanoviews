import {
  vi,
  describe,
  it,
  expect,
  beforeEach
} from 'vitest'
import {
  type TasksPool,
  effect,
  signal,
  tasksRunner,
  waitTasks
} from 'kida'
import { queryKey } from '../cache.js'
import { tasks } from '../ClientContext.js'
import { client } from '../client.js'
import {
  type Post,
  resetMockData,
  getPost
} from '../client.mock.js'
import {
  $windowVisible,
  revalidateOnFocus
} from './revalidateOnFocus.js'

const PostKey = queryKey<[id: number], Post | null>('post')

describe('query', () => {
  describe('settings', () => {
    describe('revalidateOnFocus', () => {
      const tasksPool: TasksPool = new Set()

      beforeEach(() => {
        tasksPool.clear()
        resetMockData()
        $windowVisible(true)
      })

      it('should revalidate on focus', async () => {
        const { query } = client(tasks(tasksRunner(tasksPool)))
        const $id = signal(1)
        const fetcher = vi.fn(getPost)
        const [$data] = query(PostKey, [$id], fetcher, [revalidateOnFocus()])
        const off = effect(() => {
          $data()
        })

        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(1)

        $windowVisible(false)

        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(1)

        $windowVisible(true)

        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(2)

        off()
      })

      it('should use current key value', async () => {
        const { query } = client(tasks(tasksRunner(tasksPool)))
        const $id = signal(1)
        const fetcher = vi.fn(getPost)
        const [$data] = query(PostKey, [$id], fetcher, [revalidateOnFocus()])
        const off = effect(() => {
          $data()
        })

        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(1)
        expect(fetcher).toHaveBeenLastCalledWith(1, expect.anything())

        $id(2)

        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(2)
        expect(fetcher).toHaveBeenLastCalledWith(2, expect.anything())

        $windowVisible(false)
        $windowVisible(true)

        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(3)
        expect(fetcher).toHaveBeenLastCalledWith(2, expect.anything())

        off()
      })
    })
  })
})
