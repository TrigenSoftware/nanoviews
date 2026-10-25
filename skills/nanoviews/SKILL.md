---
name: nanoviews
description: "Rules for writing user interfaces with nanoviews, a tiny Direct DOM view library on signals: the element call shape `div({ attrs })(...children)`, signals and accessors as the only reactive values, components with `component$`, blocks (`if_`, `show_`, `for_`, `match_`, `switch_`), form bindings (`value`, `checked`, `defaultValue`), effects, slots, dependency injection and the store API of `nanoviews/store`. Apply when creating or editing components, views, forms, lists or stores wired into views in any file that imports from `nanoviews`, `nanoviews/store`, `@nanoviews/*` or `@nano_kit/*`, whether or not the request names the library. Tests, stories and routing have their own skills: nanoviews-testing, nanoviews-storybook and nanoviews-router."
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
    - ui
    - dom
    - signals
    - typescript
  docs:
    paths:
      - getting-started/installation.mdx
      - guides
---

# Nanoviews

Nanoviews builds real DOM directly: no JSX, no virtual DOM, no re-render. A view is a tree of element calls that `mount` builds once, and the signals bound into it update their own piece of the DOM. Bundle size is the point, so a view imports only what it uses: from `nanoviews` the HTML element factories, components, blocks, `effect$`, `context$` and `mount`; from `nanoviews/store` the reactive core (signals, operators, effects, records, async data, dependency injection) and the types `Signalish`, `Accessor`, `ReadableSignal` and `WritableSignal`, which `nanoviews` does not export; from `nanoviews/svg` the SVG factories.

## Reference

`DOCS.md` next to this file is the documentation of the released package as published on https://nanoviews.js.org, generated from the site sources. Read its relevant sections for exact signatures, options and examples before writing code. This skill adds only what the documentation leaves open: conventions, which tool to pick for which job, and pitfalls. The types are in the `.d.ts` files of `node_modules/nanoviews/dist`. Those of `nanoviews/store` are re-exports: follow them into the `dist` of the packages they come from, which pnpm keeps under `node_modules/.pnpm` rather than in the root `node_modules`.

## Mental model

- `div(attributes)(...children)` is a description: a function that builds its node when its parent is built. `mount` builds the whole tree once, top-down, and nothing re-renders afterwards: a signal or an accessor given to a child, an attribute or a block is a binding that updates its own text node, attribute or block.
- An accessor is a signal, a computed, an operator over an accessor or an arrow `() => ...`: pass it to bind it, call it to read now. A function child that is not a description, a component instance or a block becomes live text; a function attribute is an accessor, except `on*` handlers, `ref` and `autoFocus`.
- Whatever is read at build time is read once: `$count()` in a render, a ternary, a `.map()`, a template string. A value that changes later goes in as a signal or an accessor, and a condition or a list that changes is a block.
- A component is always `component$((props, children) => view)`. Calling it returns an instance, and its render runs when the parent builds the instance, after the parent's own render, inside the `context$` and the scope the instance is placed in. A plain function that returns a view runs at the call, before those exist.
- A view is built under `mount` only, or `render` in tests: the build belongs to the scope it opens, which bindings, `ref`, `effect$` and blocks need. Never build a description by hand, static or not: outside `mount` a binding throws when it is built, and `App()()`, which only runs the render, throws for an `effect$` in it.

## Code layout

