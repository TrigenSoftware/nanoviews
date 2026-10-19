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
  docs:
    paths:
      - router
---

# Nanoviews Router

`@nanoviews/router` is the nanoviews integration of `@nano_kit/router`: it re-exports the whole core and adds what renders, `router` with `pageView` or `App`, `Outlet`, `Link`, link interception and head sync. How views are written is the nanoviews skill.

## Reference

`DOCS.md` next to this file is the documentation of the released package as published on https://nanoviews.js.org, generated from the site sources. Read its relevant sections for exact signatures, props and examples before writing code. The core it re-exports, from the route syntax, optional params and splats to transitions, `ScrollRestorator` and `basePath`, is documented at https://nano-kit.js.org/router/ and in the nano-kit-react-router skill. This skill adds only conventions, choices and pitfalls.

## Mental model

- The location is a signal, `router` matches it into a page signal, and `pageView` or `App` swaps only the page: the layouts around it stay built, and so does the page while only its params change, or between two routes mapped to it. So pages, stores and `Head$` read the URL through signals derived once from the location, never once when they are built.

## Setup shapes

- **Module scope**: `router.ts` exports the route table `as const`, `[$location, navigation] = browserNavigation(routes)`, `paths = buildPaths(routes)` and the URL-state signals, `pages.ts` the page list, and `Link.ts` the `linkComponent(navigation, paths, [preloadable((): UnknownMatchRef[] => pages), ariaCurrent($location)])`. The root module creates `$page = router($location, pages)` once and mounts `pageView($page)`, and the outermost layout, declared in the pages, calls `listenNavigationLinks$(navigation)` and `syncPageHead$($page)` around its `Outlet()`.
- **Dependency injection**: `main.ts` creates one `browserNavigation(routes)` and one `router($location, pages)` and provides `LocationNavigation$`, `Page$` and `Pages$` together in the root `context$` around `App()`, which is what goes into `mount`. The outermost layout, declared in the pages, calls `enableLinkComponentPreload$(true)`, `enableLinkComponentAriaCurrent$()` and `syncHead$()` and renders the navigation and `Outlet()`. Views use the DI `Link`, inject the tokens in the render, and take URL state from a `Params$` factory that injects `Location$`.
- Take dependency injection when each test or story must give the views a navigation of its own, module scope otherwise. Either way the routes and the pages live in modules of their own, so that pages, links and stores import them without the app. The DI `Link` and a `linkComponent` link are different components: the `enable…$` calls extend only the DI one.
- Import everything router-related from `@nanoviews/router`, which types `page`, `layout`, `loadable` and `notFound` for nanoviews pages and composes layouts in its `router`: the `router` of `@nano_kit/router` rejects layouts and renders nothing for their pages.

## Dependency injection

- Augment `AppContext.routes` once per app, with `declare module '@nano_kit/router'` in `main.ts` or next to the routes. Without it `provide(LocationNavigation$, browserNavigation(routes))` is a type error and the DI `Link` takes any `to` and no `params`; a second augmentation with another table is TS2717.
- `App` and `syncHead$()` need `Page$`; a link that preloads needs `Pages$` when it is built.
- The `enable…$` calls extend only the links built after them, not one of an earlier sibling: call them in the outermost layout, before its links. A hook of your own, `inject(LinkSettings$).addHook(hook)`, is defined at module scope: one created in the render is added again on every build.

## Links

- An in-app link is `Link({ to, params })`, checked against the routes, and a URL built in code comes from the path builders, `paths.user({ id: 1 })`, never by hand. `Link({ href })` takes any URL.
- Static `params` are read once, when the link is built, which is enough for a `for_` row tracked by id. Params that change are an accessor: `params: () => ({ id: $userId() })`.
- A plain `a`, from markup or a component such as a button with `as: a`, navigates without a reload only under `listenNavigationLinks$` or `listenLinks$`.
- To leave a same-origin link to the browser, give it `target: '_self'` or `rel: 'external'` exactly: `rel: 'external noopener'`, a named `target` and an empty `download` are routed.
- `ariaCurrent` compares pathnames only, so a link to another site with the pathname `/` is current on `/`: give it an `aria-current` of its own, `'aria-current': false`, which the hook leaves.

