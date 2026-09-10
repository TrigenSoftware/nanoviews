---
name: nanoviews
description: "Rules for writing user interfaces with nanoviews, a tiny Direct DOM view library on kida signals: the element call shape `div({ attrs })(...children)`, signals and accessors as the only reactive values, run-once components with `props$` and `children$`, blocks (`if_`, `show_`, `for_`, `match_`, `switch_`), form bindings (`value$`, `checked$`, `selected$`), effects, slots, custom effect attributes, dependency injection and the kida store API. Apply when creating or editing components, views, forms, lists, stores wired into views or custom effect attributes in any file that imports from `nanoviews`, `nanoviews/store`, `@nanoviews/*` or `@nano_kit/*`, whether or not the request names the library. Tests and stories have their own skills, nanoviews-testing and nanoviews-storybook."
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
    - kida
    - typescript
---

# Nanoviews

Nanoviews builds real DOM directly: no JSX, no virtual DOM, no re-render. A view is a tree of element calls; kida signals bind into text, attributes and blocks. Import only what a view uses: bundle size is the point. Signatures and JSDoc live in `node_modules/nanoviews/dist/*.d.ts` and `node_modules/kida/dist/*.d.ts`; this skill covers what the types do not say.

```ts
import { signal } from 'nanoviews/store' // kida re-export: signal, computed, effect, batch, record...
import { button, mount } from 'nanoviews'

function Counter() {
  const $count = signal(0)

  return button({ onClick: () => $count(n => n + 1) })('count is ', $count)
}

const unmount = mount(Counter, document.querySelector('#app')!)
```

## Mental model

- `tag(attrs?)` creates the element; the second call `(...children)` appends children and is optional, so `div({ class: 'x' })` alone is a valid child. Void tags have no second call: `input({ type: 'text' })`, `img({ src })`, `br()`.
- A component is a plain function that runs once and returns a node or a block; state lives in signals and the DOM follows through bindings. Build only under `mount` (or a test `render`): a bare `App()` starts effects nobody can stop.
- A reactive value is an *accessor*: a signal `$x` or an arrow `() => ...`. Pass it to bind, call it to read now. Every function child or non-`on*` attribute is treated as an accessor and tracked.
- A static value renders once; anything that must change later has to be a signal or an accessor. Ternaries and `.map()` run once at build time; reactive conditions and lists need blocks.
- No hooks, no dependency arrays, no re-render: `effect` can go anywhere in the build, once.
- Naming: signals and accessors `$name`; receivers and effect attributes end with `$` (`children$`, `value$`); flow blocks end with `_` (`if_`, `for_`); injectable factories `Name$`.

## Elements, children, attributes, events

```ts
p({ class: 'note', title: () => `${$count()} items`, hidden: $done })(
  'Hello, ', $name, '!',            // reactive text: separate children, never a template string
  ' ', b()(() => $count() * 2),     // arrow child: derived reactive text
  br(), fragment('a', 'b'),
  ...items.map(item => i()(item))   // static list: spread a plain array
)
```

- Children: nodes, fragments, strings, numbers, elements (`span()` alone is fine), signals and accessors (live text nodes). `null`/`undefined` render nothing; `true`, `false` and `0` render as text, so gate with `cond ? x : null` or a block. A bare array throws: spread it.
- Call components: `div()(Counter())`. An uncalled component is a type error (untyped, it would be read as an accessor and its return stringified).
- Attribute names follow the type definitions: HTML spelling for single words (`class`, `for`, `hidden`), camelCase for multi-word names (`tabIndex`, `readOnly`, `autoComplete`; lowercase `tabindex` is a type error), quoted dashed names (`'aria-expanded'`, `'data-id'`; `data-*` is typed on HTML elements only).
- Attribute values are static or accessors. `null`, `undefined` and `false` remove the attribute, so `disabled: $busy` toggles like in React. `aria-*`, `data-*`, `draggable`, `contentEditable` and `spellCheck` are the exception: `false` is written as the string `"false"`, so pass a boolean signal or accessor to them directly (a `string` accessor is rejected on `aria-*`).
- Attributes go through `setAttribute`, so `value`, `checked` and `selected` are initial values only. Live form state goes through `value$`, `checked$`, `selected$` (below).
- `class` and `classList$` both write the class attribute (the later key wins); a `style` string replaces `style$` properties set before it. Use one of each pair per element.
- Events: `on` + PascalCase DOM event name (`onClick`, `onInput`, `onKeyDown`, `onDblClick`, `onPointerDown`), `Capture` suffix for the capture phase. The handler gets the native event with a typed `target`; reads inside are untracked and writes are not batched. A writable signal given as a handler receives the event.
- `fragment(...children)` is a `DocumentFragment` at runtime, typed `Element | DocumentFragment`. `mount(app, target)` returns the unmount function, which stops effects and removes the nodes.
- Factories share names with globals: `style` and `slot` are elements (`style$`, `slot$` are the helpers), `title`, `map`, `data`, `object` exist too; `var` is imported as `{ var as htmlVar }`. Alias on collision.

