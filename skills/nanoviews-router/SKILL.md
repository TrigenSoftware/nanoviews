---
name: nanoviews-router
description: "Routing a nanoviews app with @nanoviews/router, the nanoviews integration of @nano_kit/router that it re-exports: the route table and browser navigation, `router` with `pageView` or `App`, pages and page modules, layouts with `Outlet`, code splitting with `loadable`, `Link` and `linkComponent` with preloading and `aria-current`, plain anchors with `listenNavigationLinks$`, the document head through `Head$`, URL-derived signals, navigation guards and scroll, the dependency injection tokens, and tests on virtual navigation. Apply when adding or changing routes, pages, layouts, links, head tags or URL-derived state in an app that imports from `@nanoviews/router`, or from `@nano_kit/router` next to `nanoviews`. How views are written is the nanoviews skill."
license: MIT
compatibility:
  - Claude Code
  - Codex
  - Cursor
  - Gemini CLI
  - GitHub Copilot
  - Windsurf
  - Cline
  - Roo Code
  - Goose
  - Continue
  - OpenCode
  - Amp
  - universal
metadata:
  author: dangreen
  tags:
    - nanoviews
    - router
    - routing
    - signals
---

# Nanoviews Router

`@nanoviews/router` re-exports all of `@nano_kit/router`, from navigation, params and paths to head descriptors and the DI tokens, and adds what renders: `router` with `pageView` or `App`, `Outlet`, `Link`, link interception and head sync. Import everything router-related from it. The current location is a signal, `router` matches it into a page signal, and the view swaps only the page while the rest stays built. The package README in `node_modules/@nanoviews/router` shows every piece and https://nano-kit.js.org/router is the guide to the core; this skill adds the conventions and the pitfalls. How views are written is the nanoviews skill.

## Setup

```ts
import { mount, main, nav, component$ } from 'nanoviews'
import { type UnknownMatchRef, browserNavigation, buildPaths, linkComponent, preloadable, ariaCurrent, router, pageView, page, layout, loadable, notFound, listenNavigationLinks$, syncPageHead$, Outlet } from '@nanoviews/router'

export const routes = { home: '/', user: '/users/:id' } as const
export const [$location, navigation] = browserNavigation(routes)
export const paths = buildPaths(routes)

export const Link = linkComponent(navigation, paths, [
  preloadable((): UnknownMatchRef[] => pages), // a function: the pages are declared later
  ariaCurrent($location)
])

const MainLayout = component$(() => main()(nav()(Link({ to: 'home' })('Home')), Outlet()))

const pages = [
  layout(MainLayout, [
    page('home', loadable(() => import('./pages/Home.js'))),
    page('user', loadable(() => import('./pages/User.js'), () => 'Loading...'))
  ]),
  notFound(() => 'Not found')
]
const $page = router($location, pages)

const App = component$(() => {
  listenNavigationLinks$(navigation) // clicks on plain anchors navigate too
  syncPageHead$($page)               // the Head$ of the matched modules

  return pageView($page)
})

mount(App, document.querySelector('#app')!)
```

## With dependency injection

```ts
import { provide } from 'nanoviews/store'
import { mount, div, nav, component$, context$ } from 'nanoviews'
import { App, Link, browserNavigation, router, enableLinkComponentPreload$, enableLinkComponentAriaCurrent$, listenLinks$, syncHead$, LocationNavigation$, Page$, Pages$ } from '@nanoviews/router'

declare module '@nano_kit/router' {
  interface AppContext {
    routes: typeof routes // types Location$, Navigation$, Paths$ and Link, once per app
  }
}

const Root = component$(() => {
  enableLinkComponentPreload$(true) // before the links it extends are built
  enableLinkComponentAriaCurrent$()
  listenLinks$()
  syncHead$()

  return div()(nav()(Link({ to: 'user', params: { id: 1 } })('Profile')), App())
})

const locationNavigation = browserNavigation(routes)
const $page = router(locationNavigation[0], pages)

mount(() => context$(
  provide(LocationNavigation$, locationNavigation),
  provide(Page$, $page),
  provide(Pages$, pages)
)(Root()), document.querySelector('#app')!)
```

- Provide `LocationNavigation$`, `Page$` and `Pages$` together at the root. `Location$`, `Navigation$`, `Paths$` and `CanGoBack$` derive from them and are injected where needed: `const navigation = inject(Navigation$)`.
- `App` and `syncHead$` need `Page$`, `enableLinkComponentPreload$` needs `Pages$`. The DI `Link` and a `Link` from `linkComponent` are different components: the `enable…$` calls extend only the DI one.

## Pages and layouts

