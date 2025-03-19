import {
  type AnyFn,
  type ReadableSignal,
  type InjectionProvider,
  type InjectionFactory,
  InjectionContext as KidaInjectionContext,
  inject,
  action,
  effect
} from 'kida'
import {
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useSyncExternalStore,
  createContext,
  useContext
} from 'react'

/**
 * Get signal store value and subscribe to changes.
 * @param $signal - The signal store.
 * @returns The signal store value.
 */
export function useSignal<T>($signal: ReadableSignal<T>) {
  const snapshotRef = useRef(undefined as T)
  const sub = useCallback(
    (emit: () => void) => effect(() => {
      const value = $signal()

      if (snapshotRef.current !== value) {
        snapshotRef.current = value
        emit()
      }
    }),
    [$signal]
  )
  const get = () => snapshotRef.current

  snapshotRef.current = $signal()

  return useSyncExternalStore(sub, get, get)
}

export const ReactInjectionContext = /* @__PURE__ */ createContext<KidaInjectionContext | undefined>(undefined)

/**
 * Inject a dependency.
 * @param factory - The factory function to create or get the dependency.
 * @returns The dependency.
 */
export function useInject<T>(factory: InjectionFactory<T>): T {
  const currentContext = useContext(ReactInjectionContext)
  const dependency = useMemo(
    () => inject(factory, currentContext),
    [currentContext, factory]
  )

  return dependency
}

/**
 * Create an action that runs within the current injection context.
 * @param fn - The function to run.
 * @returns The action.
 */
export function useAction<T extends AnyFn>(fn: T): T {
  const currentContext = useContext(ReactInjectionContext)
  const actionFn = useMemo(
    () => action(fn, currentContext),
    [currentContext, fn]
  )

  return actionFn
}

export interface InjectionContextProps {
  provide?: InjectionProvider[]
  children: ReactNode
}

/**
 * Provide dependencies to children.
 * @param props
 * @param props.provide - The dependencies to provide.
 * @param props.children - The children to provide the dependencies to.
 * @returns The component.
 */
export function InjectionContext({
  provide,
  children
}: InjectionContextProps) {
  const currentContext = useContext(ReactInjectionContext)

  if (!provide && currentContext) {
    return children
  }

  return (
    <ReactInjectionContext.Provider value={new KidaInjectionContext(currentContext, provide)}>
      {children}
    </ReactInjectionContext.Provider>
  )
}

export interface IsolateProps {
  children: ReactNode
}

/**
 * Isolate children to new isolated injection context.
 * @param props
 * @param props.children - The children to isolate.
 * @returns The component.
 */
export function Isolate({ children }: IsolateProps) {
  return (
    <ReactInjectionContext.Provider value={undefined}>
      {children}
    </ReactInjectionContext.Provider>
  )
}
