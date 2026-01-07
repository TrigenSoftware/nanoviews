/* eslint-disable @typescript-eslint/no-deprecated */
import {
  describe,
  it,
  expect
} from 'vitest'
import {
  signal,
  mountable,
  InjectionContext,
  run,
  inject,
  provide,
  onMount
} from 'kida'
import { TasksPool$ } from './tasks.js'
import { channel } from './channel.js'
import {
  Serialized$,
  serializable,
  serialize
} from './serialize.js'

interface User {
  name: string
}

function UserStore() {
  const $user = serializable('user', mountable(signal<User | null>(null)))
  const [
    userTask,
    $userLoading,
    $userError
  ] = channel(inject(TasksPool$))

  onMount($user, () => {
    userTask(async () => {
      await Promise.resolve()

      $user({
        name: 'John'
      })
    })
  })

  return {
    $user,
    $userLoading,
    $userError
  }
}

describe('store', () => {
  describe('serialize', () => {
    it('should serialize', async () => {
      const serialized = await serialize(() => {
        const { $user } = inject(UserStore)

        return [$user]
      })

      expect(serialized).toEqual({
        user: {
          name: 'John'
        }
      })
    })

    it('should hydrate', () => {
      const serialized = {
        user: {
          name: 'John'
        }
      }
      const context = new InjectionContext([
        provide(Serialized$, serialized)
      ])
      const { $user } = run(context, () => inject(UserStore))

      expect($user()).toEqual({
        name: 'John'
      })
    })
  })
})
