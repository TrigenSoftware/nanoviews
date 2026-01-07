import {
  type AnyAccessor,
  type AnyWritableSignal,
  start,
  InjectionContext,
  run,
  inject
} from 'kida'
import {
  TasksPool$,
  waitTasks
} from './tasks.js'

/**
 * Injection token for serialized data.
 * @returns The serialized data.
 */
export function Serialized$(): Record<string, unknown> | null {
  return null
}

function ToSerialize$(): Map<string, AnyAccessor> | null {
  return null
}

/**
 * Make a signal serializable.
 * @param id - The id of the signal.
 * @param $signal - The signal to mark as serializable.
 * @returns The signal.
 */
export function serializable<T extends AnyWritableSignal>(id: string, $signal: T) {
  const serialized = inject(Serialized$)

  if (serialized) {
    if (Object.hasOwn(serialized, id)) {
      $signal(serialized[id])
    }
  } else {
    const toSerialize = inject(ToSerialize$)

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
export async function serialize(
  runner: () => AnyAccessor[],
  context = new InjectionContext()
) {
  const toSerialize = new Map<string, AnyAccessor>()

  context.set(ToSerialize$, toSerialize)

  const stores = run(context, runner)
  const tasks = context.get(TasksPool$)
  const stop = start(() => stores.forEach(store => store() as void))

  await waitTasks(tasks)

  const serialized: Record<string, unknown> = {}

  toSerialize.forEach(($signal, id) => {
    serialized[id] = $signal()
  })

  stop()

  return serialized
}