- A page is a component, or any function that returns a child when called with no arguments. `loadable(load, fallback?)` splits it into a chunk and renders `fallback` while the chunk loads. A page module exports the component as `default` and may export `Head$`; a module that is already loaded goes in whole, `import * as Home from './Home.js'` and `page('home', Home)`, so its `Head$` is found.
- `pageView($page)` and `App` build a page anew only when another page component is matched. A change of params keeps the page, and so do two routes mapped to the same component, state included: a page reads its params through signals, never once at build.
- A layout is built once for all of its pages and renders `Outlet()` where the page goes, at any depth, in a component of its own or in a branch built later; nothing passes the page down through props or children. Layouts nest and can be `loadable`.
- What a layout and its pages inject is kept where it would be without the layout, so a store a page creates survives the layout being built anew.

## Links

- `Link({ to: 'user', params: { id: 1 } })('Profile')` builds `href` from the route and navigates on click. `params` is static and read once, or an accessor the `href` follows: `params: () => ({ id: $id() })`; a row of a `for_` tracked by id reads its id once, `params: { id: $item().id }`. `Link({ href })` takes any URL, and every other prop is an attribute of the `a`.
- A click that opens a new tab or window, a download, an external link and a click whose `onClick` called `preventDefault()` are left to the browser.
- `preloadable(pages, preloadByDefault?)` loads the page of a link on hover and focus, and `preload` on a link overrides the default. `ariaCurrent($location, isAriaCurrent?)` sets `aria-current="page"` when the pathname of the link is the current one; the predicate gets the URL of the link and the location.
- `listenNavigationLinks$(navigation)` or `listenLinks$()` routes clicks on plain anchors, from markup that is not a `Link` or a `Button({ as: a, href })`, as long as the component it is called in is mounted.

## URL state and navigation

- Derive URL state into signals once, in the router module or an injectable `Params$` factory, and read those in stores and views: `param($location, 'id', Number)`, `searchParam(searchParams($location), 'q', value => value ?? '')`. `forRoute($location, 'user', $value)` keeps a value to its route, so a query of the page being left does not get the params of the next one.
- `navigation.push(paths.user({ id: 1 }))`, `navigation.replace({ search: params.toString() })`, `navigation.back()`. A filter typed into an input replaces, so Back leaves the page instead of replaying the keystrokes.
- A guard swaps `navigation.transition` in an `effect$`, which puts the old one back on unmount, and reads its signals when asked, so it is set once:

```ts
effect$(() => {
  const { transition } = navigation

  navigation.transition = (proceed, next, prev) => {
    if (!$dirty() || confirm('Leave without saving?')) proceed(next)
  }

  return () => { navigation.transition = transition }
})
```

- `resetScroll()` and `scrollToAnchor(hash)` scroll the window. To reset on every navigation but a replace, read the whole location: `effect$((warmup) => { if (!warmup && $location().action !== 'replace') resetScroll() })`.

## Head

- `Head$` of a page or layout module returns descriptors: `title(text)`, `meta({ name, content })`, `link({ rel, href })`, `script(...)`, and `lang(value)` and `dir(value)` for the attributes of `html`. A value may be an accessor, and the tag follows it.
- `syncPageHead$($page)` or `syncHead$()` keeps the document head in sync while the component it is called in is mounted. Call it once, in the root component or the outermost layout. With DI, `Head$` runs within the injection context and may `inject`, messages or the store of the page.

## Testing

```ts
import { render } from '@nanoviews/testing-library'
import { virtualNavigation, router, pageView } from '@nanoviews/router'

const [$location, navigation] = virtualNavigation('/users/1', routes)

render(() => pageView(router($location, pages)))
navigation.push('/users/2')
```

- With DI, provide `virtualNavigation(path, routes)` as `LocationNavigation$`, with `Page$` and `Pages$` for a component test, and render `App` or the root. A store test provides `LocationNavigation$` alone and navigates through the navigation it returns.

## Pitfalls

- `title`, `meta`, `link` and `script` are head descriptors from `@nanoviews/router` and element factories from `nanoviews`: a module that needs both aliases one, `import { title as headTitle } from '@nanoviews/router'`.
- A route table kept in a variable is declared `as const`, or `params` and the path builders lose their types. `AppContext.routes` is augmented once.
- When the module of `Link` passes `pages` to `preloadable` and `pages` imports a layout that renders `Link`, TypeScript cannot infer the cycle (TS7022): pass a function with its type written out, `preloadable((): UnknownMatchRef[] => pages)`.
- The functions ending with `$` run in a component render only. `enableLinkComponentPreload$` and `enableLinkComponentAriaCurrent$` run before the links they extend are built, so in the root or the outermost layout.
- The children of the location record, `$location.$route`, `$location.$action` and the rest, are deduped: an effect that reads one wakes only when that value changes, not on every navigation.
