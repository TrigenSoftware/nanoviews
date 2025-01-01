export type InjectionFactory<T = unknown> = () => T

export type InjectionProvider = readonly [InjectionFactory, unknown]