## Pages, layouts and head

- A page or layout module exports the view as `default` and may export `Head$`. It goes in as `loadable(() => import('./pages/User.js'))`, or whole when imported eagerly, `import * as Main from './layouts/Main.js'` and `layout(Main, [...])`: `Main.default` alone drops the `Head$`.
- `Head$` does not run again when only the params change, and under an injection context it runs once per page: a tag that follows state takes an accessor, ``title(() => `User ${$userId()}`)``. `syncPageHead$($page)` or `syncHead$()` is called once, in the outermost layout.
- A page that injects needs a root context above the router view, `context$()` or the providers of the DI shape. Without one, a page in a layout injects into the context of the layout's outlet and its store goes with the layout, and a page outside a layout throws.

## URL state and navigation

- URL state is derived once, in `router.ts` or `Params$`, and parsed in the parser: `param($location, 'id', Number)`, `searchParam($searchParams, 'q', value => value ?? '')`. Views and stores read those signals, never `location` or a URL they parse themselves.
- A param that a store or a query keys on goes through `forRoute($location, 'user', $value)`, so the page being left does not get the params of the next one.
- The fields of `$location` wake only when their value changes, except `$location.$params`, a new object on every navigation: one param is read with `param`.
- `replace` a filter typed into an input and a redirect, so Back neither replays the keystrokes nor lands on the redirect; `push` the rest.
- A scroll effect reads the whole location, `$location()`, before it looks at `warmup`. One on `$location.$action` alone misses the second of two pushes, and `if (!warmup && $location().action !== 'replace')` reads nothing on its first run and never runs again.

## Testing

- Routed views are tested on `virtualNavigation(path, routes)`, one per test. With dependency injection it is provided as `LocationNavigation$`, with `Page$` and `Pages$` for a component test that renders `App`; a store test provides `LocationNavigation$` alone. A click on a link and a push apply at once; only the first load of a `loadable` chunk is awaited, with `findBy*`.
- Pages of the module-scope shape read the location of the app, which a `virtualNavigation` of the test does not reach: the test drives the `navigation` of the app and puts it back in `beforeEach`, `navigation.replace('/')`.

## Pitfalls

- `title`, `meta`, `link` and `script` are head descriptors from `@nanoviews/router` and element factories from `nanoviews`, and `nanoviews/svg` has a `title` and a `script` too: a module that needs both aliases one, `import { title as headTitle } from '@nanoviews/router'`.
- A route table kept in a variable is declared `as const`, or `param`, the path builders and the `params` of a link lose the params of the routes. A table written inline keeps them.
- When `Link.ts` passes `pages` to `preloadable` and `pages` imports a layout that renders `Link`, TypeScript cannot infer the cycle (TS7022), and an app that imports the pages before `Link.ts` throws `Cannot access 'pages' before initialization`. Pass a function with its type written out, `preloadable((): UnknownMatchRef[] => pages)`: it is called only when a link that preloads is built.
- `listenNavigationLinks$`, `syncPageHead$`, `listenLinks$`, `syncHead$` and the `enable…$` calls run in a component render only and throw at module level or in a handler; outside a component, `listenLinks(navigation)` and `syncHead($page, context?)` start at once and return the stop. A function of your own that calls `inject` or `effect$` ends with `$` too, and `Head$` and `Params$` are factories, named `Name$`.

## Related skills

- nanoviews: views, components, `effect$`, `context$` and `inject`.
- nanoviews-testing: `render`, queries and events of the tests above.
- nanoviews-storybook: stories, where a view of the DI shape gets the router tokens from a decorator that provides them, as a test does.
- nano-kit-react-router and https://nano-kit.js.org/router/: the router core this package re-exports.
- nano-kit-store: signals and dependency injection. nano-kit-query: queries keyed by URL state. nano-kit-intl: messages in `Head$`. nano-kit-platform-web: browser API signals.
