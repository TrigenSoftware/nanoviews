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
import { browserNavigation, router, match, page, layout, Outlet } from '@kidajs/react-router'

// Setup navigation and router
const [$location, navigation] = browserNavigation()
const $route = router($location, {
  home: '/',
  user: '/users/:id'
})

// Define components
function HomePage() {
  return <div>Welcome Home!</div>
}

function UserPage() {
  const route = useSignal($route)

  return <div>User ID: {route?.params.id}</div>
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

// Setup page matching with React components
const $page = match($route, [
  layout(Layout, [
    page('home', HomePage),
    page('user', UserPage)
  ])
])

function App() {
  const Page = useSignal($page)

  return Page ? <Page /> : <div>Not Found</div>
}
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

### `match`

Enhanced version of `match` from `@kidajs/router` that works seamlessly with React components and layouts.

```tsx
import { match, page, layout } from '@kidajs/react-router'

const $page = match($route, [
  page('home', HomePage),
  layout(MainLayout, [
    page('user', UserPage),
    page('settings', SettingsPage)
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
