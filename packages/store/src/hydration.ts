import {
  type AnyAccessor,
  type AnyWritableSignal,
  ExternalModesBase,
  start,
  InjectionContext,
  run,
  inject,
  observe
} from 'kida'
import {
  TasksPool$,
  waitTasks
} from './tasks.js'

const HydratedMode = 1 << ExternalModesBase

/**
 * Injection token for dehydrated data.
 * @returns The dehydrated data.
 */
export function Dehydrated$(): Map<string, unknown> | null {
  return null
}

/**
 * Injection token for hydratable signals.
 * @returns The map of hydratable signals.
 */
export function Hydratables$(): Map<string, AnyAccessor> | null {
  return null
}

/**
 * Mark a signal as hydratable.
 * @param id - The id of the signal.
 * @param $signal - The signal to mark as hydratable.
 * @returns The signal.
 */
export function hydratable<T extends AnyWritableSignal>(id: string, $signal: T): T {
  const dehydrated = inject(Dehydrated$)

  if (dehydrated) {
    if (dehydrated.has(id)) {
      $signal(dehydrated.get(id))
      dehydrated.delete(id)
      $signal.node.modes |= HydratedMode

      const stop = observe($signal, () => {
        $signal.node.modes &= ~HydratedMode
        stop()
      })
    }
  } else {
    const hydratables = inject(Hydratables$)

    if (hydratables) {
      hydratables.set(id, $signal)
    }
  }

  return $signal
}

/**
 * Check if a signal has hydrated value.
 * @param $signal - The signal to check.
 * @returns Whether the signal has hydrated value.
 */
export function isHydrated($signal: AnyWritableSignal) {
  return ($signal.node.modes & HydratedMode) !== 0
}

/**
 * Dehydrate all stores data from the runner.
 * @param runner - The function to run.
 * @param context - The injection context.
 * @returns The dehydrated data.
 */
export async function dehydrate(
  runner: () => AnyAccessor[],
  context = new InjectionContext()
) {
  const hydratables = new Map<string, AnyAccessor>()

  context.set(Hydratables$, hydratables)

  const stores = run(context, runner)
  const tasks = context.get(TasksPool$)
  const stop = start(() => stores.forEach(store => store() as void))

  await waitTasks(tasks)

  const dehydrated: [string, unknown][] = []

  hydratables.forEach(($signal, id) => {
    dehydrated.push([id, $signal()])
  })

  stop()

  return dehydrated
}