## SVG (`nanoviews/svg`)

```ts
import { div } from 'nanoviews'
import { svg, circle, path, foreignObject } from 'nanoviews/svg'

svg({ viewBox: '0 0 24 24', width: 24, height: 24 })(
  circle({ cx: 12, cy: 12, r: $radius, fill: 'none', stroke: 'currentColor', strokeWidth: 2 }),
  path({ d: 'M8 12l3 3 5-6' }),
  foreignObject({ x: 0, y: 0, width: 24, height: 24 })(div()('HTML inside'))
)
```

- Every SVG tag is a factory in `nanoviews/svg` with the same call shape, created in the SVG namespace; `nanoviews` itself has no SVG factories. Shapes and leaves (`circle`, `rect`, `path`, `line`, `ellipse`, `polygon`, `polyline`, `image`, `use`, `animate`, `animateMotion`, `animateTransform`, `set`, `mpath`) are void: one call, no children. HTML inside `foreignObject` comes from `nanoviews`.
- Attribute names are camelCase as in React: `viewBox`, `preserveAspectRatio`, `strokeWidth`, `fillOpacity`, `textAnchor`, `tabIndex`. Presentation attributes reach the DOM hyphenated (`stroke-width`), the rest keep their SVG spelling; a dashed key like `'stroke-width'` is a type error. `href` replaces `xlinkHref`; the SVG 1.1 font, glyph and color-profile attributes are not typed.
- `a`, `title`, `style` and `script` exist in both entries, and `switch` is imported as `{ switch as svgSwitch }`; alias on collision. `ref$`, `style$` and `autoFocus$` work on SVG elements; `classList$` is HTML-only, so set `class` as an attribute.
- `Attributes<'circle'>`, `ElementName` and the factory types come from `nanoviews/svg` under the same names as the HTML ones in `nanoviews`.

## Reactivity (`nanoviews/store`)

```ts
const $count = signal(0)             // read $count(), write $count(1) or $count(n => n + 1)
const $double = computed(() => $count() * 2) // lazy, cached, read-only
effect(() => {                       // in a component: first run once the tree is appended; at module level: at once
  document.title = `${$count()}`     // re-runs on tracked change
  return () => {}                    // cleanup: before each re-run and on unmount; return nothing else
})
batch(() => { $a(1); $b(2) })        // one flush for several writes; handlers, timers and callbacks never batch
const $user = record($userSignal)    // $user.$name, $user.$age: child signals, writable when the parent is
const [$post, $error, $pending] = resolved(() => fetchPost($id())) // async: stale value kept while pending
```

- Types from `nanoviews/store`: `Signalish<T>` = `T | Accessor<T>`, `Accessor<T>` = `() => T`, `ReadableSignal<T>`, `WritableSignal<T>`. Read a signalish with `$get(value)` (tracked) or `get(value)` (untracked). `effect` and `effectScope` are the same functions on both entry points; `Signalish`, `Accessor`, `WritableSignal`, `ReadableSignal` are exported only from `nanoviews/store`.
- Writing an equal value (same reference) is a no-op, so an object mutated in place does not notify. Write a new array or object, or use `push`, `setIndex`, `deleteIndex`, `setKey`, `updateArray`.
- Inline arrow in a view = one binding recomputed when its dependencies change. `computed` = cached and shareable. Use the arrow for a single use, `computed` for a value read in several places; `length($arr)` and `boolean($x)` are ready-made computeds.
- The full store API (records, arrays, lazy `mountable` stores, subscriptions, `selector`, tasks, DI) is under "Signals in depth" below.

