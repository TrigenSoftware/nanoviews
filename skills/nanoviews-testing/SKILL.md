---
name: nanoviews-testing
description: Conventions and API for unit-testing nanoviews views with @nanoviews/testing-library and Vitest: the happy-dom setup and cleanup entry, the render forms (function or [Component, props] tuple), what container is, driving value$/checked$/selected$ bindings with fireEvent, synchronous assertions after signal writes, awaiting resolved/query/onMount data, overriding dependency injection with context and provide, and rendering composed stories. Apply when writing or editing *.spec.ts files for nanoviews components, effect attributes, blocks or stores wired into views.
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
    - testing
    - testing-library
    - vitest
---

# Nanoviews Testing

`@nanoviews/testing-library` mounts a view into the document and re-exports the whole `@testing-library/dom` API (`screen`, `within`, `fireEvent`, `waitFor`, `findBy*`, `prettyDOM`). Signal writes reach the DOM synchronously, so most tests need no `await`. Describe chains and `it should` titles follow the unit-tests skill; how views are written is the nanoviews skill.

## Setup

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({ test: { environment: 'happy-dom', setupFiles: ['./test/setup.ts'] } })
```

```ts
// test/setup.ts
import '@nanoviews/testing-library/vitest'   // registers afterEach(cleanup) with Vitest's afterEach
import '@testing-library/jest-dom/vitest'    // optional matchers
```

- Dev dependencies: `vitest`, `happy-dom`, `@nanoviews/testing-library`, `@testing-library/dom`; optional `@testing-library/jest-dom`, `@testing-library/user-event`.
- Importing the package root without Vitest globals registers no cleanup; the `/vitest` entry or a manual `afterEach(cleanup)` is required. `@nanoviews/testing-library/pure` registers nothing.
- Inside the nanoviews monorepo specs import signals from `kida`; consumer tests import from `nanoviews/store`.

## Rendering

```ts
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@nanoviews/testing-library'
import { signal } from 'nanoviews/store'
import { input, value$ } from 'nanoviews'
import { Counter } from './Counter.js' // function Counter({ count }: { count: WritableSignal<number> })

describe('components', () => {
  describe('Counter', () => {
    it('should increment count on click', () => {
      const count = signal(0)
      const { container } = render([Counter, { count }])

      fireEvent.click(screen.getByRole('button'))

      expect(count()).toBe(1)
      expect(container.innerHTML).toBe('<div><button>count is 1</button></div>') // the wrapper div is the mount target
    })

    it('should bind a text input', () => {
      const value = signal('a')

      render(() => input({ type: 'text', [value$]: value }))

      const box = screen.getByRole<HTMLInputElement>('textbox')

      value('b')
      expect(box.value).toBe('b')
      fireEvent.input(box, { target: { value: 'c' } })
      expect(value()).toBe('c')
    })
  })
})
```

- `render` takes a function returning a view (`render(App)`, `render(() => Card({ id }))`) or a `[Component, ...args]` tuple. `render(Counter({ count }))` passes the built view instead: an element or block throws `Invalid block creator. Expected a function.`, a lazy child is silently mounted with its effects already started outside `mount`.
- It mounts into a fresh `<div>` appended to `document.body`; `container` is `document.body` and the mount wrapper is `container.firstElementChild`, so `container.innerHTML` starts with that `<div>` and a portalled node is a sibling of the wrapper. Queries are bound to the container; `screen` sees the same DOM.
- The result also has `destroy()` (early unmount, idempotent) and `debug()`. `RenderOptions` are `{ target?, container?, queries? }`; cleanup removes only targets sitting directly in `document.body`, a custom `container` is the test's to remove.

## Driving bindings

- `fireEvent.input(box, { target: { value } })` drives `value$`; a bare `change` does not write it.
- `fireEvent.change(box, { target: { checked: true } })` drives `checked$`, `fireEvent.change(select, { target: { value } })` drives `selected$`, `fireEvent.change` with `files` drives `files$`. `fireEvent.click` on a checkbox or radio also works because it fires `change`; a click on a `select` changes nothing.
- `fireEvent.click`, `fireEvent.keyDown(el, { key: 'Enter' })`, `fireEvent.dblClick` and `fireEvent.submit(form)` reach `on*` handlers as native events. `userEvent.setup()` plus `await user.click(...)` works as usual.
- Writing a signal the view is bound to updates the DOM before the next line runs; assert right after the write, without `await`.
- A row hidden by `show_` is detached from the document: `queryBy*` returns `null`, `toBeVisible` is not needed. A branch replaced by `if_` is gone with its state.
- A boolean attribute is absent when its value is `false`, `null` or `undefined`: assert with `toBeDisabled()`/`toBeEnabled()` or `hasAttribute`.

## Async data

- Results of `resolved`, `task`, a `@nano_kit/query` query (nano-kit-query skill) or an `onMount` fetch arrive when the promise settles. `await` the promise the test holds (hand the view a fake API that records its promises), or `await waitFor(...)` / `await screen.findBy...`, or `await waitTasks($x)` from `nanoviews/store` on a result signal that has been rendered or read (`resolved` and queries register kida tasks). After that everything is synchronous again.
- A query fetches only while its `$data` signal is mounted: rendering it mounts it; in a store test use `start($data)` then `await waitTasks($data)`.
- `onMount` cleanups run one second after the last subscriber leaves: use fake timers with `STORE_UNMOUNT_DELAY`, or assert on `onStop`.
- Module-level stores keep state between tests; reset them in `beforeEach` with `batch`.

## Dependency injection

```ts
it('should use the provided theme', () => {
  const $theme = signal<Theme>('dark')

  render(() => context([provide(Theme$, $theme)], App))  // creates the root context with the override

  expect(screen.getByTestId('card').className).toContain('card_dark')
  $theme('light')
  expect(screen.getByTestId('card').className).toContain('card_light')
})
```

- `context(providers, fn)` with no current context creates the root context with those providers; a one-argument `context(fn)` inside `App` then reuses it.
- A provided signal must have exactly the factory's return type (`signal<Theme>('dark')`, not `signal('dark')`).
- `inject` outside a context throws; `expect(() => render(ComponentThatInjects)).toThrow()` is the test for a missing root context.

## Stories in tests

`composeStories` from `@nanoviews/storybook` turns a stories module into functions whose result is exactly the tuple `render` accepts:

```ts
import { it, expect } from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'nanoviews/store'
import * as Stories from './toggle.stories.js'

const { Reactive } = composeStories(Stories)

it('should follow the arg signal', () => {
  const value = signal(true)
  const { container } = render(Reactive({ value }))   // plain values or signals, all optional

  expect(container.innerHTML).toBe('<div><b>on</b></div>')
  value(false)
  expect(container.innerHTML).toBe('<div>off</div>')
})
```

Import the stories module as a namespace; a plain arg is wrapped in a signal by the renderer, a signal arg is the handle the test drives. Writing stories is the nanoviews-storybook skill.
