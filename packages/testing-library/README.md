# @nanoviews/testing-library

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nanoviews/testing-library.svg
[npm-url]: https://npmjs.com/package/@nanoviews/testing-library

[deps]: https://img.shields.io/librariesio/release/npm/@nanoviews/testing-library
[deps-url]: https://libraries.io/npm/@nanoviews%2Ftesting-library

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

Testing utilities for [Nanoviews](../nanoviews#readme), built on [Testing Library](https://testing-library.com/docs/dom-testing-library/intro).

- **Testing Library**. Re-exports the whole `@testing-library/dom` API, so `render`, `screen` and `fireEvent` come from a single import.
- **Stories**. A story composed with [`@nanoviews/storybook`](../storybook#readme) goes straight into `render`, args and all.
- **TypeScript**-first.

```js
import { it, expect } from 'vitest'
import { render, screen, fireEvent } from '@nanoviews/testing-library'
import { signal } from 'nanoviews/store'
import { button } from 'nanoviews'

function Counter({ count }) {
  return (
    button({
      onClick() {
        count(count() + 1)
      }
    })(
      'count is ', count
    )
  )
}

it('should increment count on click', () => {
  const count = signal(0)

  render([Counter, { count }])

  const counter = screen.getByRole('button')

  expect(counter.textContent).toBe('count is 0')

  fireEvent.click(counter)

  expect(counter.textContent).toBe('count is 1')
})
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#setup">Setup</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#usage">Usage</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#testing-stories">Testing stories</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#api">API</a>
<br />
<hr />

## Install

```bash
pnpm add -D @nanoviews/testing-library @testing-library/dom
# or
npm i -D @nanoviews/testing-library @testing-library/dom
# or
yarn add -D @nanoviews/testing-library @testing-library/dom
```

## Setup

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts']
  }
})
```

```ts
// test/setup.ts
import '@nanoviews/testing-library/vitest'
import '@testing-library/jest-dom/vitest'
```

### Auto cleanup

Every rendered view has to be unmounted after a test, otherwise views leak into the next one. There are four ways to get that:

1. `@nanoviews/testing-library/vitest` — a side effect only module that registers `afterEach(cleanup)` with the `afterEach` hook imported from `vitest`. This is the option to use with Vitest, since its default `globals: false` config has no global hooks.
2. Importing the package root registers `afterEach(cleanup)` on its own, but only when the test runner exposes a **global** `afterEach` — Jest, or Vitest with `globals: true`. Set the `NTL_SKIP_AUTO_CLEANUP` env variable to opt out of it:

    ```bash
    NTL_SKIP_AUTO_CLEANUP=1 vitest run
    ```

    > [!NOTE]
    > The opt out is read from `process.env`, so it only applies where a `process` global exists — Node based environments like happy-dom and jsdom. Without one, as in browser mode, auto cleanup simply stays on.

3. Wiring the hook by hand:

    ```ts
    import { afterEach } from 'vitest'
    import { cleanup } from '@nanoviews/testing-library'

    afterEach(cleanup)
    ```

4. `@nanoviews/testing-library/pure` — the same API with no hook registered at all. Import it instead of the package root when a test file wants to own the teardown completely:

    ```ts
    import { render, cleanup } from '@nanoviews/testing-library/pure'
    ```

## Usage

`render` accepts a function that returns a view:

```js
import { it, expect } from 'vitest'
import { render } from '@nanoviews/testing-library'
import { signal } from 'nanoviews/store'
import { button, ref$ } from 'nanoviews'

it('should set ref', () => {
  const ref = signal(null)

  render(() => (
    button({
      [ref$]: ref
    })(
      'Click me!'
    )
  ))

  expect(ref()).toBeInstanceOf(HTMLButtonElement)
})
```

...or a component with its arguments as a `[component, ...args]` tuple:

```js
const { getByRole } = render([Counter, { count }])

expect(getByRole('button').textContent).toBe('count is 0')
```

The view is mounted into a `<div>` appended to the container, and the container is `document.body` by default. Queries are bound to the **container**, so they can be either destructured from the `render` result or taken from `screen` — both query the same element:

```js
import { render, screen } from '@nanoviews/testing-library'

render([Counter, { count }])

screen.getByRole('button')
```

Reactivity needs no special treatment: a signal write is applied to the DOM synchronously, so the assertion can go right after it.

```js
import { it, expect } from 'vitest'
import { render, screen, fireEvent } from '@nanoviews/testing-library'
import { signal } from 'nanoviews/store'
import { input, value$ } from 'nanoviews'

it('should handle value of text input', () => {
  const value = signal('Hello, world!')

  render(() => (
    input({
      type: 'text',
      [value$]: value
    })
  ))

  const textbox = screen.getByRole('textbox')

  expect(textbox.value).toBe('Hello, world!')

  value('Hello, nanoviews!')

  expect(textbox.value).toBe('Hello, nanoviews!')

  fireEvent.input(textbox, {
    target: { value: 'user input' }
  })

  expect(value()).toBe('user input')
})
```

`@testing-library/user-event` works against rendered elements as usual — `Counter` here is the component from the top of this README:

```js
import { it, expect } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { render } from '@nanoviews/testing-library'
import { signal } from 'nanoviews/store'

it('should increment count on click', async () => {
  const user = userEvent.setup()
  const count = signal(0)
  const { getByRole } = render([Counter, { count }])

  await user.click(getByRole('button'))

  expect(count()).toBe(1)
})
```

## Testing stories

[`composeStories`](../storybook#readme) applies the meta and the project annotations to every story of a module and hands back a function per story. Calling it gives `render` everything it needs, so a story goes into a test as is:

```js
import { it, expect } from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import * as Stories from './classList.stories.js'

const { StaticValue } = composeStories(Stories)

it('should render static class list', () => {
  const { container } = render(StaticValue())

  expect(container.innerHTML).toBe('<div><div class="class1 class3">Hello, world!</div></div>')
})
```

The extra `<div>` in `container.innerHTML` is the element the view was mounted into: `container` here is `document.body`, and the target `<div>` is created by `render` inside of it.

`composeStory` does the same for a single story, taking the story and its meta instead of a whole module.

### Args

Args passed to a composed story override the ones from the story and the meta, and they can be **plain values or signals** — either way the story stays reactive, because the renderer turns every plain arg into a writable signal before the story sees it. So `ReactiveValue` from the same module takes plain values just fine:

```js
const { container } = render(ReactiveValue({ primary: false, rounded: true }))

expect(container.innerHTML).toBe('<div><button class="button regular rounded">Hello, world!</button></div>')
```

Pass a **signal** for an arg the test needs to drive: the test keeps the handle, so writing to it updates the rendered view. The two kinds mix freely within one call:

```js
import { it, expect } from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'nanoviews/store'
import * as Stories from './classList.stories.js'

const { ReactiveValue } = composeStories(Stories)

it('should render partially reactive class list', () => {
  const primary = signal(true)
  const { container } = render(ReactiveValue({ primary, rounded: true }))

  expect(container.innerHTML).toBe('<div><button class="button primary rounded">Hello, world!</button></div>')

  primary(false)

  expect(container.innerHTML).toBe('<div><button class="button regular rounded">Hello, world!</button></div>')
})
```

An arg left out entirely falls back to the story's own `args`, wrapped in a signal just the same.

## API

### render

Mounts a view into the document and returns handles to it, along with all the `@testing-library/dom` queries bound to the container.

The first argument is either a function that returns a view, or a `[component, ...args]` tuple — the component is then called with the rest of the tuple as arguments. A [called composed story](#testing-stories) already has that shape, so it can be passed straight in. Anything else throws `Invalid block creator. Expected a function.` If mounting itself throws, a target sitting directly in `document.body` is removed and the error is rethrown.

The result contains:

- `container` — the element the queries are bound to, `document.body` unless `renderOptions.container` was passed. Note that the view is mounted into `target`, not directly into the container.
- `debug(el = container)` — prints the DOM of the element with `prettyDOM`.
- `destroy()` — unmounts this view early. It is idempotent, and it leaves the target element in the document; removing the element is `cleanup`'s job.
- all the [queries](https://testing-library.com/docs/queries/about) — `getBy*`, `queryBy*`, `findBy*` and their `*All*` variants, bound to `container`.

```js
const { container, debug, destroy } = render(() => div()('bye'))

debug() // logs the pretty printed container

expect(container.innerHTML).toBe('<div><div>bye</div></div>')

destroy()

expect(container.innerHTML).toBe('<div></div>')
```

### RenderOptions

The optional second argument of `render`:

- `target` — the element to mount the view into. Defaults to a new `<div>` appended to the container.
- `container` — the element to bind the queries to and to append the target to. Defaults to `document.body`.
- `queries` — a [custom set of queries](https://testing-library.com/docs/dom-testing-library/api-custom-queries) to bind instead of the default ones.

```js
const container = document.body.appendChild(document.createElement('main'))
const target = container.appendChild(document.createElement('section'))
const { getByText } = render(() => div()('x'), { target, container })

expect(container.innerHTML).toBe('<section><div>x</div></section>')
```

### cleanup

Unmounts every view rendered by `render` and removes the target elements from `document.body`. Views already unmounted with `destroy` are skipped, so calling it more than once is safe.

> [!NOTE]
> Only elements sitting directly in `document.body` are removed. A custom `container` — and the target inside of it — stays in the document, so a test that builds its own container tears it down itself.

### Testing Library re-exports

The whole `@testing-library/dom` API is re-exported from the package root, so there is no need to import it separately: `screen`, `within`, `fireEvent`, `createEvent`, `waitFor`, `waitForElementToBeRemoved`, `prettyDOM`, `logRoles`, `configure` and everything else, including types. See the [DOM Testing Library docs](https://testing-library.com/docs/dom-testing-library/api) for the full list.
