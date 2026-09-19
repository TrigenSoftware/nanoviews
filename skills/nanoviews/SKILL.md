---
name: nanoviews
description: "Rules for writing user interfaces with nanoviews, a tiny Direct DOM view library on kida signals: the element call shape `div({ attrs })(...children)`, signals and accessors as the only reactive values, components with `component$` and `props$`, blocks (`if_`, `show_`, `for_`, `match_`, `switch_`), form bindings (`value`, `checked`, `defaultValue`), effects, slots, dependency injection and the kida store API. Apply when creating or editing components, views, forms, lists or stores wired into views in any file that imports from `nanoviews`, `nanoviews/store`, `@nanoviews/*` or `@nano_kit/*`, whether or not the request names the library. Tests and stories have their own skills, nanoviews-testing and nanoviews-storybook."
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
import { button, component$, mount } from 'nanoviews'

const Counter = component$(() => {
  const $count = signal(0)

  return button({ onClick: () => $count(n => n + 1) })('count is ', $count)
})

const unmount = mount(Counter, document.querySelector('#app')!)
```

## Mental model

- `tag(attrs?)` describes the element; the second call `(...children)` keeps the children and is optional, so `div({ class: 'x' })` alone is a valid child. The node is built when the description is inserted into its parent, or by hand with a call with no arguments: `div()('x')()` is an `HTMLDivElement`. Void tags have no children call: `input({ type: 'text' })`, `img({ src })`, `br()`.
- A component is `component$((props, children) => view)`, never a plain function: an instance takes children like an element and renders when it is built into the parent, after the parent's own render, so the parent's `context$` and scope are in place; a plain function would run where it is called, before they exist. State lives in signals and the DOM follows through bindings. Build only under `mount` (or a test `render`): a bare `App()()` throws at the first binding or `effect$`, which need the scope `mount` opens.
- A reactive value is an *accessor*: a signal `$x` or an arrow `() => ...`. Pass it to bind, call it to read now. Every function child or non-`on*` attribute is treated as an accessor and tracked.
- A static value renders once; anything that must change later has to be a signal or an accessor. Ternaries and `.map()` run once at build time; reactive conditions and lists need blocks.
- No hooks, no dependency arrays, no re-render: `effect$` can go anywhere in the build, once.
- Naming: signals and accessors `$name`; helpers end with `$` where a plain name would shadow a common one (`component$`, `context$`, `props$`, `effect$`); flow blocks end with `_` (`if_`, `for_`); injectable factories `Name$`.

## Elements, children, attributes, events

```ts
p({ class: 'note', title: () => `${$count()} items`, hidden: $done })(
  'Hello, ', $name, '!',            // reactive text: separate children, never a template string
  ' ', b()(() => $count() * 2),     // arrow child: derived reactive text
  br(), fragment('a', 'b'),
  ...items.map(item => i()(item))   // static list: spread a plain array
)
```

- Children: descriptions (`span()` alone is fine), component instances, nodes, strings, numbers, signals and accessors (live text nodes). `null`/`undefined` render nothing; `true`, `false` and `0` render as text, so gate with `cond ? x : null` or a block. A bare array throws: spread it.
- Call components: `div()(Counter())`. An uncalled component is a type error (untyped, it would be read as an accessor and its return stringified). A description inserted twice is built twice; build it by hand and insert the node to share it.
- Attribute names follow the type definitions: HTML spelling for single words (`class`, `for`, `hidden`), camelCase for multi-word names (`tabIndex`, `readOnly`, `autoComplete`; lowercase `tabindex` is a type error), quoted dashed names (`'aria-expanded'`, `'data-id'`; `data-*` is typed on HTML elements only).
- Attribute values are static or accessors. `null`, `undefined` and `false` remove the attribute, so `disabled: $busy` toggles like in React. `aria-*`, `data-*`, `draggable`, `contentEditable` and `spellCheck` are the exception: `false` is written as the string `"false"`, so pass a boolean signal or accessor to them directly (a `string` accessor is rejected on `aria-*`).
- `value` and `checked` of a control, and `value` of a `select`, are its live state, bound through the DOM properties (see "Forms"); every other attribute goes through `setAttribute`.
- `class` takes a string, an accessor or a list: `class: ['btn', () => $active() && 'btn_active']` joins the truthy strings and drops the rest, nested lists included, so a component folds the `class` it received into its own with `class: ['card', $class]`. The list is read once at build; the class changes through the accessors in it. `classList(...parts)` builds the same class away from an element: an accessor when a part is an accessor, a plain string otherwise. A list with no accessor in it costs no effect.
- `style` takes an object of camelCased properties, or an accessor of one: `style: () => ({ color: $color(), '--gap': '4px' })`. A property the next object no longer names is dropped. No style strings.
- `ref: $element` or `ref: element => ...` receives the element on build and `null` on unmount. `autoFocus: true` focuses the element once it is in the document.
- `muted` on `audio`/`video` is the live property, two-way with a writable signal through `volumechange`; the attribute would only be the default the browser reads at creation.
- Events: `on` + PascalCase DOM event name (`onClick`, `onInput`, `onKeyDown`, `onDblClick`, `onPointerDown`), `Capture` suffix for the capture phase. The handler gets the native event with a typed `target`; reads inside are untracked and writes are not batched. A writable signal given as a handler receives the event.
- `fragment(...children)` describes a `DocumentFragment`, which empties into the parent on insertion. `mount(app, target)` builds the tree `app` returns and returns the unmount function, which stops effects and removes the nodes.
- Factories share names with globals: `style` and `slot` are elements (`style` the attribute is the binding), `title`, `map`, `data`, `object` exist too; `var` is imported as `{ var as htmlVar }`. Alias on collision.

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
- `a`, `title`, `style` and `script` exist in both entries, and `switch` is imported as `{ switch as svgSwitch }`; alias on collision. `ref`, `style` objects, `autoFocus` and `class` lists work on SVG elements too.
- `Attributes<'circle'>`, `ElementName` and the factory types come from `nanoviews/svg` under the same names as the HTML ones in `nanoviews`.

## Reactivity (`nanoviews/store`)

```ts
const $count = signal(0)             // read $count(), write $count(1) or $count(n => n + 1)
const $double = computed(() => $count() * 2) // lazy, cached, read-only
effect$(() => {                      // from 'nanoviews', in a component: first run once the tree is appended
  document.title = `${$count()}`     // re-runs on tracked change
  return () => {}                    // cleanup: before each re-run and on unmount; return nothing else
})
const stop = effect(() => {})        // store effect: runs at once wherever it is called, returns the stop
batch(() => { $a(1); $b(2) })        // one flush for several writes; handlers, timers and callbacks never batch
const $user = record($userSignal)    // $user.$name, $user.$age: child signals, writable when the parent is
const [$post, $error, $pending] = resolved(() => fetchPost($id())) // async: stale value kept while pending
```

- Types from `nanoviews/store`: `Signalish<T>` = `T | Accessor<T>`, `Accessor<T>` = `() => T`, `ReadableSignal<T>`, `WritableSignal<T>`. Read a signalish with `$get(value)` (tracked) or `get(value)` (untracked). `effect$` is the component effect and comes from `nanoviews`; `effect` and `effectScope` come from `nanoviews/store` and are the store effects: they run at once and are never deferred or paused. `Signalish`, `Accessor`, `WritableSignal`, `ReadableSignal` are exported only from `nanoviews/store`.
- Writing an equal value (same reference) is a no-op, so an object mutated in place does not notify. Write a new array or object, or use `push`, `setIndex`, `deleteIndex`, `setKey`, `updateArray`.
- Inline arrow in a view = one binding recomputed when its dependencies change. `computed` = cached and shareable. Use the arrow for a single use, `computed` for a value read in several places; `length($arr)` and `boolean($x)` are ready-made computeds.
- The full store API (records, arrays, lazy `mountable` stores, subscriptions, `selector`, tasks, DI) is under "Signals in depth" below.

## Components

```ts
import type { Signalish } from 'nanoviews/store'
import type { ClassValue } from 'nanoviews'
import { button, effect$, component$, props$ } from 'nanoviews'

