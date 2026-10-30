# @nanoviews/server

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nanoviews/server.svg
[npm-url]: https://npmjs.com/package/@nanoviews/server

[deps]: https://img.shields.io/librariesio/release/npm/@nanoviews/server
[deps-url]: https://libraries.io/npm/@nanoviews%2Fserver

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

Server-side rendering for [Nanoviews](../nanoviews#readme): the API of `nanoviews`, building HTML strings instead of DOM.

- **The same views**. Every export of `nanoviews`, `nanoviews/store` and `nanoviews/svg` under the same name, so the server bundle renders the views of the app as they are written.
- **Synchronous**. `renderToString` builds an app the way `mount` does and returns its markup.
- **Nothing left behind**. A render is stopped as soon as its markup is written: no `effect$` runs, and what the render created is let go.

## Installation

```bash
pnpm add nanoviews @nanoviews/server
# or
npm i nanoviews @nanoviews/server
# or
yarn add nanoviews @nanoviews/server
```

## Quick Start

The app imports from `nanoviews` everywhere, and the server bundle resolves `nanoviews` to `@nanoviews/server`. In the client bundle `renderToString` throws, since that one builds DOM.

```ts
// server.ts
import { context$, renderToString } from 'nanoviews'
import { App } from './App.js'

export function render() {
  const html = renderToString(() => context$()(
    App()
  ))

  return `<!doctype html>${html}`
}
```

Each render builds its stores in a context of its own: open one with `context$()` at the root, and keep the state of a request out of module-level signals.

The markup is what the client shows before any effect runs:

- A binding and a block write the value they read when they are built. What `effect$` would write later stays on the client.
- `portal` writes nothing in place, and a hidden `show_` writes nothing at all.
- `value`, `checked` and `muted` become attributes, a `select` marks the `selected` option, and `autoFocus` becomes `autofocus`.
- `shadow` writes a declarative shadow root.

## Documentation

For comprehensive guides, advanced patterns, and API reference, visit the [documentation website](https://nanoviews.js.org/guides/ssr/).
