import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach
} from 'vitest'
import {
  type TasksPool,
  effect,
  signal,
  tasksRunner,
  waitTasks
} from '@nano_kit/store'
import { queryKey } from '../cache.js'
import { tasks } from '../ClientContext.js'
import { client } from '../client.js'
import {
  type Post,
  resetMockData,
  getPost
} from '../client.mock.js'
import { revalidateOnInterval } from './revalidateOnInterval.js'

const PostKey = queryKey<[id: number], Post | null>('post')

describe('query', () => {
  describe('settings', () => {
    describe('revalidateOnInterval', () => {
      const tasksPool: TasksPool = new Set()

      beforeEach(() => {
        tasksPool.clear()
        resetMockData()
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it('should revalidate on interval', async () => {
        const { query } = client(tasks(tasksRunner(tasksPool)))
        const $id = signal(1)
        const fetcher = vi.fn(getPost)
        const [$data] = query(PostKey, [$id], fetcher, [revalidateOnInterval(1000)])
        const off = effect(() => {
          $data()
        })

        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(1000)
        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(2)

        vi.advanceTimersByTime(1000)
        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(3)

        off()

        vi.advanceTimersByTime(1000)
        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(3)
      })

      it('should use current key value', async () => {
        const { query } = client(tasks(tasksRunner(tasksPool)))
        const $id = signal(1)
        const fetcher = vi.fn(getPost)
        const [$data] = query(PostKey, [$id], fetcher, [revalidateOnInterval(1000)])
        const off = effect(() => {
          $data()
        })

        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(1)
        expect(fetcher).toHaveBeenLastCalledWith(1, expect.anything())

        vi.advanceTimersByTime(1000)
        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(2)
        expect(fetcher).toHaveBeenLastCalledWith(1, expect.anything())

        $id(2)
        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(3)
        expect(fetcher).toHaveBeenLastCalledWith(2, expect.anything())

        vi.advanceTimersByTime(1000)
        await waitTasks(tasksPool)

        expect(fetcher).toHaveBeenCalledTimes(4)
        expect(fetcher).toHaveBeenLastCalledWith(2, expect.anything())

        off()
      })
    })
  })
})