interface ButtonProps {
  label: Signalish<string>
  size?: Signalish<'s' | 'm'>
  class?: ClassValue
  onSelect?: () => void
}

const Button = component$((props: ButtonProps, children) => {
  const { $label, $size = () => 'm', $class, onSelect, ...rest } = props$(props)

  effect$(() => () => console.log('unmounted')) // effect with no reads: mount/unmount hook

  return button({ class: ['btn', () => `btn_${$size()}`, $class], onClick: onSelect, ...rest })($label, ...children)
})

Button({ label: 'Send' })          // props only
Button({ label: 'Send' })(' now')  // props and children
```

- Props are plain values or signals. Type them `Signalish<T>` when either is fine, `Accessor<T>` for read-only reactive input, `WritableSignal<T>` for two-way state (name those `$value`). Reading `props.$x()` at build time freezes that value.
- `props$(props)` adds a `$name` accessor twin per prop (the signal itself, a wrapper for a static value, a function as is, `undefined` when absent so destructuring defaults apply). Taking `$name` removes the prop from `...rest`, which then holds only the keys not taken as `$name`; take every non-attribute prop out before spreading `rest` onto an element. A component that takes arbitrary element attributes types them `Attributes<'div'>`.
- `component$((props: Props, children) => view)` makes the component callable as `Card(props)('text', b()('bold'))` and as `Card(props)` alone; `children` is always an array, `props` is optional when every prop is. Type the props on the parameter, not as a generic. The render runs when the instance is built into its parent; an instance called with no arguments renders by hand and returns what the render returned. The children are typed on the second parameter the same way: `[render]: [render: (item: T) => Child]` makes a render prop, `children: ComponentInstance[]` takes instances only. Named slots are under "Slots" below.
- `effect$` in a component first runs once the whole tree is appended, so measuring and focusing are safe on the first run. It belongs to the scope of the view being built, so it works only under `mount`: at module level it throws, and a store uses `effect`.
- Dependency injection: `App` opens the root context once (`return context$()(main()(...))`); a component calls `inject(Theme$)` during render and closes over the result for its handlers and effects (`inject` inside a handler or effect throws). A component provides to its children with `context$(provide(Theme$, $theme))(div()(...children))`: the children are built inside. Details under "Dependency injection in depth".

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
- `show_` builds once and parks the tree while hidden: detached from the document, state kept, bindings still updating, effects stopped (cleanup run) and restarted on show. No else branch. Keep `portal` and `ref` out of it: `portal(() => document.body, show_($open, () => Modal()))`, and `if_` for a subtree that needs `ref` (details under "Raw HTML, shadow DOM, portals").
- `switch_` matches by strict equality against plain case values; `match_` stops at the first truthy case and `default_` is shared by both. `batch` writes to several `match_` conditions or the frame in between shows.
- `for_`: give a tracker (`trackById`, `trackBy('key')`, `item => item.id`) whenever items are objects or rows hold state; without one rows are positions and a reorder rewrites values into existing rows. A repeated key is not detected: its row is silently dropped.
- Each row gets `$item` (a signal; for a `WritableSignal<T[]>` it is writable: `$item(next)` and `record($item).$done(true)` write a new item and array back, so computeds recompute; a list typed `T[] | null` gets read-only rows, so keep list signals non-nullable), `$index` (a signal) and the plain key. Read only `$item()`/`$index()` inside a row: `$items()` there re-runs every row on every change. Per-row selection: one `const $isSelected = selector($selectedId)` outside the loop, then `class: () => $isSelected(key) ? 'active' : ''` in each row.
- A computed list gives read-only rows. To filter or sort while keeping rows editable, iterate the writable source and gate each row: `$item => show_(() => keep($item()), () => Row({ $item }))`.
- `as_(record, ($item, $index, key) => ...)` applies a transform to every row and keeps writes bound. The second argument of the row call renders the empty state, for `[]` and for `null`. A static array takes no tracker: `for_(list)((item, index) => ...)` renders once; a static condition renders once with no block.
- `throw_(new Error('...'))` throws inside an expression.

## Forms

```ts
const $name = signal('')
const $note = signal('')
const $agree = signal(false)
const $plan = signal('pro')

