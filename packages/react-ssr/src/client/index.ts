import { router } from '@nano_kit/react-router'
import {
  type ReadyOptions,
  ready as vanillaReady
} from '@nano_kit/ssr/client'

export * from '@nano_kit/ssr/client'

export interface ReactReadyOptions extends Omit<ReadyOptions, 'router'> {}

export function ready(options: ReactReadyOptions) {
  return vanillaReady({
    ...options,
    router
  })
}
