# @nanoviews/router

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nanoviews/router.svg
[npm-url]: https://npmjs.com/package/@nanoviews/router

[deps]: https://img.shields.io/librariesio/release/npm/@nanoviews/router
[deps-url]: https://libraries.io/npm/@nanoviews%2Frouter

[size]: https://deno.bundlejs.com/badge?q=@nanoviews/router
[size-url]: https://bundlejs.com/?q=@nanoviews/router

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../../website/src/assets/ring-system_white.svg">
  <img alt="Four-pointed ring system star logo" src="../../website/src/assets/ring-system_black.svg" width="100" height="100" align="right">
</picture>

[Nanoviews](../nanoviews#readme) integration for [@nano_kit/router](https://nano-kit.js.org/router): pages, nested layouts, code splitting, links and head management, with or without dependency injection.

- **Small**. Around 1.3 kB (minified and brotlied) on top of the router, and only what you import of it.
- **Direct DOM**. A layout is built once and the matched page is swapped inside it.
- **Type-safe**. Route names and params are checked in links and path builders.

## Installation

```bash
pnpm add nanoviews @nano_kit/store @nano_kit/router @nanoviews/router
# or
npm i nanoviews @nano_kit/store @nano_kit/router @nanoviews/router
# or
yarn add nanoviews @nano_kit/store @nano_kit/router @nanoviews/router
```

## Quick Start

`@nanoviews/router` re-exports everything from `@nano_kit/router`, so the whole router is imported from it. Here is an app with two pages in a layout, each page in a chunk of its own:

```ts
import { mount, main, nav, component$ } from 'nanoviews'
import { browserNavigation, buildPaths, linkComponent, router, pageView, page, layout, loadable, Outlet } from '@nanoviews/router'

const routes = {
  home: '/',
  user: '/users/:id'
} as const
const [$location, navigation] = browserNavigation(routes)
const Link = linkComponent(navigation, buildPaths(routes))

const MainLayout = component$(() => (
  main()(
    nav()(
      Link({
        to: 'home'
      })(
        'Home'
      ),
      Link({
        to: 'user',
        params: {
          id: 1
        }
      })(
        'User'
      )
    ),
    Outlet()
  )
))

const $page = router($location, [
  layout(MainLayout, [
    page('home', loadable(() => import('./pages/Home.js'))),
    page('user', loadable(() => import('./pages/User.js')))
  ])
])

mount(() => pageView($page), document.querySelector('#app')!)
```

A page module exports its page as `default`:

```ts
// pages/Home.ts
import { h1, component$ } from 'nanoviews'

export default component$(() => (
  h1()(
    'Home'
  )
))
```

## Documentation

For comprehensive guides, advanced patterns, and API reference, visit the [documentation website](https://nanoviews.js.org/router/).