form({ onSubmit: event => { event.preventDefault(); save($name()) } })(
  label({ for: 'name' })('Name'),
  input({ id: 'name', type: 'text', value: $name, autoFocus: true }),
  textarea({ value: $note }),
  input({ type: 'checkbox', checked: $agree }),
  select({ value: $plan })(option({ value: 'free' })('Free'), option({ value: 'pro' })('Pro')),
  button({ type: 'submit', disabled: () => !$agree() })('Save')
)
```

- `value` (text inputs, `textarea`; `input` event), `checked` (checkbox, radio; `change`; the `Indeterminate` symbol is the third state) and `value` of a `select` (`change`; `multiple: true` with a `string[]` signal) are bound through the DOM properties: a plain value is set once, an accessor is followed, a writable signal is two-way. A read-only accessor, a computed say, only drives the control.
- Attributes are applied in key order, and on a control it matters: put `value` before an `onInput` key that reads or rewrites the signal, and on a `range` input put `min`, `max` and `step` before `value` and `defaultValue`, since the browser clamps the value to the bounds that are there when it is written.
- A value rewritten under the user keeps the caret: a formatter in `onInput` or an `effect$` writing the signal back is fine.
- `textarea` is void: no children call, its text is `value` or `defaultValue`.
- `defaultValue` (`input`, `textarea`, `select`) and `defaultChecked` set the default a form reset returns to; one way, a plain value or an accessor. A bound `value` leaves the default alone.
- A `select` follows its value into the options built later (`for_`, async data) and into an option whose `value` attribute or text changes; they are selected a microtask after they land, and so is a plain `value`. A signal `value` is applied at mount and on write, synchronously.
- No file binding: read `event.target.files` in `onChange`.
- `ref`: a callback `element => ...` or a `signal<HTMLInputElement | null>(null)` gets the element from build to unmount, then `null`. Both are typed by the element: a wider `HTMLElement | null` or `Element | null` fits, another element is a type error.
- `style`: `style: () => ({ backgroundColor: $color(), fontSize: '12px', '--gap': '4px' })`, camelCase keys, units spelled out; a property missing from the next object is removed; on `HTMLElement` and `SVGElement`. `autoFocus: true` focuses once the element is in the document; an accessor is read once, at build; dynamic focus goes through `ref`.

## Differences from React, Solid and Svelte

- Type errors: `className`, `htmlFor`, `key`, `onDoubleClick` (use `class`, `for`, a tracker, `onDblClick`). `value`/`checked` are the live state and `defaultValue`/`defaultChecked` the reset defaults, as in React; there is no `files` binding.
- Do not unwrap a signal at build time (`const count = $count()`) for anything the view shows: it freezes. Pass `$count` or `() => ...`.
- Do not `.map` a signal array or `if` on a signal at build time; use `for_`, `if_`, `match_`. Do not interpolate a signal into a template string child.
- A function argument to a signal is a reducer; store a function as `$fn(() => handler)`.

## Unsupported

- No SSR, hydration, router or error boundaries in nanoviews itself; routing comes from the `@nano_kit/router` core (see the nano-kit-react-router skill, there is no nanoviews adapter yet).
- Exported but internal, do not use: `deferScope`, `boundDeferScope`, `startScope`, `stopScope`, `pauseScope`, `resumeScope`, `unsafeRun`, `createSignal`, `computedOper`, `nextValue`, `signalNextValue`, `assignIndex`, `assignKey`, `onSignal`, `unsafeMark*`, node and flag constants, and `createElement`/`createVoidElement`/`create*Factory` beyond known tag names.

## Slots

A slot is a component made with `slot$`; a layout declares the slots it takes with `slots$` and gets them as positional arguments after `props`, in declaration order, with the rest of the children last:

```ts
import type { Attributes } from 'nanoviews'
import { main, header, footer, component$, slot$, slots$ } from 'nanoviews'