## Components

```ts
import type { Signalish } from 'nanoviews/store'
import { button, effect, props$, classList$ } from 'nanoviews'

interface ButtonProps {
  label: Signalish<string>
  size?: Signalish<'s' | 'm'>
  onSelect?: () => void
}

function Button(props: ButtonProps) {
  const { $label, $size = () => 'm', onSelect, ...rest } = props$(props)

  effect(() => () => console.log('unmounted')) // effect with no reads: mount/unmount hook

  return button({ [classList$]: ['btn', () => `btn_${$size()}`], onClick: onSelect, ...rest })($label)
}
```

- Props are plain values or signals. Type them `Signalish<T>` when either is fine, `Accessor<T>` for read-only reactive input, `WritableSignal<T>` for two-way state (name those `$value`). Reading `props.$x()` at build time freezes that value.
- `props$(props)` adds a `$name` accessor twin per prop (the signal itself, a wrapper for a static value, a function as is, `undefined` when absent so destructuring defaults apply). Taking `$name` removes the prop from `...rest`, which then holds only the keys not taken as `$name`; take every non-attribute prop out before spreading `rest` onto an element. A component that takes arbitrary element attributes types them `Attributes<'div'>`.
- `children$(children => view)` makes the component callable as `Card(props)('text', b()('bold'))`; `children` is always an array. Named slots are under "Slots" below.
- `effect` in a component first runs once the whole tree is appended, so measuring and focusing are safe on the first run.
- Dependency injection: `App` opens the root context once (`return context(() => main()(...))`); a component calls `inject(Theme$)` during render and closes over the result for its handlers and effects (`inject` inside a handler or effect throws). Override: `context([provide(Theme$, $theme)], () => ...)`. Details under "Dependency injection in depth".

## Control flow

| Block | Use when | Shape |
| --- | --- | --- |
| `if_` | branch, rebuilt on every flip | `if_($cond)(v => thenView, () => elseView)` |
| `show_` | toggle visibility, keep state and DOM | `show_($cond, () => view)` |
| `switch_` | one primitive value, several cases | `switch_($tab)(case_('a', () => ...), default_(() => ...))` |
| `match_` | first truthy condition wins | `match_(when_($loading, () => ...), when_($error, $error => ...), default_(() => ...))` |
| `swap_` | custom mapping value to view | `swap_($value, value => view)` |
| `for_` | reactive list | `for_($items, trackById)(($item, $index, key) => row, () => emptyView)` |

- `if_` and `when_` pass the narrowed signal to the branch: `if_($post)($post => b()(() => $post().title), () => 'none')`. `if_` rebuilds only when truthiness flips (inner state resets); a new object in the same branch updates in place.
- `show_` builds once and parks the tree while hidden: detached from the document, state kept, bindings still updating, effects stopped (cleanup run) and restarted on show. No else branch. Keep `portal` and `ref$` out of it: `portal(() => document.body, show_($open, () => Modal()))`, and `if_` for a subtree that needs `ref$` (details under "Raw HTML, shadow DOM, portals").
- `switch_` matches by strict equality against plain case values; `match_` stops at the first truthy case and `default_` is shared by both. `batch` writes to several `match_` conditions or the frame in between shows.
- `for_`: give a tracker (`trackById`, `trackBy('key')`, `item => item.id`) whenever items are objects or rows hold state; without one rows are positions and a reorder rewrites values into existing rows. A repeated key is not detected: its row is silently dropped.
- Each row gets `$item` (a signal; for a `WritableSignal<T[]>` it is writable: `$item(next)` and `record($item).$done(true)` write a new item and array back, so computeds recompute; a list typed `T[] | null` gets read-only rows, so keep list signals non-nullable), `$index` (a signal) and the plain key. Read only `$item()`/`$index()` inside a row: `$items()` there re-runs every row on every change. Per-row selection: one `const $isSelected = selector($selectedId)` outside the loop, then `class: () => $isSelected(key) ? 'active' : ''` in each row.
- A computed list gives read-only rows. To filter or sort while keeping rows editable, iterate the writable source and gate each row: `$item => show_(() => keep($item()), () => Row({ $item }))`.
- `as_(record, ($item, $index, key) => ...)` applies a transform to every row and keeps writes bound. The second argument of the row call renders the empty state, for `[]` and for `null`. A static array takes no tracker: `for_(list)((item, index) => ...)` renders once; a static condition renders once with no block.
- `throw_(new Error('...'))` throws inside an expression.

