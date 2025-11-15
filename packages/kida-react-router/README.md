# @kidajs/react-router

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@kidajs/react-router.svg
[npm-url]: https://npmjs.com/package/@kidajs/react-router

[deps]: https://img.shields.io/librariesio/release/npm/@kidajs/react-router
[deps-url]: https://libraries.io/npm/@kidajs/react-router/tree

[size]: https://deno.bundlejs.com/badge?q=@kidajs/react-router
[size-url]: https://bundlejs.com/?q=@kidajs/react-router

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

React integration for [@kidajs/router](../kida-router#readme).

```tsx
import { useSignal } from '@kidajs/react'
import { browserNavigation, router, page, layout, notFound, loadable, Outlet } from '@kidajs/react-router'

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
pnpm add kida @kidajs/router @kidajs/react @kidajs/react-router
# or
npm i kida @kidajs/router @kidajs/react @kidajs/react-router
# or
yarn add kida @kidajs/router @kidajs/react @kidajs/react-router
```

## Exports

Basically, `@kidajs/react-router` re-exports everything from `@kidajs/router` with some additions for React integration:

### `router`

Enhanced version of `router` from `@kidajs/router` that works seamlessly with React components and layouts.

```tsx
import { router, page, layout } from '@kidajs/react-router'

const [$page] = router($location, [
  page('home', HomePage),
  layout(MainLayout, [
    page('user', UserPage),
    page('settings', SettingsPage)
  ])
])
```

### `router$$`

Enhanced version of `router$$` from `@kidajs/router` that works like `router` but with injection factories.

```tsx
import { router$$, page, layout } from '@kidajs/react-router'

const [$Page] = router$$($Location, [
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
import { app, page, layout } from '@kidajs/react-router'

const App = app($location, [
  layout(MainLayout, [
    page('home', HomePage),
    page('user', UserPage)
  ])
])
```

### `app$$`

Creates a React application component using injection factory and that should be used within dependency injection context.

```tsx
import { app, page, layout } from '@kidajs/react-router'

const [App, $StoresToPreload] = app($Location, [
  layout(MainLayout, [
    page('home', HomePage),
    page('user', UserPage)
  ])
])
```

### `Outlet`

Component that renders nested content within layouts. Use it in your layout components to specify where child components should be rendered.

```tsx
import { Outlet } from '@kidajs/react-router'

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
import { buildPaths } from '@kidajs/router'
import { link } from '@kidajs/react-router'

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
import { buildPaths } from '@kidajs/router'
import { link, preloadable } from '@kidajs/react-router'

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

### `link$$`

Creates a React component for navigation links using injection factory and that should be used within dependency injection context.

```tsx
import { buildPaths } from '@kidajs/router'
import { link } from '@kidajs/react-router'

const routes = {
  home: '/',
  user: '/users/:id'
}
const Link = link(navigation, buildPaths(routes))
```