const LayoutHeader = slot$<Attributes<'header'>>((props, children) => header(props)(...children))
const LayoutFooter = slot$<Attributes<'footer'>>((props, children) => footer(props)(...children))

const Layout = component$(slots$([LayoutHeader, LayoutFooter], (props: Attributes<'main'>, headerSlot, footerSlot, children) => main(props)(
  headerSlot, ...children, footerSlot
)))

Layout()(LayoutHeader({})('Top'), 'Body', LayoutFooter({})('Bottom'))
```

- A slot the caller did not pass arrives as `undefined` and renders nothing; slots are typed `SlotInstance<Props, Children> | undefined`.
- An instance of a slot component the layout did not declare throws `Slot is not declared in slots$` at the layout's render. Declare every slot a caller may pass.
- Passing the same slot twice keeps the last one.
- A slot instance without the children call, `LayoutHeader(props)`, is a slot with no children; a slot instance outside a `slots$` layout renders as an ordinary component.
- A slot renders inside the layout's tree: the layout hands it data with `context$` (`context$(provide(Draft$, $draft))(footerSlot)`) and the slot injects it; a function child, `slot$<Props, [render: (draft: WritableSignal<string>) => Child]>`, is how a caller passes a render function.
- `getSlots(defs, children)` is the splitter behind `slots$`, for a component that wants its children raw.

## Own bindings

There are no custom attributes: an element behaviour of your own is a `ref` callback that opens an `effect$`. The callback runs while the element is built, so the effect belongs to the enclosing block and is torn down with it; it gets `null` on unmount, so guard.

```ts
import { $get, type Signalish } from 'nanoviews/store'
import { div, effect$ } from 'nanoviews'

