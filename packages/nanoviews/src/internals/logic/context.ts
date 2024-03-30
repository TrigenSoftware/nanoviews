import type { Context, ContextLayer } from '../types/index.js'
import { isArray, toArray, noop } from '../utils.js'

const contextStack: ContextLayer[] = []

/**
 * Get current context stack
 * @returns Current context stack
 */
export function getCurrentContextStack() {
  return contextStack.at(-1)
}

function pushContext(context: Context | Context[] | ContextLayer) {
  let layer: ContextLayer

  if (context instanceof Map) {
    layer = context
  } else {
    layer = new Map(getCurrentContextStack())

    toArray(context).forEach(
      ctx => layer.set(ctx.i, ctx.v)
    )
  }

  contextStack.push(layer)

  return layer
}

function popContext() {
  contextStack.pop()
}

/**
 * Create context
 * @param defaultValue - Default value
 * @returns Context provider and getter
 */
export function createContext<T = unknown>(defaultValue: T) {
  const id = Symbol()
  const provider = (value: T): Context<T> => ({
    i: id,
    v: value
  })
  const getContext = () => getCurrentContextStack()?.get(id) as T || defaultValue

  return [provider, getContext] as const
}

type ContextDifsContainer = [typeof getCurrentContextStack, typeof provideContext]

// "DI For Tree Shaking" Container
let diftsContainer: ContextDifsContainer

/**
 * Get context's "DI For Tree Shaking" Container
 * @returns Context difts container
 */
export function getContextDiftsContainer(): ContextDifsContainer {
  return diftsContainer || [noop, (_, r) => r()]
}

function setDiftsContainer(
  getCurrentContextStackFn: typeof getCurrentContextStack,
  provideContextFn: typeof provideContext
) {
  diftsContainer ||= [getCurrentContextStackFn, provideContextFn]
}

/**
 * Provide context
 * @param context - Context or contexts
 * @param render - Render function
 * @returns Rendered value
 */
export function provideContext<R>(context: Context | Context[] | ContextLayer | undefined, render: () => R) {
  if (!context || isArray(context) && !context.length) {
    return render()
  }

  setDiftsContainer(getCurrentContextStack, provideContext)
  pushContext(context)

  const block = render()

  popContext()

  return block
}
