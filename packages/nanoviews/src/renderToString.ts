import type { Child } from './internals/index.js'

/**
 * Render an app to an HTML string. It works in the server bundle only, where
 * `@nanoviews/server` stands in for `nanoviews`: the client bundle builds DOM
 * and has no markup to give
 * @param app - App function to render, as for `mount`
 * @returns The HTML of the app
 */
export function renderToString(app: () => Child): string

export function renderToString(): string {
  throw import.meta.env.DEV
    ? new Error('renderToString works in the server bundle only, where @nanoviews/server stands in for nanoviews')
    : new Error()
}