const withTitle = ($title: Signalish<string>) => (element: HTMLElement | null) => {
  if (element) {
    effect$(() => {
      element.title = $get($title)
    })
  }
}

div({ ref: withTitle($title) })('text')
```

- Built-in bindings (`style`, text, attributes, `value`) apply their first value synchronously through an internal non-deferred effect; `effect$` runs after mount and pauses while a `show_` is hidden. The store `effect` runs at build time, like the built-in bindings, and keeps running while hidden.

## Raw HTML, shadow DOM, portals

```ts
dangerouslySetInnerHtml(div({ class: 'md' }), $html) // takes the uncalled div({...}), returns the element
shadow(div({ id: 'host' }), { mode: 'open' })(style()(':host { display: block }'), 'inside')
portal(() => document.body, div({ class: 'modal' })('in the body'))
```

- `dangerouslySetInnerHtml(factory, html)` takes an uncalled description or any `() => Element` and accepts a static string or a signal; it describes the element and sets `innerHTML` on build, so no children call follows.
- `shadow(factory, init)` describes the host element and takes the children like an element; on build it attaches the shadow root and puts the children into it. Hosts must allow a shadow root (`div`, `span`, custom elements).
- `portal(target, child)` describes an empty child; on build it calls `target()` and mounts the child there, so the target must exist by then. Removal is registered on the enclosing scope, so a portal inside a component or an `if_` branch is removed with it. A component that only portals returns `portal(...)`.
- Never put a `portal` inside `show_`: hiding runs the removal and showing again does not re-append. Toggle a portalled tree the other way round, `portal(() => document.body, show_($open, () => Modal()))`: while hidden the parked DOM leaves the target and comes back with its state on show. The same applies to `ref` under `show_`, which stays `null` after the first hide; use `if_` there.

## Dependency injection in depth

`inject(Factory$)` runs the factory once per context and caches the instance; parent contexts are searched first, so a value resolved at the root is shared by every child context. `provide(Factory$, value)` returns a provider tuple for `context$(...)` and short-circuits the factory. A factory's return value is the default, so contexts have defaults for free.

```ts
import { signal, computed, mountable, onMount, Injectable$ } from 'nanoviews/store'
import { main, button, component$, context$, isolate$, provide, inject } from 'nanoviews'

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

const Settings = component$(() => {
  const $theme = inject(Theme$)                           // inject during render, close over the result
  const api = inject(Api$)
  return button({ onClick: () => api.save() })('Save (', $theme, ')')
})

export const App = component$(() => context$()(main()(Settings()))) // root context: required before any inject