## Forms and effect attributes

```ts
const $name = signal('')
const $agree = signal(false)
const $plan = signal('pro')

form({ onSubmit: event => { event.preventDefault(); save($name()) } })(
  label({ for: 'name' })('Name'),
  input({ id: 'name', type: 'text', [value$]: $name, [autoFocus$]: true }),
  input({ type: 'checkbox', [checked$]: $agree }),
  select({ [selected$]: $plan })(option({ value: 'free' })('Free'), option({ value: 'pro' })('Pro')),
  button({ type: 'submit', disabled: () => !$agree() })('Save')
)
```

- `value$` (text inputs, textarea; `input` event), `checked$` (checkbox, radio; `change`; `Indeterminate` symbol for the third state), `selected$` (select; a `string[]` signal makes it multiple; `change`) are two-way and need a `WritableSignal` typed exactly `string` or `boolean`: a literal-union signal is rejected. Keep it `string` and narrow where read, or cast a `record` field (`$task.$status as WritableSignal<string>`). Put `[value$]` before an `onInput` key that reads the signal. `files$` is DOM-to-signal only (`File[]`).
- `ref$`: a `signal<HTMLInputElement | null>(null)` holds the element from build to unmount, then `null`. Use it in an effect or a handler.
- `style$`: `{ backgroundColor: $color, fontSize: '12px', '--gap': '4px' }`, camelCase keys, units spelled out; typed for `HTMLElement` and `SVGElement`. `classList$` parts may be falsy and are dropped: `['btn', () => $active() && 'btn_active']`. `autoFocus$`: `true` focuses on mount; pass a plain boolean only (an accessor counts as true); dynamic focus goes through `ref$`.
- Own attributes: see "Custom effect attributes" below.

## Differences from React, Solid and Svelte

- Type errors: `className`, `htmlFor`, `key`, `onDoubleClick`, `defaultValue`, `defaultChecked` (use `class`, `for`, a tracker, `onDblClick`, and `value`/`checked` for an initial value, `value$`/`checked$` for live state).
- Do not unwrap a signal at build time (`const count = $count()`) for anything the view shows: it freezes. Pass `$count` or `() => ...`.
- Do not `.map` a signal array or `if` on a signal at build time; use `for_`, `if_`, `match_`. Do not interpolate a signal into a template string child.
- A function argument to a signal is a reducer; store a function as `$fn(() => handler)`.

## Unsupported

- No SSR, hydration, router or error boundaries in nanoviews itself; routing comes from the `@nano_kit/router` core (see the nano-kit-react-router skill, there is no nanoviews adapter yet).
- Exported but internal, do not use: `deferScope`, `boundDeferScope`, `startScope`, `stopScope`, `pauseScope`, `resumeScope`, `unsafeRun`, `createSignal`, `computedOper`, `nextValue`, `signalNextValue`, `assignIndex`, `assignKey`, `onSignal`, `unsafeMark*`, node and flag constants, and `createElement`/`createVoidElement`/`create*Factory` beyond known tag names.

## Slots

`children$` turns a component into a two-call function like an element factory:

```ts
import type { Attributes } from 'nanoviews'
import { div, b, children$ } from 'nanoviews'

function Card(props: Attributes<'div'>) {
  return children$(children => div(props)(...(children.length ? children : ['empty'])))
}

Card({ class: 'x' })('a', b()('b')) // <div class="x">a<b>b</b></div>
div()(Card({ class: 'x' }))         // used as a child without the second call: children is []
```

`children` is always an array, never `undefined`. The receiver is a lazy child (a function flagged `c: true`), the same thing `div(attrs)` returns.

Named slots: a slot component wraps its output with `slot$(Self, content)`; the layout returns `slots$`, which is itself a children receiver, and gets the slot contents in declaration order followed by the remaining children.

```ts
import type { Attributes } from 'nanoviews'
import { main, header, footer, children$, slot$, slots$ } from 'nanoviews'

function LayoutHeader(props: Attributes<'header'>) {
  return children$(children => slot$(LayoutHeader, header(props)(...children)))
}

function LayoutFooter(props: Attributes<'footer'>) {
  return children$(children => slot$(LayoutFooter, footer(props)(...children)))
}

function Layout() {
  return slots$([LayoutHeader, LayoutFooter], (headerSlot, footerSlot, children) => main()(
    headerSlot, ...children, footerSlot
  ))
}

Layout()(LayoutHeader({})('Top'), 'Body', LayoutFooter({})('Bottom'))
```

- A slot the caller did not pass arrives as `undefined` and renders nothing; slot contents are typed `C | undefined`.
- A slot nobody declared throws `Slot is not declared in slots$` at build time. Declare every slot a caller may pass.
- Passing the same slot twice keeps the last one.
- A slot component must be *called* with its children (`LayoutHeader(props)('...')`). The uncalled receiver is a lazy child, not a slot: the types reject it as a child of `slots$`, and at runtime it throws when its slot object is appended to the DOM.
- Slot content can be a function, which makes a render prop: the receiver calls it with whatever the component wants to expose, such as its internal state.

```ts
const Footer = (render: (draft: WritableSignal<string>) => Child) => slot$(Footer, render)

function Modal() {
  const $draft = signal('')

  return slots$([Footer], (footerSlot, children) => div({ role: 'dialog' })(...children, footerSlot?.($draft)))
}

Modal()('Edit', Footer($draft => button({ onClick: () => save($draft()) })('Save')))
```

- Slot objects are plain `{ f, c }` objects: they belong only inside `slots$` receivers, never as a child of an element.

## Custom effect attributes

`createEffectAttribute(id, callback)` registers the callback in a global map and returns the id, which is then used as a computed key. The callback runs synchronously while the element is built, before it is in the document; an `effect` created inside it belongs to the enclosing block and is torn down with it.

```ts
import { $get, effect, type Signalish } from 'nanoviews/store'
import { div, createEffectAttribute } from 'nanoviews'

export const title$ = createEffectAttribute('title$', (element: HTMLElement, $value: Signalish<string>) => {
  effect(() => {
    element.title = $get($value)
  })
})

declare module 'nanoviews' {
  interface EffectAttributeValues<Target extends Element> {
    title$: Signalish<string>
  }
  interface EffectAttributeTargets {
    title$: HTMLElement
  }
}

div({ [title$]: $title })('text') // $title: a placeholder signal
```

- Annotate the callback parameters (or pass the three generics): untyped, they are `Element` and `unknown` and the body does not compile.
- Both augmentations are required: `EffectAttributeValues` gives the value type, `EffectAttributeTargets` decides on which element types the key is allowed. Without them the key is a type error even though it works at runtime.
- The value type may depend on the element: `onMounted$: (el: Target) => void` is a valid declaration.
- Ids are global; pick a unique `name$` so it never shadows a built-in.
- The third callback argument is the whole attributes object of the element.
- Built-in bindings (`style$`, `classList$`, text, attributes) apply their first value synchronously through an internal non-deferred effect; a custom attribute should use plain `effect`, which runs after mount and stops while a `show_` is hidden.

## Raw HTML, shadow DOM, portals

```ts
dangerouslySetInnerHtml(div({ class: 'md' }), $html) // takes the uncalled div({...}), returns the element
shadow(div({ id: 'host' }), { mode: 'open' })(style()(':host { display: block }'), 'inside')
portal(() => document.body, div({ class: 'modal' })('in the body'))
```

