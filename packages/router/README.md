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

[Nanoviews](../nanoviews#readme) integration for [@nano_kit/router](https://nano-kit.js.org/router): pages, nested layouts, code splitting, links and head management, with or without dependency injection.

- **Small**. Around 1 kB (minified and brotlied) on top of the router, and only what you import of it.
- **Direct DOM**. A layout is built once and the matched page is swapped inside it.
- **Type-safe**. Route names and params are checked in links and path builders.

```js
import { mount, main, nav, component$ } from 'nanoviews'
import { browserNavigation, buildPaths, linkComponent, router, pageView, page, layout, loadable, Outlet } from '@nanoviews/router'

const routes = {
  home: '/',
  user: '/users/:id'
}
const [$location, navigation] = browserNavigation(routes)
const Link = linkComponent(navigation, buildPaths(routes))

const MainLayout = component$(() => (
  main()(
    nav()(
      Link({ to: 'home' })('Home'),
      Link({ to: 'user', params: { id: 1 } })('User')
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

mount(() => pageView($page), document.querySelector('#app'))
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#pages">Pages</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#layouts">Layouts</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#links">Links</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#head">Head</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#dependency-injection">Dependency injection</a>
<br />
<hr />

## Install

```bash
pnpm add nanoviews @nano_kit/store @nano_kit/router @nanoviews/router
# or
npm i nanoviews @nano_kit/store @nano_kit/router @nanoviews/router
# or
yarn add nanoviews @nano_kit/store @nano_kit/router @nanoviews/router
```

`@nanoviews/router` re-exports everything from `@nano_kit/router`: navigation, params, paths, head descriptors and the rest are imported from here. Their guide is the [router documentation](https://nano-kit.js.org/router), this page covers what is specific to Nanoviews.

## Pages

A page is a component, or any function that returns a child when called with no arguments. `router` matches the current location against the pages and returns an accessor of the matched one, and `pageView` renders it:

```js
import { mount, div, component$ } from 'nanoviews'
import { browserNavigation, router, pageView, page, notFound } from '@nanoviews/router'

const [$location, navigation] = browserNavigation({
  home: '/',
  about: '/about'
})
const HomePage = component$(() => div()('Home'))
const AboutPage = component$(() => div()('About'))

const $page = router($location, [
  page('home', HomePage),
  page('about', AboutPage),
  notFound(() => div()('Not found'))
])

mount(() => pageView($page), document.querySelector('#app'))

navigation.push('/about') // <div>About</div>
```

The page is built anew when another page is matched, and stays as it is when only the params change: `/users/1` and `/users/2` are the same page, which reads the params from the location.

`loadable` splits a page into its own chunk. The optional second argument is a page to render while the chunk is loading:

```js
import { div } from 'nanoviews'
import { page, loadable } from '@nanoviews/router'

const Loader = () => div()('Loading...')

page('about', loadable(() => import('./pages/About.js'), Loader))
```

## Layouts

A layout is a component that renders `Outlet` where the matched page goes:

```js
import { main, header, component$ } from 'nanoviews'
import { router, page, layout, Outlet } from '@nanoviews/router'

const AuthLayout = component$(() => (
  main()(
    header()('Welcome'),
    Outlet()
  )
))

const $page = router($location, [
  page('home', HomePage),
  layout(AuthLayout, [
    page('login', LoginPage),
    page('register', RegisterPage)
  ])
])
```

The layout is built once for all of its pages: from `login` to `register` only the page at the `Outlet` is swapped, the header and everything else the layout holds stay in place. It is built anew once a page outside it is matched. Layouts nest, and a layout can be `loadable` too; its fallback is rendered as the page while the layout is loading.

`Outlet` can stand at any depth of the layout, in a component of its own or in a branch built later, so the page is not passed down through props or children:

```js
import { main, aside, section, component$ } from 'nanoviews'
import { Outlet } from '@nanoviews/router'

const Content = component$(() => section({ class: 'content' })(Outlet()))

const AppLayout = component$(() => (
  main()(
    aside()('Menu'),
    Content()
  )
))
```

A layout provides nothing but its outlet, so what the layout and its pages inject is kept where it would be without the layout: a store that a page creates survives the layout being built anew.

## Links

`linkComponent` creates a `Link` component for a navigation. It takes a route name in `to` and its params in `params`, builds the `href` from them and navigates without a page reload on click:

```js
import { buildPaths, linkComponent } from '@nanoviews/router'

const Link = linkComponent(navigation, buildPaths(routes))

Link({ to: 'user', params: { id: 1 } })('Profile') // <a href="/users/1">Profile</a>
Link({ href: 'https://github.com' })('GitHub')
```

The params can be an accessor, and the `href` follows it:

```js
Link({ to: 'user', params: () => ({ id: $userId() }) })('Profile')
```

A click that opens a new tab or a window, a download, an external link and a click the `onClick` of the link cancelled are left to the browser.

The third argument extends the links:

- `preloadable(pages, preloadByDefault?)` loads the page of a link on hover and focus. A link opts in or out with its `preload` prop, `preloadByDefault` is the default.
- `ariaCurrent($location, isAriaCurrent?)` sets `aria-current="page"` on a link to the current location. The predicate takes the URL of the link and the location, and compares their pathnames by default.

```js
import { buildPaths, linkComponent, preloadable, ariaCurrent } from '@nanoviews/router'

const Link = linkComponent(navigation, buildPaths(routes), [
  preloadable(pages),
  ariaCurrent($location)
])

Link({ to: 'user', params: { id: 1 }, preload: true })('Profile')
```

Plain anchors are routed too while `listenNavigationLinks$` intercepts their clicks on the document. It is called in a component render and listens as long as the component is mounted:

```js
import { component$ } from 'nanoviews'
import { listenNavigationLinks$, pageView } from '@nanoviews/router'

const App = component$(() => {
  listenNavigationLinks$(navigation)

  return pageView($page)
})
```

## Head

A page module can describe the document head with a `Head$` factory. `syncPageHead$` keeps the head in sync with the matched page as long as the component it is called in is mounted:

```js
// pages/About.js
import { div, component$ } from 'nanoviews'
import { title, meta } from '@nanoviews/router'

export function Head$() {
  return [
    title('About'),
    meta({ name: 'description', content: 'About the app' })
  ]
}

export default component$(() => div()('About'))
```

```js
import { component$ } from 'nanoviews'
import { syncPageHead$, pageView } from '@nanoviews/router'

const App = component$(() => {
  syncPageHead$($page)

  return pageView($page)
})
```

## Dependency injection

The router can take its navigation and pages from the injection context instead of module scope. Provide them with `context$` at the root, and the components below read them there:

```ts
import { provide } from 'nanoviews/store'
import { mount, context$ } from 'nanoviews'
import { App, browserNavigation, router, LocationNavigation$, Page$, Pages$ } from '@nanoviews/router'
import { routes } from './routes.js'
import { pages } from './pages.js'

declare module '@nano_kit/router' {
  interface AppContext {
    routes: typeof routes
  }
}

const locationNavigation = browserNavigation(routes)
const [$location] = locationNavigation
const $page = router($location, pages)

mount(() => context$(
  provide(LocationNavigation$, locationNavigation),
  provide(Page$, $page),
  provide(Pages$, pages)
)(App()), document.querySelector('#app'))
```

The `AppContext` declaration types the routes for everything that reads them from the context.

- `App` renders the page of `Page$`.
- `Link` is the Link component for `Navigation$`: `Link({ to: 'user', params: { id: 1 } })('Profile')`.
- `enableLinkComponentPreload$(preloadByDefault?)` and `enableLinkComponentAriaCurrent$(isAriaCurrent?)` extend `Link` the way `preloadable` and `ariaCurrent` extend a `linkComponent`, with the pages of `Pages$` and the location of `Location$`.
- `listenLinks$()` intercepts clicks on plain anchors with `Navigation$`, and `syncHead$()` syncs the head with the page of `Page$`, resolving the `Head$` factories within the injection context. Both last as long as the component they are called in.

Like `effect$`, the functions ending with `$` are called in a component render, these ones before the links they extend are built. Here `Root()` is what goes into `context$` in place of `App()`:

```js
import { div, nav, component$ } from 'nanoviews'
import { App, Link, enableLinkComponentAriaCurrent$, syncHead$ } from '@nanoviews/router'

const Root = component$(() => {
  enableLinkComponentAriaCurrent$()
  syncHead$()

  return div()(
    nav()(
      Link({ to: 'home' })('Home'),
      Link({ to: 'user', params: { id: 1 } })('Profile')
    ),
    App()
  )
})
```

The rest of the router is injected directly:

```js
import { inject } from 'nanoviews/store'
import { button, component$ } from 'nanoviews'
import { Location$, Navigation$, CanGoBack$, Paths$ } from '@nanoviews/router'

const BackButton = component$(() => {
  const navigation = inject(Navigation$)
  const $canGoBack = inject(CanGoBack$)

  return button({
    disabled: () => !$canGoBack(),
    onClick() {
      navigation.back()
    }
  })('Back')
})
```
