import {
  describe,
  it,
  expect
} from 'vitest'
import {
  InjectionContext,
  run,
  inject
} from './di.js'
import { Tasks } from './tasks.js'
import { signal } from './signal.js'
import { onMount } from './lifecycle.js'
import { channel } from './channel.js'
import {
  Serialized,
  serializable,
  serialize
} from './serialize.js'

interface User {
  name: string
}

function UserStore() {
  const $user = serializable('user', signal<User | null>(null))
  const [
    userTask,
    $userLoading,
    $userError
  ] = channel(inject(Tasks))

  onMount($user, () => {
    userTask(async () => {
      await Promise.resolve()

      $user.set({
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

describe('stores', () => {
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
      const context = new InjectionContext(undefined, [[Serialized, serialized]])
      const { $user } = run(context, () => inject(UserStore))

      expect($user.get()).toEqual({
        name: 'John'
      })
    })
  })
})