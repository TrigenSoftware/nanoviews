/* eslint-disable @typescript-eslint/no-unsafe-return */
import type {
  AnyFn,
  InjectionFactory,
  InjectionProvider
} from './types/index.js'

/**
 * InjectionContext is a Map that holds the dependencies for the current context.
 */
export class InjectionContext extends Map<InjectionFactory, unknown> {
  readonly #parent

  constructor(
    parent?: Map<InjectionFactory, unknown>,
    providers?: InjectionProvider[]
  ) {
    super()

    this.#parent = parent

    if (providers) {
      for (let i = 0, len = providers.length, entity; i < len; i++) {
        entity = providers[i]
        this.set(entity[0], entity[1])
      }
    }
  }

  override get<T>(factory: InjectionFactory<T>): T {
    if (this.has(factory)) {
      return super.get(factory) as T
    }

    const parent = this.#parent
    const value = parent
      ? parent.get(factory) as T
      : factory()

    this.set(factory, value)

    return value
  }
}

let currentContext: InjectionContext | undefined

/**
 * Get current injection context.
 * @returns The current injection context.
 */
export function getContext() {
  return currentContext
}

/**
 * Run a function within an injection context.
 * @param context - The injection context.
 * @param fn - The function to run.
 * @param args - The arguments to pass to the function.
 * @returns The return value of the function.
 */
export function run<T extends AnyFn>(
  context: InjectionContext | undefined,
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  if (context === currentContext) {
    return fn(...args as unknown[])
  }

  const parentContext = currentContext

  currentContext = context

  try {
    return fn(...args as unknown[])
  } finally {
    currentContext = parentContext
  }
}

/**
 * Inject a dependency.
 * @param factory - The factory function to create or get the dependency.
 * @param context - Optional override for the injection context.
 * @returns The dependency.
 */
export function inject<T>(factory: InjectionFactory<T>, context = currentContext): T {
  if (!context) {
    throw new Error(import.meta.env.DEV ? 'Cannot inject dependency outside of injection context' : '')
  }

  return context.get(factory)
}

/**
 * Create an action that runs within the current injection context.
 * @param fn - The function to run.
 * @param context - Optional override for the injection context.
 * @returns The action.
 */
export function action<T extends AnyFn>(fn: T, context = currentContext): T {
  if (!context) {
    throw new Error(import.meta.env.DEV ? 'Cannot bind action outside of injection context' : '')
  }

  return (run as AnyFn).bind(null, context, fn) as T
}