- `dangerouslySetInnerHtml(factory, html)` accepts a static string or a signal and updates `innerHTML` in place; it returns the element, so no children call follows.
- `shadow(factory, init)` attaches the shadow root at once and returns a children receiver; the children go into the shadow root and the host element is returned. Hosts must allow a shadow root (`div`, `span`, custom elements).
- `portal(target, child)` calls `target()` and appends the child immediately at build; the target must exist. Removal is registered on the enclosing scope, so a portal inside a component or an `if_` branch is removed with it. It returns nothing: a component that only portals calls `portal` in its body and returns `null`.
- Never put a `portal` inside `show_`: hiding runs the removal and showing again does not re-append. Toggle a portalled tree the other way round, `portal(() => document.body, show_($open, () => Modal()))`: while hidden the parked DOM leaves the target and comes back with its state on show. The same applies to `ref$` under `show_`, which stays `null` after the first hide; use `if_` there.

## Dependency injection in depth

`inject(Factory$)` runs the factory once per context and caches the instance; parent contexts are searched first, so a value resolved at the root is shared by every child context. `provide(Factory$, value)` returns a provider tuple for `context([...], fn)` and short-circuits the factory. A factory's return value is the default, so contexts have defaults for free.

```ts
import { signal, computed, mountable, onMount, Injectable$ } from 'nanoviews/store'
import { main, button, context, isolate, provide, inject } from 'nanoviews'

type Theme = 'light' | 'dark'

function Theme$() { return signal<Theme>('light') }

function Users$() {
  const $users = mountable(signal<User[]>([]))            // User, api, $inner: placeholders
  onMount($users, () => { void api.list().then($users) }) // starts on the first view subscription
  return { $users, $count: computed(() => $users().length) }
}

class Api$ extends Injectable$ {                          // class form: new'd once per context
  $theme = inject(Theme$)
  save() { return api.save({ theme: this.$theme() }) }
}

function Settings() {
  const $theme = inject(Theme$)                           // inject during render, close over the result
  const api = inject(Api$)
  return button({ onClick: () => api.save() })('Save (', $theme, ')')
}

export function App() {
  return context(() => main()(Settings()))                // root context: required before any inject
}

context([provide(Theme$, signal<Theme>('dark'))], () => Settings()) // child context with an override
isolate(() => context([provide(Theme$, $inner)], () => Settings()))  // fresh tree, inherits nothing
```

- `context(fn)` with one argument reuses the current context when one exists and creates the root one otherwise; it never adds providers. `context(providers, fn)` always creates a child context, or the root one with those providers when none exists. `context([], fn)` is an inheriting child with no overrides.
- A provided value must have exactly the factory's return type. `signal('dark')` infers `WritableSignal<string>` and `signal<'dark'>('dark')` is a `WritableSignal<'dark'>`; signals are invariant, so neither satisfies a `WritableSignal<'light' | 'dark'>` factory. Annotate with the factory's type: `signal<Theme>('dark')`.
- `inject` works only synchronously during render. Inside an effect, an event handler, a promise callback or a timer there is no current context and it throws: inject everything a component needs in its body and close over it. `getContext`, `run` and `InjectionContext` are library-author tools, not application code. A factory may throw `DependencyNotFound('Name$')` for a dependency it refuses to default.
- Blocks remember their context: a branch rendered later by `if_`, a row created later by `for_`, and the tracker function all resolve `inject` correctly.
- Effects created inside a factory run immediately and are never stopped by unmount; give a store lazy work through `mountable` plus `onMount` (see "Lazy stores").
- Two sibling child contexts asking for a factory nobody resolved above get two instances. Resolve shared services at the root first.
- `isolate(fn)` hides every provider above it; a bare `inject` inside it throws.

## Effect ordering guarantees

