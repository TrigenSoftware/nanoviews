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

React integration for [@nano_kit/router](../router#readme).

```tsx
import { useSignal } from '@nano_kit/react'
import { browserNavigation, router, page, layout, notFound, loadable, Outlet } from '@nano_kit/react-router'

// Setup navigation
const [$location, navigation] = browserNavigation({
  home: '/',
  user: '/users/:id'
})

// Define components
function HomePage() {
  return <div>Welcome Home!</div>
}

function UserPage() {
  const location = useSignal($location)

  return <div>User ID: {location?.params.id}</div>
}

function Layout() {
  return (
    <div className="layout">
      <header><h1>My App</h1></header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

// Setup app
const App = app($location, [
  layout(Layout, [
    page('home', loadable(() => import('./Home'), Loader)),
    page('user', loadable(() => import('./User'), Loader)),
    notFound(loadable(() => import('./NotFound'), Loader))
  ])
])
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#exports">Exports</a>
<br />
<hr />

## Install

```bash
pnpm add @nano_kit/store @nano_kit/router @nano_kit/react @nano_kit/react-router
# or
npm i @nano_kit/store @nano_kit/router @nano_kit/react @nano_kit/react-router
# or
yarn add @nano_kit/store @nano_kit/router @nano_kit/react @nano_kit/react-router
```

## Exports

Basically, `@nano_kit/react-router` re-exports everything from `@nano_kit/router` with some additions for React integration:

### `router`

Enhanced version of `router` from `@nano_kit/router` that works seamlessly with React components and layouts.

```tsx
import { router, page, layout } from '@nano_kit/react-router'

const [$page] = router($location, [
  page('home', HomePage),
  layout(MainLayout, [
    page('user', UserPage),
    page('settings', SettingsPage)
  ])
])
```

### `router$`

Enhanced version of `router$` from `@nano_kit/router` that works like `router` but with injection factories.

```tsx
import { router$, page, layout } from '@nano_kit/react-router'

const [Page$] = router$(Location$, [
  page('home', HomePage),
  layout(MainLayout, [
    page('user', UserPage),
    page('settings', SettingsPage)
  ])
])
```

### `app`

Creates a React application component that renders the current page based on the routing configuration.

```tsx
import { app, page, layout } from '@nano_kit/react-router'

const App = app($location, [
  layout(MainLayout, [
    page('home', HomePage),
    page('user', UserPage)
  ])
])
```

### `app$`

Creates a React application component using injection factory and that should be used within dependency injection context.

```tsx
import { app$, page, layout } from '@nano_kit/react-router'

const [App, StoresToPreload$] = app$(Location$, [
  layout(MainLayout, [
    page('home', HomePage),
    page('user', UserPage)
  ])
])
```

### `Outlet`

Component that renders nested content within layouts. Use it in your layout components to specify where child components should be rendered.

```tsx
import { Outlet } from '@nano_kit/react-router'

function MainLayout() {
  return (
    <div className="main-layout">
      <nav>Navigation</nav>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  )
}
```

### `link`

Creates a React component for navigation links.

```tsx
import { buildPaths, link } from '@nano_kit/react-router'

const routes = {
  home: '/',
  user: '/users/:id'
}
const Link = link(navigation, buildPaths(routes))
// ...
<Link to='home'>Home</Link>
<Link to='user' params={{ id: '123' }}>User 123</Link>
```

Also you can pass hook to preload pages on link hover or focus:

```tsx
import { buildPaths, link, preloadable } from '@nano_kit/react-router'

const routes = {
  home: '/',
  user: '/users/:id'
}
const pages = [
  layout(loadable(() => import('./MainLayout'), Loader), [
    page('home', loadable(() => import('./HomePage'), Loader)),
    page('user', loadable(() => import('./UserPage'), Loader))
  ])
]
const Link = link(navigation, buildPaths(routes), preloadable(pages))
// ...
<Link to='user' params={{ id: '123' }} preload>User 123</Link>
```

### `link$`

Creates a React component for navigation links using injection factory and that should be used within dependency injection context.

```tsx
import { buildPaths, link$ } from '@nano_kit/react-router'

const routes = {
  home: '/',
  user: '/users/:id'
}
const Link = link$(Navigation$, buildPaths(routes))
```
