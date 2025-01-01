import {
  type InjectionProvider,
  type InjectionFactory,
  InjectionContext,
  getContext,
  run,
  inject,
  isFunction
} from 'kida'

export {
  getContext,
  run,
  inject
}

/**
 * Provide a dependency.
 * @param token - The factory function to create or get the dependency.
 * @param value - The value of the dependency.
 * @returns The provider.
 */
export function provide<T>(token: InjectionFactory<T>, value: T): InjectionProvider {
  return [token, value]
}

/**
 * Run a function within an current injection context.
 * @param fn - The function to run.
 * @returns The return value of the function.
 */
export function context<R>(fn: () => R): R

/**
 * Run a function within a new injection context with the given values.
 * @param providers - The values to use in the context.
 * @param fn - The function to run.
 * @returns The return value of the function.
 */
export function context<R>(providers: InjectionProvider[], fn: () => R): R

export function context<R>(providersOrFn: InjectionProvider[] | (() => R), maybeFn?: () => R) {
  const currentContext = getContext()
  let providers: InjectionProvider[] | undefined
  let fn: () => R

  if (isFunction(providersOrFn)) {
    fn = providersOrFn

    if (currentContext) {
      return run(currentContext, fn)
    }
  } else {
    providers = providersOrFn
    fn = maybeFn!
  }

  return run(new InjectionContext(currentContext, providers), fn)
}

/**
 * Run a function within a new isolated injection context.
 * @param fn - The function to run.
 * @returns The return value of the function.
 */
export function isolate<R>(fn: () => R): R {
  return run(undefined, fn)
}