- A signal-driven `if_`, `swap_`, `match_`/`switch_` branch or `for_` row is its own scope and its effects start before the effects of the scope that contains it, innermost first. `show_` is the exception: its content effects are started by the toggle effect, in the containing scope's creation order. A block with a static condition is rendered inline and has no scope of its own.
- Effects in the same scope, including a parent component and a plain child component it calls, start in creation order: a parent effect declared before `return` runs before the child's.
- On a swap the old branch's cleanups run while its DOM is still attached, the DOM is removed, the new branch is rendered, then its effects start. Removed rows are destroyed before new rows start.
- Under a hidden `show_`, deferred effects have run their cleanup and re-run on show with `warmup === true` again; text, attribute, `style$` and `classList$` bindings keep updating the parked DOM.
- Writes made during render and during unmount are batched by `mount`. Writes made inside a running effect are queued onto the flush already running, so they land together. Everywhere else (handlers, timers, promise callbacks) every write flushes on its own; wrap several in `batch`.
- Do not depend on a parent effect having run when a child effect runs; communicate through signals.

## Signals in depth

`nanoviews/store` is `export * from 'kida'`, and kida re-exports the signal core `agera`. The same primitives, plus the `@nano_kit/store` extras, are covered in depth by the nano-kit-store skill.

### Signals and computeds

```ts
const $count = signal(0)        // WritableSignal<number>; signal<T>() is WritableSignal<T | undefined>
$count(n => n + 1)              // reducer: gets the pending value, runs untracked
const $log = computed((prev = '') => prev + $event()) // a computed receives its previous value
```

- Equality is strict `!==`: writing an equal primitive or the same object reference is a no-op and notifies nothing (a `NaN` write always notifies). After an in-place mutation, `trigger(() => $x())` forces propagation, but prefer new values.
- The initial value of `signal(fn)` is stored as is; only a written function is a reducer.
- Writing to a `computed` is a type error and, forced through, does nothing. `readonly($s)` marks the signal itself non-writable and returns it typed `ReadableSignal` (`isWritable` flips, a forced write still lands); children created after the call are read-only, children obtained before it stay writable, so call it before handing out children.
- `computed` is lazy and cached: the body does not run until read, re-runs only when read after a dependency changed, and is eager only while an effect or binding subscribes to it. It notifies only when the result changed. Keep it pure: no writes, no effects inside.

### Effects and subscriptions

```ts
const stop = effect((warmup) => {
  const id = setInterval(tick, $period())      // tracked
  const other = untracked($other)              // read without tracking; get($x) does the same
  if (!warmup) report($period())               // warmup is true on the first run only
  return () => clearInterval(id)               // cleanup: before each re-run and on stop or unmount
})
```

- Inside a component under `mount`, `effect` is deferred until `mount` has appended the rendered tree to its target. At module level or inside a store factory it runs immediately and is never stopped by unmount.
- Return a cleanup function or nothing. An `async` body is a type error (a `Promise` is not a cleanup) and, forced through, the promise is called as the cleanup and throws: keep the body synchronous and write `void refresh()` inside it.
- The cleanup runs with the signals already holding their new values; capture what it needs in the run's closure.
- `effectScope(fn)` groups effects created in `fn` and returns one stop. `composeDestroys(a, b)` merges several cleanups into one.
- Ordinary code uses `effect`; `subscribe`, `listen`, `observe` and `subscribeAny` are low-level variants.
- `action(fn)` wraps a function so reads inside never subscribe the caller: use it for store methods called from effects.
- `batch(fn)` flushes once at the end of the outermost batch and returns `fn`'s result.

### Values in and out

- `SignalishValue<T>` unwraps a `Signalish<T>` type.
- `isAccessor(x)` is `typeof x === 'function'`; `isSignal(x)` also requires a signal node; `isWritable($x)`, `isMountable($x)`, `isEmpty(x)` (`null`/`undefined` only).
- `toAccessor(x)` returns a function as is, wraps a value in `() => x`. `toSignal(x)` returns a signal as is, wraps a plain function in `computed`, a value in `signal`.
- Cheap uncached accessors, exported by kida but absent from its README: `not`, `is`, `isNot`, `and`, `or`, `some`, `every`, `gt`, `gte`, `lt`, `lte`, `when($cond, then, else?)`. They cost no graph node and recompute on every read; an inline arrow does the same with no import, and `computed` caches when the value is shared or expensive.
- Cached derivations: `length($arr)`, `boolean($x)`, `concat(...parts)`.
- `selector($source)` returns `(key) => boolean` that wakes only the readers whose key changed; `selector($source, (key, value) => R)` customises the answer.

