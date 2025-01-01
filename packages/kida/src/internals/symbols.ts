let empty

export const $$value = Symbol(import.meta.env.DEV ? 'value' : empty)
export const $$addListener = Symbol(import.meta.env.DEV ? 'add listener' : empty)
export const $$removeListener = Symbol(import.meta.env.DEV ? 'remove listener' : empty)
export const $$listen = Symbol(import.meta.env.DEV ? 'listen' : empty)
export const $$notify = Symbol(import.meta.env.DEV ? 'notify' : empty)

export const $$START = Symbol(import.meta.env.DEV ? 'START event listeners' : empty)
export const $$SET = Symbol(import.meta.env.DEV ? 'SET event listeners' : empty)
export const $$NOTIFY = Symbol(import.meta.env.DEV ? 'NOTIFY event listeners' : empty)
export const $$CHANGE = Symbol(import.meta.env.DEV ? 'CHANGE event listeners' : empty)
export const $$STOP = Symbol(import.meta.env.DEV ? 'STOP event listeners' : empty)

export const $$collection = Symbol(import.meta.env.DEV ? 'collection cache' : empty)
export const $$record = Symbol(import.meta.env.DEV ? 'record cache' : empty)
