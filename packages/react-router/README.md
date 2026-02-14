# @nano_kit/react-router

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nano_kit/react-router.svg
[npm-url]: https://npmjs.com/package/@nano_kit/react-router

[deps]: https://img.shields.io/librariesio/release/npm/@nano_kit/react-router
[deps-url]: https://libraries.io/npm/@nano_kit/react-router/tree

[size]: https://deno.bundlejs.com/badge?q=@nano_kit/react-router
[size-url]: https://bundlejs.com/?q=@nano_kit/react-router

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nano_kit/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nano_kit/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nano_kit.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nano_kit

The `@nano_kit/react-router` package provides React integration for [@nano_kit/router](../router). It allows you to use the router's powerful features like code splitting, dependency injection, and state management directly within your React application.

## Installation

```bash
pnpm add @nano_kit/store @nano_kit/router @nano_kit/react @nano_kit/react-router
# or
npm install @nano_kit/store @nano_kit/router @nano_kit/react @nano_kit/react-router
# or
yarn add @nano_kit/store @nano_kit/router @nano_kit/react @nano_kit/react-router
```

## Quick Start

Basically, `@nano_kit/react-router` re-exports everything from `@nano_kit/router`, so you can use all base router functions:

```tsx
import { browserNavigation, app, layout, page, loadable, Outlet } from '@nano_kit/react-router'
import { MainLayout } from './MainLayout'

/* Define routes config */
const routes = {
  home: '/',
  user: '/users/:id'
} as const

/* Create navigation */
const [$location, navigation] = browserNavigation(routes)

/* Define loader fallback */
const Loader = () => <div>Loading...</div>

/* Create App component */
const App = app($location, [
  layout(MainLayout, [
    page('home', loadable(() => import('./Home'), Loader)),
    page('user', loadable(() => import('./User'), Loader))
  ])
])

/* Render App */
createRoot(document.getElementById('root')!).render(<App />)
```

## Documentation

For comprehensive guides, API reference, and integration patterns, visit the [documentation website](https://nano_kit.js.org/integrations/react-router).