Every call in view code is a block: the attributes one per line, then `})(`, or `()(` with no attributes, ends the line, the children follow indented, one per line, or all on one line when they are a short run of text and signals like `'Feels like ', $temp`, and `)` closes on its own line. Component instances and the curried calls of blocks take the same shape: `if_($x)(`, `for_($items, trackById)(`, `when_($loading, () => Spinner()(`, `context$(provide(Theme$, $theme))(`. Never close a children call on the line that opens it, as in `h2()($character.$name)`, even where DOCS.md does so for brevity (`p()('Done')`). The reference style is the [weather example](https://github.com/TrigenSoftware/nanoviews/tree/main/examples/weather/nano_kit).

```ts
import { type Accessor, type Signalish, type WritableSignal, record, when } from 'nanoviews/store'
import { section, h2, ul, li, label, input, p, trackById, component$, for_, if_ } from 'nanoviews'

interface Todo {
  id: number
  title: string
  done: boolean
}

interface TodoListProps {
  title: Signalish<string>
  $todos: WritableSignal<Todo[]>
  $left: Accessor<number>
}

export const TodoList = component$(({ title, $todos, $left }: TodoListProps) => section({
  class: 'todos'
})(
  h2()(
    title
  ),
  ul()(
    for_($todos, trackById)(
      (todo) => {
        const $todo = record(todo)

        return (
          li({
            class: ['todo', when($todo.$done, 'todo_done')]
          })(
            label()(
              input({
                type: 'checkbox',
                checked: $todo.$done
              }),
              $todo.$title
            )
          )
        )
      },
      () => li()(
        'Nothing to do'
      )
    )
  ),
  if_($left)(
    () => p()(
      $left, ' left'
    )
  )
))
```

## Naming

- `$name` for signals, computeds, accessors and records. A prop typed `Signalish<T>`, which takes a plain value and a signal alike, keeps a plain name (`title` above); a prop typed `Accessor<T>`, for read-only reactive input, or `WritableSignal<T>`, for state the component writes back, is always reactive and takes the `$` (`$todos`, `$left`).
- A record kept whole takes the `$` name and the signal it wraps a plain one: the row `todo` and its record `$todo` above, or `({ $user: user }) => { const $user = deepRecord(user) ... }` for a prop.
- A function that must run while a view is built, because it calls `inject` or `effect$`, ends with `$`, the way `effect$`, `context$` and `component$` do: `syncHead$`, `listenNavigationLinks$` and helpers of your own. A factory callable anywhere keeps a plain name: `pageView`, `linkComponent`.
- Blocks end with `_` (`if_`, `for_`, `show_match_`), dependency injection factories and tokens are PascalCase with `$` (`Theme$`, `Api$`), and components are PascalCase.

## Components

- Type the props on the parameter of the render, never as a type argument of `component$`: whether the component takes children is read off the render, and `component$<Props>(...)` keeps them allowed.
- Hand props on as they came: attributes, children, class list parts and the operators take a plain value and a signal alike, and `$get(prop)` reads either inside an accessor, a handler or an effect. The values of a `style` object are plain, so a prop goes in through an accessor of the whole object: `style: () => ({ '--columns': $get(columns) })`.
- A component that forwards element attributes types its props `Attributes<'tag'>` extended with its own, takes every prop that is not an attribute out before spreading `...props` (one left in is written as an attribute), and folds the `class` it got into its own list: `class: ['card', className]`.
- A component that renders the element or the component its caller picks is `polymorphic$`: its props extend `PolymorphicProps<'button'>`, or `PolymorphicProps<typeof Link>` for a component, and the render sets the default, `as = button`; a second type argument, `PolymorphicProps<'div', 'section' | 'article'>`, limits `as` to those targets besides the default. Never a cast to a generic signature. A prop of its own that takes an attribute name, such as a kit's `color`, keeps its type when declared again; a wrapper that spreads attributes into it omits that name, `Omit<Attributes<'aside'>, 'color'>`.
- Content goes in as children. Data for the caller's markup goes through a render function child, `[render]: [render: (item: T) => Child]`; several named places are slots (`slot$`, `slots$`); data for slots and deep children goes down through `context$`. A component that renders the element its caller picks takes the factory, `as = button`, not a tag name.

## Which tool for which job

- A binding: an operator where one covers the expression (`not`, `and`, `or`, `when`, `is`, `gt`, `pick`, ``text`...` ``), an arrow for the rest (a call, arithmetic, `?.`), a `computed` for a value read in several places or costly to compute. `length` and `boolean` are ready-made computeds, and "is this row the selected one" is one `selector` outside the list.
- Fields of an object signal: bind the child signals of its `record` (`deepRecord` for nested objects), `$user.$name`, when several fields are bound or the signal is a record already. One field of a signal that is not a record is an arrow, `() => $user().name`: a record made for one field adds nothing. Not `pick`, which throws on a `null` object.
- A condition: `if_` rebuilds its branch on every flip, so its state resets; `switch_` compares one value with cases, and `match_` takes the first condition that holds; `show_`, `show_switch_` and `show_match_` build every case once and park the hidden ones with their state; `swap_` maps a value to a view. A plain value, in a block or in `cond && child`, decides once at build.
- A list: `for_` with a tracker (`trackById`, `trackBy('key')`, `item => item.path`) whenever the items are objects or the rows hold state. A filtered `computed` list has read-only rows: to filter editable rows, iterate the writable list and gate each row with `if_`.
- An effect: `effect$` from `nanoviews` in views, `effect` from `nanoviews/store` in stores and dependency injection factories, where `effect$` throws. Work that should run only while a view shows a store goes into `mountable` with `onMount` or `onMountEffect`.
- An element: the element of a component is a `ref` signal read in an `effect$`, never its description built by hand, and a behavior of your own on any element is a `ref` callback that opens an `effect$`, since there are no custom attributes. A custom element has no factory: build it by hand in a component and bind its attributes with a store `effect`.
- Async data: loaded by a store, a factory `Name$` the view injects, never by the render, like the rest of the business logic; `resolved` for a one-off promise, `@nano_kit/query` for caching, deduplication and mutations.
- Shared state: a factory `Name$` injected in renders, under one root `context$()` at the top of the app; a subtree overrides it with `context$(provide(Name$, value))(...)`.

## Differences from React, Solid and Svelte

- A render runs once and nothing re-renders, so there are no rules of hooks and no dependency arrays: an effect tracks what it reads, and `effect$` may be called in a branch, a row or a helper, as long as a view is being built.
- Never unwrap a signal at build time for what the view shows, `const count = $count()`, `` `${$count()} items` `` or `$items().map(...)`: it freezes. Reactive text is a separate child, `'Total: ', $total`, never a template string.
- A render is not tracked: a read there is a one-off and needs no `untracked`. That is how a value fixed for the life of the view is read, such as the id of a row tracked by id. `get`, `untracked` and `action` are for reads inside an effect, a computed or an accessor that must not subscribe it.
- Habits that are type errors: `className`, `htmlFor`, `key`, `onDoubleClick`, a lowercase `tabindex`, a `style` string (write `class`, `for`, a `for_` tracker, `onDblClick`, `tabIndex`, a style object). A number in `style` gets no `px`. `value` and `checked` are the live state and `defaultValue` and `defaultChecked` the reset defaults, as in React; files have no binding.
- `false`, `null`, `undefined` and `true` render nothing, so `cond && child` works, but `0` renders as text: gate a count with `count > 0 && child`. A bare array child throws. A list is a `for_` block even when it is static: a plain array takes no tracker and renders once. Spreading `.map()` into the call works but is not the way; `...children` is spread as it is.
- No deep reactivity: a write of the same reference notifies nothing, so an array or an object changed in place is not seen. Write a new value, or use `push`, `setIndex`, `setKey`, `updateArray` and the other helpers.
- A function written to a signal is a reducer, called untracked with the latest value: store a callback as `$onSave(() => save)`.

## Effects and batching

- Bindings (text, attributes, `style`, the state of `input` and `textarea`) apply their first value at build, before the element is in the document, and keep a hidden `show_` up to date. `effect$` first runs once the tree, or the new content of a block, is in the document, is cleaned up while a `show_` hides it and runs again on show with `warmup` set; a bound `value` or `defaultValue` of a `select` waits the same way. A store `effect` runs at once and keeps running under a hidden `show_`.
- Start order: the effects of a signal-driven `if_`, `switch_`, `match_` or `swap_` branch and of a `for_` row run before the effects around the block, innermost first; `show_`, `show_switch_` and `show_match_` start their content in the creation order of the scope around them; a block given a plain value is inline. Within a scope effects start in creation order, so the effects of a parent's render precede those of its `component$` children.
- On a swap the cleanups of the old branch run while its DOM is still attached, then the new branch is built and started; removed `for_` rows are destroyed before new rows start. Never rely on a parent effect having run when a child effect runs: pass data through signals.
- A write flushes at once, with two exceptions. `mount` holds the writes of the render, of the first effect runs and of the unmount. An effect that runs from a flush (every re-run, and the first run of what a write brings in with a new branch or row) holds its writes until it returns, so a `batch` there flushes nothing. Everywhere else every write flushes on its own: event handlers, timers, promise callbacks, and the first run of a store `effect` created outside a flush or a `batch`, at module level say. Wrap writes that belong together in `batch`, above all writes to several conditions of one `match_`.

## Pitfalls

- `show_`, `show_switch_` and `show_match_` run the cleanups of a `portal` and of a `ref` on hide and restore neither on show. Put the `show_` inside the portal, `portal(() => document.body, show_($open, () => Modal()))`, and a subtree whose `ref` matters under `if_`.
- `for_` keys must be unique: a repeated key renders a row short, or makes the write throw and leaves the old rows on screen. Track by an id, or give no tracker when values repeat.
- In a `for_` row, read `$item()` and `$index()`, never `$items()`, which wakes every row on every change of the list. A list typed `T[] | null` has read-only rows: keep an edited list non-nullable, `[]` for no items.
- `record` and `deepRecord` share one cached record per signal, shaped by the first call: use one of them per signal. `pick` throws on a `null` collection, while the children of a record read `undefined`.
- `inject` works only synchronously while a view is built: inject in the component body and close over the result in handlers and effects. A provided signal has the exact type the factory returns: `provide(Theme$, signal<Theme>('dark'))`.
- Keys apply in order: a handler for the event of a binding, `onInput` for `value`, sees the new value in the signal only when it stands after the binding, and a `range` input takes `min` and `max` before `value` and `defaultValue`.
- A checkbox signal that holds the third state is typed with it, `signal<boolean | typeof Indeterminate>(false)`: `signal(false)` rejects `Indeterminate`.
- A `computed` that reads its previous value takes a type argument, `computed<string>((last = '') => ...)`, or it is typed `unknown`.
- Nanoviews has no SSR, hydration or error boundaries: keep an expected failure in a signal and render it with a block. The exports DOCS.md lists under Internal Exports are not for application code.

## Related skills

- nanoviews-testing: unit tests of views with `@nanoviews/testing-library` and Vitest. nanoviews-storybook: stories with `@nanoviews/storybook-vite`. nanoviews-router: routing with `@nanoviews/router`.
- Nano Kit packages bind into views as they are, and have skills of their own: nano-kit-store (`@nano_kit/store`: all of `nanoviews/store` plus `paced`, `previous`, `latest`, storage-backed signals and hydration, and the store conventions), nano-kit-query (remote data), nano-kit-platform-web (browser API signals), nano-kit-intl (internationalization), nano-kit-react-router (the `@nano_kit/router` core). Docs: https://nano-kit.js.org.
- One copy of the reactive core must serve the whole app: a view does not follow a signal of another copy, and `inject` of another copy does not see the context that `context$` opens. If the lockfile holds two, merge them with `pnpm dedupe` (`npm dedupe`, `yarn dedupe`), or override the dependencies of `nanoviews` to the versions `@nano_kit/store` uses (`overrides` in npm and pnpm, `resolutions` in Yarn).
