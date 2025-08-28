# @kidajs/router

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@kidajs/router.svg
[npm-url]: https://npmjs.com/package/@kidajs/router

[deps]: https://img.shields.io/librariesio/release/npm/@kidajs/router
[deps-url]: https://libraries.io/npm/@kidajs/router/tree

[size]: https://deno.bundlejs.com/badge?q=@kidajs/router
[size-url]: https://bundlejs.com/?q=@kidajs/router

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

A small and powerful router for [Kida](https://github.com/TrigenSoftware/nanoviews/tree/main/packages/kida) state manager.

- **Small**. Around 2 kB (minified and brotlied). Zero dependencies except Kida.
- **Type-safe**. Full TypeScript support with type inference for routes and parameters.
- **Signal-based**. Built on top of Kida's reactive signals for automatic UI updates.
- **Flexible**. Supports nested layouts, parameterized routes, wildcards, and query parameters.
- **SSR-ready**. Works seamlessly with server-side rendering.

```ts
import { browserNavigation, router, match, page, layout } from '@kidajs/router'

// Setup navigation
const [$location, navigation] = browserNavigation()
// Create router
const $route = router($location, {
  home: '/',
  user: '/users/:id',
  userPosts: '/users/:id/posts',
  admin: '/admin/*'
})
// Setup page component matching
const $page = match($route, [
  page('home', HomePage),
  page('user', UserPage),
  layout(AdminLayout, [
    page('admin', AdminPage)
  ])
], composeLayoutFunction)

effect(() => {
  const PageComponent = $page()
  // Render PageComponent in your app
})
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#basics">Basics</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#extras">Extras</a>
<br />
<hr />

## Install

```bash
pnpm add kida @kidajs/router
# or
npm i kida @kidajs/router
# or
yarn add kida @kidajs/router
```

## Basics

### Navigation

First, you need to set up navigation. "Navigation" consists of a signal for the current location and methods to change it:

```ts
import { effect } from 'kida'
import { browserNavigation } from '@kidajs/router'

const [$location, navigation] = browserNavigation()

// Listen to location changes
effect(() => {
  console.log('Current location:', $location())
})

// Navigate programmatically
navigation.push('/users/123')
navigation.replace('/users/456')
navigation.back()
navigation.forward()
```

Besides browser navigation, you can also use virtual navigation for testing or SSR:

```ts
import { virtualNavigation } from '@kidajs/router'

const [$location, navigation] = virtualNavigation('/initial-path')

navigation.push('/new-path')
$location().action // 'push'
navigation.replace('/another-path')
$location().action // 'replace'
```

To listen links clicks and navigate automatically, use the `listenLinks` navigation enhancer:

```ts
import { browserNavigation, listenLinks } from '@kidajs/router'

const [$location, navigation] = browserNavigation(listenLinks)

// Now all <a href> clicks will be handled by the router
```

### Router

To create a router, define your route patterns and pass them along with the location signal to the `router` function:

```ts
import { effect } from 'kida'
import { browserNavigation, router } from '@kidajs/router'

const [$location, navigation] = browserNavigation()
const $route = router($location, {
  home: '/',
  about: '/about',
  user: '/users/:id', // Required parameter
  post: '/posts/:id/:slug?', // Optional parameter
  admin: '/admin/*' // Wildcard
})

// Listen to route changes
effect(() => {
  console.log('Current route:', $route())
})

navigation.push('/users/123')
// Current route: { route: 'user', params: { id: '123' } }
navigation.push('/posts/456/hello-world')
// Current route: { route: 'post', params: { id: '456', slug: 'hello-world' } }
navigation.push('/admin/settings/profile')
// Current route: { route: 'admin', params: { wildcard: 'settings/profile' } }
```

### Page matcher

To map routes to page components, use the `match` function:

```ts
import { effect } from 'kida'
import { browserNavigation, router, match, page, layout } from '@kidajs/router'

const [$location, navigation] = browserNavigation()
const $route = router($location, {
  home: '/',
  user: '/users/:id',
  login: '/login',
  register: '/register',
  admin: '/admin/*'
})
const $page = match($route, [
  layout(MainLayout, [
    page('home', HomePage),
    page('user', UserPage)
    layout(UnauthLayout, [
      page('login', LoginPage)
      page('register', RegisterPage)
    ])
  ]),
  layout(AdminLayout, [
    page('admin', AdminPage)
  ])
], composeLayoutFunction)

effect(() => {
  const PageComponent = $page()
  // Render PageComponent in your app
})
```

You can compose layouts and pages using the `layout` function, allowing for nested structures. To let it work, provide a `composeLayoutFunction` that combines layout and page components. Here is a simple example for React:

```tsx
import { usSignal } from '@kidajs/react'

function composeLayoutFunction($nested, Layout) {
  return function Composed() {
    const Nested = usSignal($nested)

    return (
      <Layout>
        <Nested />
      </Layout>
    )
  }
}
```

## Extras

### `buildPaths`

The `buildPaths` function helps to generate URLs based on route names and parameters:

```ts
import { buildPaths } from '@kidajs/router'

const paths = buildPaths({
  home: '/',
  user: '/users/:id',
  post: '/posts/:id/:slug?',
  admin: '/admin/*'
})

paths.home // '/'
paths.user({ id: '123' }) // '/users/123'
paths.post({ id: '456' }) // '/posts/456'
paths.post({ id: '456', slug: 'hello-world' }) // '/posts/456/hello-world'
paths.admin({ wildcard: 'settings/profile' }) // '/admin/settings/profile'
```

### `updateHref`

The `updateHref` function allows you to update parts of a URL string easily:

```ts
import { updateHref } from '@kidajs/router'

updateHref('/new-path', { search: 'foo=bar' }) // '/new-path?foo=bar'
updateHref('/auth?token=***', { pathname: '/' }) // '/?token=***'
updateHref('/posts?page=2', { searrchParams: new URLSearchParams({ page: '3' }) }) // '/posts?page=3'
```

### `searchParams`

The `searchParams` function manages URL query parameters reactively:

```ts
import { browserNavigation, searchParams } from '@kidajs/router'

const [$location, navigation] = browserNavigation()
const $searchParams = searchParams($location)

$searchParams() // URLSearchParams instance
$searchParams().get('foo') // Get 'foo' query parameter
```

### `searchParam`

The `searchParam` function creates a signal for a specific query parameter:

```ts
import { browserNavigation, searchParams, searchParam } from '@kidajs/router'

const [$location, navigation] = browserNavigation()
const $params = searchParams($location)
// Get 'foo' query parameter
const $foo = searchParam($params, 'foo')
// Get 'foo' param and parse it as number
const $fooNumber = searchParam($params, 'foo', Number)
```

### `routeParam`

The `routeParam` function creates a signal for a specific route parameter:

```ts
import { browserNavigation, router, routeParam } from '@kidajs/router'

const [$location, navigation] = browserNavigation()
const $route = router($location, {
  user: '/users/:id'
})
// Get 'id' route parameter and parse it as number
const $userId = routeParam($route, 'id', Number)
```