context$(provide(Theme$, signal<Theme>('dark')))(Settings()) // child context with an override
isolate$(context$(provide(Theme$, $inner))(Settings()))     // fresh tree, inherits nothing
```

- `context$(...providers)(child)` describes the child built within a context: a child context with the providers, the root one when none exists yet, and the current one when there are no providers to add. The child is one description, so several children go under an element: `context$(provide(X$, x))(div()(...children))`.
- The child is built inside the context, not the call that describes it: `Segment()` created as an argument of `SegmentedControl()(...)` still injects what `SegmentedControl` provides, because its render runs on build. A plain function called in place would run early, which is why components are always `component$`.
- A provided value must have exactly the factory's return type. `signal('dark')` infers `WritableSignal<string>` and `signal<'dark'>('dark')` is a `WritableSignal<'dark'>`; signals are invariant, so neither satisfies a `WritableSignal<'light' | 'dark'>` factory. Annotate with the factory's type: `signal<Theme>('dark')`.
- `inject` works only synchronously during render. Inside an effect, an event handler, a promise callback or a timer there is no current context and it throws: inject everything a component needs in its body and close over it. `getContext`, `run` and `InjectionContext` are library-author tools, not application code. A factory may throw `DependencyNotFound('Name$')` for a dependency it refuses to default.
- Blocks remember their context: a branch rendered later by `if_`, a row created later by `for_`, and the tracker function all resolve `inject` correctly.
- A factory uses the store `effect`, never `effect$`: its effects run immediately and are never stopped by unmount; give a store lazy work through `mountable` plus `onMount` (see "Lazy stores").
- Two sibling child contexts asking for a factory nobody resolved above get two instances. Resolve shared services at the root first.
- `isolate$(child)` builds the child without any injection context: nothing above is reachable and a bare `inject` inside throws. Open a fresh tree inside it with `context$`.

## Effect ordering guarantees

- A signal-driven `if_`, `swap_`, `match_`/`switch_` branch or `for_` row is its own scope and its effects start before the effects of the scope that contains it, innermost first. `show_` is the exception: its content effects are started by the toggle effect, in the containing scope's creation order. A block with a static condition is rendered inline and has no scope of its own.
- Effects in the same scope start in creation order. A `component$` child renders when the parent's returned tree is built, after the parent's render has finished, so every effect of the parent's render precedes the effects of its component children; a plain function child runs, and creates its effects, where it is called.
- On a swap the old branch's cleanups run while its DOM is still attached, the DOM is removed, the new branch is rendered, then its effects start. Removed rows are destroyed before new rows start.
- Under a hidden `show_`, `effect$` effects have run their cleanup and re-run on show with `warmup === true` again; text, attribute and `style` bindings keep updating the parked DOM.
- Writes made during render and during unmount are batched by `mount`. Writes made inside a running effect are queued onto the flush already running, so they land together; a `batch` there flushes nothing either. Everywhere else (handlers, timers, promise callbacks) every write flushes on its own; wrap several in `batch`.
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

- `effect` is the store effect: it runs immediately wherever it is called, at module level, in a factory or in a component, and returns the stop. In a component it is still stopped by unmount, but it is neither deferred until the tree is appended nor paused by `show_`: that is `effect$` from `nanoviews`, which takes the same body and returns nothing.
- Return a cleanup function or nothing. An `async` body is a type error (a `Promise` is not a cleanup) and, forced through, the promise is called as the cleanup and throws: keep the body synchronous and write `void refresh()` inside it.
- The cleanup runs with the signals already holding their new values; capture what it needs in the run's closure.
- `effectScope(fn)` groups effects created in `fn` and returns one stop. `composeDestroys(a, b)` merges several cleanups into one.
- Ordinary code uses `effect`; `subscribe`, `listen`, `observe` and `subscribeAny` are low-level variants.
- `action(fn)` wraps a function so reads inside never subscribe the caller: use it for store methods called from effects.
- `batch(fn)` flushes once at the end of the outermost batch and returns `fn`'s result; inside a running effect it flushes nothing, the writes join the flush already running.

### Values in and out

- `SignalishValue<T>` unwraps a `Signalish<T>` type.
- `isAccessor(x)` is `typeof x === 'function'`; `isSignal(x)` also requires a signal node; `isWritable($x)`, `isMountable($x)`, `isEmpty(x)` (`null`/`undefined` only).
- `toAccessor(x)` returns a function as is, wraps a value in `() => x`. `toSignal(x)` returns a signal as is, wraps a plain function in `computed`, a value in `signal`.
- Cheap uncached accessors, exported by kida but absent from its README: `not`, `is`, `isNot`, `and`, `or`, `some`, `every`, `gt`, `gte`, `lt`, `lte`, `when($cond, then, else?)`, `pick(collection, $key)` and the template tag ``f`Toggle ${$label}` ``. They cost no graph node and recompute on every read; with no accessor among the operands they return the plain result instead of an accessor. An inline arrow does the same with no import, and `computed` caches when the value is shared or expensive.
- Cached derivations: `length($arr)`, `boolean($x)`.
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
