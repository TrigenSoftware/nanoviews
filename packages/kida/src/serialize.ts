import type {
  AnyReadableSignal,
  AnyWritableSignal,
  AnySignal
} from 'agera'
import { start } from './internals/index.js'
import {
  Tasks,
  allTasks
} from './tasks.js'
import {
  InjectionContext,
  run,
  inject
} from './di.js'

/**
 * Injection token for serialized data.
 * @returns The serialized data.
 */
export function Serialized(): Record<string, unknown> | null {
  return null
}

function ToSerialize(): Map<string, AnyReadableSignal> | null {
  return null
}

/**
 * Make a signal serializable.
 * @param id - The id of the signal.
 * @param $signal - The signal to mark as serializable.
 * @returns The signal.
 */
export function serializable<T extends AnyWritableSignal>(id: string, $signal: T) {
  const serialized = inject(Serialized)

  if (serialized) {
    if (Object.hasOwn(serialized, id)) {
      $signal(serialized[id])
    }
  } else {
    const toSerialize = inject(ToSerialize)

    if (toSerialize) {
      toSerialize.set(id, $signal)
    }
  }

  return $signal
}

/**
 * Serialize all serializable stores from the runner.
 * @param runner - The function to run.
 * @param context - The injection context.
 * @returns The serialized data.
 */
export async function serialize(runner: () => AnySignal[], context = new InjectionContext()) {
  const toSerialize = new Map<string, AnyReadableSignal>()

  context.set(ToSerialize, toSerialize)

  const stores = run(context, runner)
  const tasks = context.get(Tasks)
  const stops = stores.map(start)

  await allTasks(tasks)

  const serialized: Record<string, unknown> = {}

  toSerialize.forEach(($signal, id) => {
    serialized[id] = $signal()
  })

  stops.forEach(stop => stop())

  return serialized
}
