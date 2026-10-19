---
name: nanoviews-testing
description: "Conventions and API for unit-testing nanoviews views with @nanoviews/testing-library and Vitest: the happy-dom setup and cleanup entry, what render takes (a function returning a view, a component instance among them), what container is, driving value and checked bindings with fireEvent, synchronous assertions after signal writes, awaiting resolved/query/onMount data, overriding dependency injection with context$ and provide, and rendering composed stories. Apply when writing or editing *.spec.ts files for nanoviews components, blocks or stores wired into views."
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
  docs:
    paths:
      - testing
---

# Nanoviews Testing

`@nanoviews/testing-library` mounts a nanoviews view for a test, unmounts it after the test and re-exports the whole `@testing-library/dom` API. Tests run on Vitest in happy-dom; how the views are written is the nanoviews skill.

## Reference

`DOCS.md` next to this file is the documentation of the released package as published on https://nanoviews.js.org, generated from the site sources. Read its relevant sections for the exact setup, render forms, events, waits and DI overrides before writing a test. This skill adds only conventions, choices and pitfalls.

## Conventions

- Spec files, `describe` chains and `it('should ...')` titles follow the unit-tests skill (TrigenSoftware/scripts): a `*.spec.ts` next to the unit, one nested `describe` per segment of its address, `it`, never `test`.
- `render`, `screen`, `fireEvent` and the rest of DOM Testing Library come from `@nanoviews/testing-library`, signals and DI from `nanoviews/store`. In this monorepo the `nanoviews` package specs take signals and DI from the package `nanoviews/store` re-exports, and views from the relative sources, and render a unit that has a `*.stories.ts` through its composed stories where one covers the case; the `@nanoviews/router` specs import like a consumer.
- The test owns the state: it creates the signals, hands them in as props or providers, and asserts both the DOM and the signals.
- Render your own component as an instance, `render(Counter({ $count }))`: `render` builds it under `mount`, and its props are type-checked.
- A view written in a test takes the block layout and the naming of the nanoviews skill inside `render(() => (` ... `))`: the attributes one per line, `})(` or `()(` ends the line, the children indented, `)` on its own line, and a signal the test makes takes the `$`, `$count`.

## Mental model

- Synchronous: when a signal write or a `fireEvent` call returns, the DOM is updated. Assert on the next line, without `await`; waits are for promises and the `select` cases below.
- `container` is `document.body` by default, and the view sits in a fresh `<div>` in it: `container.innerHTML` is `'<div>...</div>'`, and a `portal` into the body lands next to that `<div>`.
- Blocks detach rather than hide: a hidden `show_` child is out of the document, an `if_` branch switched away from is gone with its state. Assert absence with `queryBy*` returning `null`.

## Setup

- Under Vitest's default `globals: false` the package root registers no cleanup, and views leak into the next test: import `@nanoviews/testing-library/vitest` in the setup file.
- happy-dom has no `defaultSelected` on `option`: a test of `defaultValue` on a `select` needs the shim of DOCS.md (A Plain `value` of `select`) in the setup file, as `packages/nanoviews/test/setup.ts` has it.
- Under Vitest 5 the jest-dom matchers run but are untyped, so `toBeInTheDocument()` is a type error: add the `Matchers` declaration of DOCS.md (Setup) in a file the tsconfig `include` covers.

## Driving bindings

| Binding | Fire |
| --- | --- |
| `value` of `input`, `textarea` | `fireEvent.input(el, { target: { value } })`; a bare `change` writes nothing |
| `checked` | `fireEvent.click(el)` or `fireEvent.change(el, { target: { checked } })` |
| `value` of `select` | `fireEvent.change(el, { target: { value } })`; a click on it or on an option writes nothing |
| Files | no binding: `fireEvent.change(el, { target: { files } })` reaches `onChange` |

A `select` picks its option a microtask after the options land: under a plain `value`, and under any `value` for options that `for_` or async data add later. `await Promise.resolve()` before asserting `select.value`.

## Async data

- Pick the wait by what the test holds, and everything after it is synchronous again: the promise of a fake API it handed in, `await` it; a result signal (`resolved`, a query's `$data`, an injected store's signal), `await waitTasks($signal)` on one the view rendered or the test read; neither, `findBy*` or `waitFor`.
- A query fetches only while its `$data` is mounted: a test of the store alone calls `start($data)` before `await waitTasks($data)`, otherwise nothing is fetched.
- An `onMount` cleanup runs `STORE_UNMOUNT_DELAY`, one second, after the last subscriber leaves: advance fake timers by it, or assert on `onStop`, which has no delay.

## Stores and dependency injection

- Prefer DI stores: a test that opens its own context gets fresh ones. A module-level store keeps its state between tests: reset it in `beforeEach`, in one `batch`.
- Data is loaded by a store that injects the API, never by the view: fake the API through its DI token, `provide(Api$, fake)`, not by mocking `fetch` or modules or by handing it to the view as a prop.
- Override with `context$(provide(Token$, value))` around the view. To reach what the view injected, render it under `context$(context)` with an `InjectionContext` the test made, then `inject(Store$, context)`.
- A provided value has exactly the type the factory returns: `signal<Theme>('dark')`, not `signal('dark')`.
- An `App` whose root `context$()` has no providers reuses the context of the test, but a token `App` provides itself shadows the override of the test, and a store that reads such a token lives in the context of `App`, where `inject(Store$, context)` does not reach.

## Stories in tests

Import the stories module as a namespace for `composeStories` from `@nanoviews/storybook`; a called story is the story unbuilt, like a component instance, which `render` takes as it is and a view takes as a child. A signal or a function arg reaches the view as it is, so a signal is the handle of the test; a plain value, and an arg left out that the story or its meta sets, are wrapped in new signals. A story that needs the preview, for a decorator that opens the context say, gets it from `setProjectAnnotations(preview)` in the setup file, or from the call: `composeStories(Stories, preview)`.

## Pitfalls

- `render(Counter({ $count })())` runs the render outside `mount`: an `effect$` there throws `Cannot read properties of undefined (reading 'depsTail')`, and without one it mounts but is a type error. As a child, `context$(provide(Theme$, $theme))(Card()())` runs the render before the context is entered, so `inject` throws, and TypeScript lets it through. A built node is not a function and throws a `TypeError`.
- A view that injects throws `Cannot inject dependency outside of injection context` without a `context$` around it; `context$()` gives it the defaults.
- A boolean attribute set to `true` is written as `"true"`, not `""`, and `false`, `null` and `undefined` remove it: assert presence (`hasAttribute`, `toBeDisabled()`), not the value. `aria-*`, `data-*`, `draggable`, `contentEditable` and `spellCheck` write `false` as `"false"`.

## Related skills

- nanoviews: the views, their block layout and naming, `context$` and `provide`.
- nanoviews-storybook: writing stories, `composeStory` and `setProjectAnnotations`.
- nanoviews-router: routed views on `virtualNavigation`.
- nano-kit-store and nano-kit-query: tests of stores and queries without a view (https://nano-kit.js.org/store/testing/, https://nano-kit.js.org/query/testing/).
- unit-tests (TrigenSoftware/scripts): `describe` chains and `it should` titles.
