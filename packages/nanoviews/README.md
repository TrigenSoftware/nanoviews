# nanoviews

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/nanoviews.svg
[npm-url]: https://npmjs.com/package/nanoviews

[deps]: https://img.shields.io/librariesio/release/npm/nanoviews
[deps-url]: https://libraries.io/npm/nanoviews

[size]: https://deno.bundlejs.com/badge?q=nanoviews
[size-url]: https://bundlejs.com/?q=nanoviews

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../../assets/moon_white.svg">
  <img alt="Halftone moon logo" src="../../assets/moon_black.svg" width="100" height="100" align="right">
</picture>

A small Direct DOM library for creating user interfaces.

- **Small**. Between 3.5 and 7 kB (minified and brotlied). Zero external dependencies[*](#reactivity).
- **Direct DOM**. Less CPU and memory usage compared to Virtual DOM.
- Designed for best **Tree-Shaking**: only the code you use is included in your bundle.
- **TypeScript**-first.

```js
import { signal } from 'nanoviews/store'
import { div, a, img, h1, button, p, component$, mount } from 'nanoviews'

const App = component$(() => {
  const $counter = signal(0)

  return div()(
    a({ href: 'https://vitejs.dev', target: '_blank' })(
      img({ src: './vite.svg', class: 'logo', alt: 'Vite logo' })
    ),
    a({ href: 'https://github.com/TrigenSoftware/nanoviews', target: '_blank' })(
      img({ src: './nanoviews.svg', class: 'logo nanoviews', alt: 'Nanoviews logo' })
    ),
    h1()('Vite + Nanoviews'),
    div({ class: 'card' })(
      button({
        onClick() {
          $counter($counter() + 1)
        }
      })(
        'count is ', $counter
      )
    ),
    p({ class: 'read-the-docs' })('Click on the Vite and Nanoviews logos to learn more')
  )
})

mount(App, document.querySelector('#app'))
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#reactivity">Reactivity</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#basic-markup">Basic markup</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#element-bindings">Element bindings</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#form-controls">Form controls</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#components">Components</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#control-flow">Control flow</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#special-methods">Special methods</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#why">Why?</a>
<br />
<hr />

## Install

```bash
pnpm add nanoviews
# or
npm i nanoviews
# or
yarn add nanoviews
```

## Reactivity

Nanoviews is using [Kida](https://github.com/TrigenSoftware/nano_kit/tree/main/packages/kida) under the hood for reactivity. Kida is a signal library inspired by [Nano Stores](https://github.com/nanostores/nanostores) and was build specially for Nanoviews.

```js
import { signal } from 'nanoviews/store' // or import { signal } from 'kida'
import { fragment, input, p } from 'nanoviews'

const $text = signal('')

fragment(
  input({
    onInput(event) {
      $text(event.target.value)
    }
  }),
  p()($text)
)
```

Basicly, under the hood, reactivity works something like that:

```ts
import { signal, effect } from 'kida'

const $text = signal('')
const textNode = document.createTextNode('')

effect(() => {
  textNode.data = $text()
})
```

## Basic markup

Nanoviews provides a set of methods for describing HTML elements with the specified attributes and children. A description is a function: called with children it keeps them, called with no arguments it builds the DOM node. The parent makes that call when it is built itself, so a whole tree is built top-down by `mount`.

Child can be another description, a DOM node, primitive value (string, number, boolean, `null` or `undefined`) or signal with primitive. Attributes also can be a primitive value or signal.

```js
import { signal } from 'nanoviews/store'
import { ul, li } from 'nanoviews'

const $count = signal(0)
const list = ul({ class: 'list' })(
  li()('String value'),
  li()('Number value', 42),
  li()('Signal value', $count)
)
// `list` describes the list, `list()` builds the HTMLUListElement
```

`null`, `undefined`, `true` and `false` render nothing, the way they do in React, so a static condition needs no `: null`. `0` is a number and renders as text:

```js
import { ul, li } from 'nanoviews'

const list = ul()(
  li()('Profile'),
  isAdmin && li()('Settings')
)
```

A DOM node made elsewhere is a child too and goes into the tree as is, so vanilla code needs no wrapping:

```js
import { div } from 'nanoviews'

const canvas = document.createElement('canvas')

canvas.getContext('2d').fillRect(0, 0, 10, 10)

const chart = div({ class: 'chart' })(canvas)
```

### mount

`mount` is a method that mounts the component to the specified container.

```js
import { div, h1, p, component$, mount } from 'nanoviews'

const App = component$(() => (
  div()(
    h1()('Nanoviews App'),
    p()('Hello World!')
  )
))

mount(App, document.querySelector('#app'))
```

### SVG

SVG elements live in the `nanoviews/svg` entry point, so their code stays out of the bundle of an app that never draws one. The factories work the same way as the HTML ones, but create elements in the SVG namespace. Attributes are camelCase like in React: presentation attributes such as `strokeWidth` reach the DOM as `stroke-width`, the rest keep their SVG spelling, like `viewBox`.

```js
import { signal } from 'nanoviews/store'
import { svg, circle, path } from 'nanoviews/svg'

const $radius = signal(10)
const icon = svg({ viewBox: '0 0 24 24', width: 24, height: 24 })(
  circle({ cx: 12, cy: 12, r: $radius, fill: 'none', stroke: 'currentColor', strokeWidth: 2 }),
  path({ d: 'M8 12l3 3 5-6', fill: 'none', stroke: 'currentColor' })
)
// `icon` describes the image, `icon()` builds the SVGSVGElement
```

HTML inside `foreignObject` comes from `nanoviews`. `a`, `title`, `style` and `script` exist in both entry points, so alias one of them in a module that imports both.

### Classes

`class` takes a string, an accessor, or a list of parts. A list joins every truthy string with a space and drops everything else. A part can be an accessor, and the class follows it.

```js
import { signal } from 'nanoviews/store'
import { button } from 'nanoviews'

const $primary = signal(true)

button({
  class: ['button', () => $primary() && 'primary']
})(
  'Click me'
)
// <button class="button primary">Click me</button>
```

A list may hold another list, so a component folds the `class` it received into its own, as the [`props$`](#props) example does. The list itself is read once, when the element is built: the class changes through the accessors in it. Lists work the same way on the SVG elements from `nanoviews/svg`.

`classList` builds the same class away from an element. With an accessor among the parts it returns an accessor, otherwise a plain string:

```js
import { classList } from 'nanoviews'

const $class = classList('button', () => $primary() && 'primary')

$class() // 'button primary'
```

## Element bindings

A few attributes are bound to the element rather than written as attributes.

### ref

`ref` receives the DOM node once it is built, and `null` once it is unmounted. It takes a callback or a writable signal.

```js
import { signal } from 'nanoviews/store'
import { div, canvas } from 'nanoviews'

const $ref = signal(null)

div({
  ref: $ref
})(
  'Target element'
)

canvas({
  ref: element => element?.getContext('2d').fillRect(0, 0, 10, 10)
})()
```

The callback runs while the element is built, before it is in the document. Work that needs the document, measuring or scrolling say, goes to an [`effect$`](#effect) that reads the signal:

```js
effect$(() => {
  $ref()?.scrollIntoView()
})
```

Both are checked against the element: a `signal<HTMLButtonElement | null>` fits a `button`, a wider `HTMLElement | null` or `Element | null` fits any element, and a signal of another element is a type error.

### style

`style` takes an object of camelCased CSS properties, or an accessor of one to follow. A property the new object no longer names is dropped.

```js
import { signal } from 'nanoviews/store'
import { button } from 'nanoviews'

const $color = signal('white')

button({
  style: () => ({
    color: $color(),
    backgroundColor: 'black'
  })
})(
  'Click me'
)
```

Custom properties go through the same object: `style: { '--gap': '4px' }`.

### autoFocus

`autoFocus: true` focuses the element once it is in the document. The `autofocus` attribute is not written: the browser honours it once per page load, so an element built later would never take the focus.

```js
import { input } from 'nanoviews'

input({
  type: 'text',
  autoFocus: true
})
```

### muted

`muted` on `audio` and `video` is the live state of the element, bound through the DOM property: the attribute is only a default the browser reads when it creates the element, so it would do nothing on an element built later. A writable signal also receives what the user does with the controls.

```js
import { signal } from 'nanoviews/store'
import { video } from 'nanoviews'

const $muted = signal(true)

video({
  src: 'clip.mp4',
  controls: true,
  muted: $muted
})
```

## Form controls

`input`, `textarea` and `select` bind their state through the DOM properties, not the attributes, so what the user does and what the signal holds stay one thing. A plain value is set once, an accessor is followed, and a writable signal also receives the user's input.

### value

```js
import { signal } from 'nanoviews/store'
import { input, textarea } from 'nanoviews'

const $name = signal('')
const $review = signal('')

input({
  type: 'text',
  value: $name
})

textarea({
  name: 'review',
  value: $review
})
```

Attributes are applied in the order of the keys, and for a control the order can matter. A `range` input clamps its value to the bounds that are there at the moment it is written, so `min`, `max` and `step` go before `value` and `defaultValue`. A handler for the event a binding listens to, `onInput` for `value`, sees the new value in the signal only when it stands after the binding.

`textarea` takes no children: its text is its `value`. A read-only accessor, such as a computed, only drives the control, and what the user types stays in it. A value rewritten under the user, by a formatter say, keeps the caret where it was.

### checked

`checked` binds a checkbox or a radio button the same way. The `Indeterminate` symbol is the [third state](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes) of a checkbox:

```js
import { signal } from 'nanoviews/store'
import { input, Indeterminate } from 'nanoviews'

const $checked = signal(false)

input({
  type: 'checkbox',
  checked: $checked
})

$checked(Indeterminate)
```

### select

`value` on a `select` is the value of the selected option, or the list of them under `multiple`:

```js
import { signal } from 'nanoviews/store'
import { select, option } from 'nanoviews'

const $selected = signal('mid')

select({
  name: 'player-pos',
  value: $selected
})(
  option({
    value: 'carry'
  })('Yatoro'),
  option({
    value: 'mid'
  })('Larl'),
  option({
    value: 'offlane'
  })('Collapse'),
  option({
    value: 'support'
  })('Mira'),
  option({
    value: 'full-support'
  })('Miposhka')
)
```

Multiple select:

```js
const $selected = signal(['mid', 'carry'])

select({
  name: 'player-pos',
  multiple: true,
  value: $selected
})(
  option({
    value: 'carry'
  })('Yatoro'),
  option({
    value: 'mid'
  })('Larl'),
  option({
    value: 'offlane'
  })('Collapse'),
  option({
    value: 'support'
  })('Mira'),
  option({
    value: 'full-support'
  })('Miposhka')
)
```

The options follow the value, the ones built later included: options rendered by `for_` or coming with async data are selected once they are in, and an option whose `value` or text changes is looked at again.

### defaultValue and defaultChecked

The default of a control, what a form reset returns it to, is set apart from its value, the React way: `defaultValue` on `input`, `textarea` and `select`, `defaultChecked` on a checkbox or a radio button. They are one way.

```js
import { form, input, textarea, select, option, button } from 'nanoviews'

form()(
  input({
    type: 'text',
    defaultValue: 'Yatoro'
  }),
  input({
    type: 'checkbox',
    defaultChecked: true
  }),
  textarea({
    defaultValue: 'Write your review here'
  }),
  select({
    defaultValue: 'mid'
  })(
    option({
      value: 'carry'
    })('Yatoro'),
    option({
      value: 'mid'
    })('Larl')
  ),
  button({
    type: 'reset'
  })('Reset')
)
```

Files have no binding: read `event.target.files` in the `onChange` handler of a file input.

## Components

Components are the building blocks of any application. These units are reusable and can be combined to create more complex applications.

A component is made with `component$`. Its render returns a description, a node or a primitive, and runs when the instance is built into the parent, so the parent's context and scope are already in place:

```ts
const MyComponent = component$(() => (
  div()('Hello, Nanoviews!')
))
```

### props$

`props$` is a method that adds a `$`-prefixed accessor twin to every prop. `title` is the prop as it arrived, `$title` is the same prop in accessor form: the prop itself when it already is a signal or an accessor, a wrapper when it is a static value, and `undefined` when the prop is not set, so a destructuring default can fill it in.

A prop read as `$title` leaves the rest, so `...restProps` carries exactly the props the component did not take, in the form they arrived in, straight onto an element:

```js
import { button, component$, props$ } from 'nanoviews'

const Button = component$((props) => {
  const {
    $class,
    $size = () => 'm',
    ...restProps
  } = props$(props)

  return (
    button({
      ...restProps,
      class: ['button', () => `button_${$size()}`, $class]
    })(
      'Send'
    )
  )
})

Button({ title: 'Send it', size: 's', id: 'send', class: 'wide' })
// <button title="Send it" id="send" class="button button_s wide">Send</button>
```

### effect$

`effect$` is a method that adds effects to the component. The effect first runs once `mount` has appended the tree, re-runs when a signal it read changes, and is stopped on unmount. It belongs to the scope of the view being built, so it is called while a view is built under `mount` and nowhere else. `effect` from `nanoviews/store` is the store effect: it runs at once wherever it is called and returns a function to stop it.

```js
import { div, component$, effect$ } from 'nanoviews'

const MyComponent = component$(() => {
  effect$(() => {
    console.log('Mounted')

    return () => {
      console.log('Unmounted')
    }
  })

  return div()('Hello, Nanoviews!')
})
```

Also you can use `effect$` with signals:

```js
import { signal } from 'nanoviews/store'
import { div, component$, effect$ } from 'nanoviews'

const $timeout = signal(1000)

const MyComponent = component$(() => {
  let intervalId

  effect$(() => {
    intervalId = setInterval(() => {
      console.log('Tick')
    }, $timeout())

    return () => {
      clearInterval(intervalId)
    }
  })

  return div()('Hello, Nanoviews!')
})
```

### component$

`component$` creates a component. The component takes its props in the first call and its children in the second, like an element does, and renders when its instance is built into the parent. That happens after the parent's own render, so a parent can provide context and scope to its children.

```js
import { div, component$ } from 'nanoviews'

const MyComponent = component$((props, children) => (
  div(props)(
    'My component children: ',
    ...children.length ? children : ['empty']
  )
))

MyComponent() // <div>My component children: empty</div>

MyComponent({ class: 'my' })('Hello, Nanoviews!') // <div class="my">My component children: Hello, Nanoviews!</div>
```

`children` is always an array. The props are optional when every prop is optional, and `props$` turns them into accessors:

```ts
import type { Attributes } from 'nanoviews'
import { button, component$, props$ } from 'nanoviews'

interface ButtonProps extends Attributes<'button'> {
  size?: 's' | 'm'
}

const Button = component$((props: ButtonProps, children) => {
  const {
    $class,
    $size = () => 'm',
    ...restProps
  } = props$(props)

  return (
    button({
      ...restProps,
      class: ['button', () => `button_${$size()}`, $class]
    })(
      ...children
    )
  )
})
```

An instance called with no arguments renders: `MyComponent()()` is what the render returned, the `div(...)` description here, and the parent builds it on insertion.

The children are typed on the second parameter. A tuple with a function makes a render prop:

```ts
import type { Child } from 'nanoviews'
import { ul, li, b, component$ } from 'nanoviews'

const List = component$((
  { items }: { items: string[] },
  [renderItem]: [renderItem: (item: string) => Child]
) => ul()(
  ...items.map(item => li()(renderItem(item)))
))

List({ items: ['chopper', 'magixx'] })(item => b()('Player: ', item))
// <ul><li><b>Player: chopper</b></li><li><b>Player: magixx</b></li></ul>
```

A render with no `children` parameter makes a component that takes none, so children passed to it are a type error rather than lost. The same goes for `slot$`:

```ts
import { hr, component$ } from 'nanoviews'

const Divider = component$((props: { class?: string }) => hr(props))

Divider({ class: 'wide' })
Divider()('Hello') // type error: Expected 0 arguments, but got 1
```

That is read off the render itself, so it needs the types inferred. With the type arguments written out, `component$<Props>(...)`, the children stay allowed; `component$<Props, []>(...)` turns them off.

### slots$

A slot is a component made with `slot$`: its instances name the component and keep their props, so a layout can pick them out of its children. `slots$` gives the layout's render the declared slots in order, an instance or `undefined` each, and the rest of the children last; `component$` turns the result into a component.

```js
import { main, header, footer, component$, slot$, slots$ } from 'nanoviews'

const LayoutHeader = slot$((props, children) => header(props)(...children))
const LayoutFooter = slot$((props, children) => footer(props)(...children))

const Layout = component$(slots$(
  [LayoutHeader, LayoutFooter],
  (props, headerSlot, footerSlot, children) => main(props)(
    headerSlot,
    ...children,
    footerSlot
  )
))

Layout({ class: 'page' })(
  LayoutHeader({ 'data-testid': 'header' })('Header content'),
  'Main content',
  LayoutFooter({ 'data-testid': 'footer' })('Footer content')
)
// <main class="page"><header data-testid="header">Header content</header>Main content<footer data-testid="footer">Footer content</footer></main>
```

A slot the caller did not pass is `undefined` and renders nothing, the same slot passed twice keeps the last one, and a slot the layout did not declare throws.

### context$

`context$` provides values to a child. The child is built within the context, so every `inject` in it, however deep, sees the values. `provide`, `inject` and the rest of Kida's dependency injection come from `nanoviews/store`.

```js
import { signal, provide, inject } from 'nanoviews/store'
import { div, component$, context$ } from 'nanoviews'

function ThemeContext() {
  return signal('light') // default value
}

const Themed = component$(() => {
  const $theme = inject(ThemeContext)

  return (
    div()(
      'Current theme: ',
      $theme
    )
  )
})

const App = component$(() => {
  const $theme = signal('dark')

  return context$(provide(ThemeContext, $theme))(
    Themed()
  )
})

App() // <div>Current theme: dark</div>
```

`context$()` with no providers opens the root context an app needs before any `inject`. A component provides to its own children the same way: `context$(provide(Value$, $value))(div()(...children))`.

`context$` also takes an `InjectionContext` instance in place of the providers. The child is built within that very context: it sees the values of the instance and of the parent the instance was created with, not those of the current context, and what the child resolves stays in the instance. This is how a context made outside the view is handed to it, so the view and the code around it share the same dependencies:

```js
import { InjectionContext, signal, provide, inject } from 'nanoviews/store'
import { context$, mount } from 'nanoviews'

const context = new InjectionContext([
  provide(ThemeContext, signal('dark'))
])

mount(() => context$(context)(Themed()), document.querySelector('#app'))

inject(ThemeContext, context)('light') // <div>Current theme: light</div>
```

> [!NOTE]
> Nanoviews contexts are based on [Kida's dependency injection system](https://github.com/TrigenSoftware/nano_kit/tree/main/packages/kida#dependency-injection).

### isolate$

`isolate$` builds a child outside the surrounding injection context, so nothing above it is reachable. `inject` inside a bare `isolate$` throws — the point is to start a fresh provider tree with `context$` that inherits nothing, rather than to fall back to defaults.

```js
import { signal, provide, inject } from 'nanoviews/store'
import { div, component$, context$, isolate$ } from 'nanoviews'

function ThemeContext() {
  return signal('light')
}

const Themed = component$(() => (
  div()(
    'theme: ',
    inject(ThemeContext)
  )
))

const App = component$(() => {
  const $outer = signal('dark')
  const $inner = signal('high-contrast')

  return context$(provide(ThemeContext, $outer))(
    div()(
      Themed(),
      isolate$(context$(provide(ThemeContext, $inner))(
        Themed()
      ))
    )
  )
})

App() // <div><div>theme: dark</div><div>theme: high-contrast</div></div>
```

## Control flow

### if_

`if_` is a method that can render different childs based on the condition.

```js
import { signal } from 'nanoviews/store'
import { if_, div, p } from 'nanoviews'

const $show = signal(false)

if_($show)(
  () => div()('Hello, Nanoviews!')
)

const $toggle = signal(false)

if_($toggle)(
  () => p()('Toggle is true'),
  () => div()('Toggle is false')
)
```

### show_

`show_` is a method that hides and shows a child instead of rebuilding it. Hiding parks the tree instead of destroying it: the nodes are kept, the effects are paused, and the bindings keep the parked tree up to date, so it comes back exactly as it was. Unlike `if_`, which builds its branch anew on every flip, `show_` builds once and holds the tree even while it is hidden. There is no else branch.

```js
import { signal } from 'nanoviews/store'
import { show_, button } from 'nanoviews'

const $visible = signal(true)

show_($visible, () => {
  const $count = signal(0)

  return (
    button({
      onClick() {
        $count($count() + 1)
      }
    })(
      'Count: ', $count
    )
  )
})
```

The counter above keeps counting from where it was left: with `if_` it would start from zero every time it comes back.

### switch_

`switch_` is a method like `if_` but with multiple conditions.

```js
import { signal } from 'nanoviews/store'
import { switch_, case_, default_, b } from 'nanoviews'

const $state = signal('loading')

switch_($state)(
  case_('loading', () => b()('Loading')),
  case_('error', () => b()('Error')),
  default_(() => 'Success')
)
```

### match_

`match_` is a method that renders the child of the first case that holds: a cascade of conditions written as a list instead of `if_` inside `if_` inside `if_`. Cases are made with `when_`, and `default_`, the same one `switch_` takes, answers when no case holds.

```js
import { signal } from 'nanoviews/store'
import { match_, when_, default_, b, i } from 'nanoviews'

const $loading = signal(true)
const $error = signal(false)

match_(
  when_($loading, () => i()('Loading')),
  when_($error, () => b()('Error')),
  default_(() => 'Ready')
)
```

The walk stops at the case that holds, so a case below it is never read, and never wakes the block when it changes. Cases that move together are worth a `batch`: without one every write swaps the content, and the frame in between shows.

Every case hands its own value to its child, narrowed to the truthy side:

```ts
import { signal } from 'nanoviews/store'
import { match_, when_, default_, b } from 'nanoviews'

const $post = signal<{ title: string } | null>(null)

match_(
  when_($post, $post => b()(() => $post().title)),
  default_(() => 'No post')
)
```

### swap_

`swap_` is the method `if_`, `switch_` and `match_` are built on: it renders a child decided by a value. Unlike a binding, which updates content in place, the child is built anew every time the value changes.

```js
import { signal } from 'nanoviews/store'
import { swap_, b, i } from 'nanoviews'

const $tab = signal('list')

swap_($tab, tab => (
  tab === 'list'
    ? b()(tab)
    : i()(tab)
))
```

### for_

`for_` is a method that can iterate over an array to render a fragment of elements.

```js
import { signal, record } from 'nanoviews/store'
import { for_, trackById, ul, li } from 'nanoviews'

const $players = signal([
  { id: 0, name: 'chopper' },
  { id: 1, name: 'magixx' },
  { id: 2, name: 'zont1x' },
  { id: 3, name: 'donk' },
  { id: 4, name: 'sh1ro' },
  { id: 5, name: 'hally' }
])

ul()(
  for_($players, trackById)(
    $player => li()(
      record($player).$name
    )
  )
)
```

The second argument is a tracker: it names a row, so on reorder the row's DOM, signals and effects move with it instead of being rebuilt. There are exported predefined `trackById` function to track by `id` property and `trackBy(key)` function to create a tracker for specified key.

```js
import { signal, record } from 'nanoviews/store'
import { for_, trackBy, ul, li } from 'nanoviews'

const $cities = signal([
  { label: 'Berlin' },
  { label: 'Prague' }
])

ul()(
  for_($cities, trackBy('label'))(
    $city => li()(
      record($city).$label
    )
  )
)
```

Without a tracker a row is named by its position. The render is given the row, its index signal and the key the tracker named the row by: the index changes while the row moves, the key never does.

`as_` hands the row through a transform before rendering it, carrying the index and the key through: the same `$players` list, with `record` written once instead of in every child.

```js
import { record } from 'nanoviews/store'
import { for_, trackById, as_, ul, li } from 'nanoviews'

ul()(
  for_($players, trackById)(
    as_(record, ($player, $index) => li()(
      $index, ': ', $player.$name
    ))
  )
)
```

### throw_

`throw_` is a helper to throw an error in expressions.

```js
import { ul, component$, throw_ } from 'nanoviews'

const MyComponent = component$((_, children) => (
  ul()(
    ...children.length ? children : throw_(new Error('Children are required'))
  )
))
```

## Special methods

### fragment

`fragment` is a method that creates a fragment with the specified children.

```js
import { signal } from 'nanoviews/store'
import { fragment, component$, effect$ } from 'nanoviews'

const TickTak = component$(() => {
  const $tick = signal(0)

  effect$(() => {
    const id = setInterval(() => {
      $tick($tick() + 1)
    }, 1000)

    return () => clearInterval(id)
  })

  return fragment('Tick tak: ', $tick)
})
```

### dangerouslySetInnerHtml

`dangerouslySetInnerHtml` is a method that sets the inner HTML of the element once it is built. It is used for inserting HTML from a source that may not be trusted.

```js
import { div, dangerouslySetInnerHtml } from 'nanoviews'

dangerouslySetInnerHtml(
  div({ id: 'rendered-md' }),
  '<p>Some text</p>'
)
```

### shadow

`shadow` is a method that attaches a shadow DOM to the specified element once it is built. The children go into the shadow root.

```js
import { div, shadow } from 'nanoviews'

shadow(
  div({ id: 'custom-element' }),
  {
    mode: 'open'
  }
)(
  'Nanoviews can shadow DOM!'
)
```

### portal

`portal` is a method that can render a child in a different place in the DOM. The child is mounted into the target when the portal is built, and removed with the scope the portal was built in. In place it is an empty child.

```js
import { div, portal } from 'nanoviews'

portal(
  () => document.body,
  div()('I am in the body!')
)
```

## Why?

### Bundle size

Nanoviews and Kida are small libraries and designed to be tree-shakable. So apps using Nanoviews and Kida can be smaller even than using SolidJS or Svelte!

| Example | Nanoviews | SolidJS | Svelte |
| ------- | --------- | ------- | ------ |
| Vite Demo | 7.78 kB / gzip: 3.14 kB<br>[source code](../../examples/vite-demo/nanoviews/) | 8.93 kB / gzip: 3.73 kB<br>[source code](../../examples/vite-demo/solid/) | 23.77 kB / gzip: 9.61 kB<br>[source code](../../examples/vite-demo/svelte/) |
| Weather | + nano_kit<br>22.68 kB / gzip: 8.72 kB<br>[source code](../../examples/weather/nano_kit/) | + nanostores<br>30.18 kB / gzip: 11.97 kB<br>[source code](https://github.com/TrigenSoftware/nano_kit/tree/main/examples/weather/solid-nanostores/) | + nanostores<br>45.73 kB / gzip: 18.01 kB<br>[source code](https://github.com/TrigenSoftware/nano_kit/tree/main/examples/weather/svelte-nanostores/) |

### Performance

Nanoviews is not fastest library: SolidJS and Svelte are faster, but performance is close to them. Anyway, Nanoviews is faster than React 🙂.

![krausest js-framework-benchmark](../../assets/krausest-js-framework-benchmark.png)