### Records, arrays, objects

```ts
const $user = record($userSignal)     // $user.$name, $user.$age; cached per source, stable identity
const $city = deepRecord($profile).$address.$city  // nested records; one of record/deepRecord per source
const $first = atIndex($list, 0)      // or atIndex($list, $indexSignal)
const $byId = atKey($map, $id)
push($list, item); pop($list); shift($list); unshift($list, item)
setIndex($list, 2, item); deleteIndex($list, 2)
updateArray($list, list => { list.sort() })  // mutates a copy, writes it back
setKey($map, 'k', v); deleteKey($map, 'k')
```

- Child signals are writable when the parent is a writable signal; writing one writes a shallow copy into the parent. Children of a `computed` are read-only and a forced write is ignored.
- `record` and `deepRecord` share one cached proxy per source: the first call decides the shape, so never call `deepRecord` on a signal already passed to `record` (or the reverse).
- A child of a `null`/`undefined` parent reads `undefined`; writing it throws. Guard with `if_($parent)` or write the whole parent.
- `record(plainObject)` creates a new signal each call; create it once and share it.

### Async data and tasks

```ts
const [$post, $error, $pending] = resolved(() => fetchPost($id()))

if_($pending)(
  () => 'Loading',
  () => if_($error)($error => fragment('Failed: ', () => String($error())), () => record($post).$title)
)
```

- `resolved` accepts a promise, a value or an accessor returning either. A new promise keeps the stale result while pending and ignores results of superseded promises. An accessor source is lazy until first read.
- `task($signal, promise)` attaches work to a signal; `await waitTasks($signal)` waits for the tasks of that signal and of every signal it currently depends on. A `computed`, including the `resolved` tuple, links its dependencies only once read or rendered: read or render it before `waitTasks`, or wait on the signal the task was attached to.
- Remote data with caching, deduplication and mutations lives in `@nano_kit/query`: the nano-kit-query skill.

### Lazy stores

```ts
const $weather = mountable(signal<Weather | null>(null))
onMount($weather, () => {              // first subscriber arrives
  const id = setInterval(refresh, 60_000)
  return () => clearInterval(id)       // one second after the last subscriber leaves
})
onMountEffect($weather, () => { void refresh($city()) })   // an effect alive only while mounted
```

- A signal is mounted while an effect or a binding subscribes to it: a text or attribute child, `if_($x)`, `show_($x)`, `for_($items)`. Reading it in a component body does not mount it. `start($x)` mounts it by hand and returns a stop; `exec($x)` starts it, stops it at once and then reads the value.
- `onMount`, `onStart`, `onStop`, `onMounted`, `onMountEffect`, `onMountEffectScope` take a `Mountable` signal: wrap with `mountable($x)` first, the types require it. `onStart` and `onStop` fire without the one-second delay; `STORE_UNMOUNT_DELAY` is exported for tests.

### Types

- Worth importing: `Accessor`, `ReadableSignal`, `WritableSignal`, `Signalish`, `SignalishValue`, `EmptyValue`, `FalsyValue`, `Destroy`, `EffectCallback`, `Mountable`, `Injectable`, `Resolved`.

## Related

- Unit tests for views: the nanoviews-testing skill. Stories: the nanoviews-storybook skill.
- Nano Kit packages have their own skills: nano-kit-store (`@nano_kit/store`: kida plus `paced`, storage-backed signals, hydration), nano-kit-query (remote data), nano-kit-platform-web (browser API signals), nano-kit-intl (internationalization), nano-kit-react-router (the `@nano_kit/router` core). Docs: https://nano-kit.js.org. One kida instance must serve the whole graph: if `@nano_kit/*` resolves a different kida than nanoviews, override `kida` and `agera` to one version.
