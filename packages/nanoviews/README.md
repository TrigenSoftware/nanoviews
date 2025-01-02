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
[deps-url]: https://libraries.io/npm/nanoviews/tree

[size]: https://deno.bundlejs.com/badge?q=nanoviews
[size-url]: https://bundlejs.com/?q=nanoviews

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews


A small Direct DOM library for creating user interfaces.

- **Small**. Between 3.4 and 6 kB (minified and brotlied). Zero external dependencies[*](#reactivity).
- **Direct DOM**. Less CPU and memory usage compared to Virtual DOM.
- Designed for best **Tree-Shaking**: only the code you use is included in your bundle.
- **TypeScript**-first.

```js
import { signal } from 'nanoviews/store'
import { div, a, img, h1, button, p, mount } from 'nanoviews'

function App() {
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
          $counter.set($counter.get() + 1)
        }
      })('count is ', $counter)
    ),
    p({ class: 'read-the-docs' })('Click on the Vite and Nanoviews logos to learn more')
  )
}

mount(App, document.querySelector('#app'))
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#reactivity">Reactivity</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#basic-markup">Basic markup</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#special-methods">Special methods</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#effect-attributes">Effect attributes</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#logic-methods">Logic methods</a>
<br />
<hr />

## Install

```bash
pnpm add -D nanoviews
# or
npm i -D nanoviews
# or
yarn add -D nanoviews
```

## Reactivity

Nanoviews is using [Kida](https://github.com/TrigenSoftware/nanoviews/tree/main/packages/kida) under the hood for reactivity. This library is inspired by [Nano Stores](https://github.com/nanostores/nanostores) and was build specially for Nanoviews.

```js
import { signal } from 'nanoviews/store' // or import { signal } from 'kida'
import { fragment, input, p } from 'nanoviews'

const $text = signal('')

fragment(
  input({
    onInput(event) {
      $text.set(event.target.value)
    }
  }),
  p()($text)
)
```

## Basic markup

Nanoviews provides a set of methods for creating HTML elements with the specified attributes and children. Every method creates a _"block"_ that represents a DOM node or another block(s).

Child can be an another element, primitive value (string, number, boolean, `null` or `undefined`), store with primitive or array of children. Attributes also can be a primitive value or store.

```js
import { signal } from 'nanoviews/store'
import { ul, li } from 'nanoviews'

const $boolean = signal(true)

ul({ class: 'list' })(
  li()('String value'),
  li()('Number value', 42),
  li()('Boolean value', $boolean)
)
```

### mount

`mount` is a method that mounts the component to the specified container.

```js
import { signal } from 'nanoviews/store'
import { div, h1, p, mount } from 'nanoviews'

function App() {
  return div()(
    h1()('Nanoviews App'),
    p()('Hello World!')
  )
}

mount(App, document.querySelector('#app'))
```

## Special methods

### text$

`text$` is a method that creates text node block with the specified value or store.

```js
import { signal } from 'nanoviews/store'
import { text$, effect$ } from 'nanoviews'

function TickTak() {
  const $tick = signal(0)

  effect$(() => {
    const id = setInterval(() => {
      $tick.set($tick.get() + 1)
    }, 1000)

    return () => clearInterval(id)
  })

  return text$($tick)
}
```

### fragment

`fragment` is a method that creates a fragment block with the specified children.

```js
import { signal } from 'nanoviews/store'
import { fragment, effect$ } from 'nanoviews'

function TickTak() {
  const $tick = signal(0)

  effect$(() => {
    const id = setInterval(() => {
      $tick.set($tick.get() + 1)
    }, 1000)

    return () => clearInterval(id)
  })

  return fragment('Tick tak: ', $tick)
}
```

### dangerouslySetInnerHTML

`dangerouslySetInnerHTML` is a method that sets the inner HTML of the element block. It is used for inserting HTML from a source that may not be trusted.

```js
import { div, dangerouslySetInnerHTML } from 'nanoviews'

dangerouslySetInnerHTML(
  div({ id: 'rendered-md' }),
  '<p>Some text</p>'
)
```

### shadow

`shadow` is a method that attaches a shadow DOM to the specified element block.

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

## Effect attributes

Effect attributes are special attributes that can control element's behavior.

### ref$

`ref$` is an effect attribute that can provide a reference to the DOM node.

```js
import { signal } from 'nanoviews/store'
import { div, ref$ } from 'nanoviews'

const $ref = signal(null)

div({
  [ref$]: $ref
})(
  'Target element'
)
```

### style$

`style$` is an effect attribute that manages the style of the element.

```js
import { signal } from 'nanoviews/store'
import { button, style$ } from 'nanoviews'

const $color = signal('white')

button({
  [style$]: {
    color: $color,
    backgroundColor: 'black'
  }
})(
  'Click me'
)
```

### autoFocus$

`autoFocus$` is an effect attribute that sets the auto focus on the element.

```js
import { input, autoFocus$ } from 'nanoviews'

input({
  type: 'text',
  [autoFocus$]: true
})
```

### value$

`value$` is an effect attribute that manages the value of text inputs.

```js
import { signal } from 'nanoviews/store'
import { textarea, value$ } from 'nanoviews'

const $review = signal('')

textarea({
  name: 'review',
  [value$]: $review
})(
  'Write your review here'
)
```

### checked$

`checked$` is an effect attribute that manages the checked state of checkboxes and radio buttons.

```js
import { signal } from 'nanoviews/store'
import { input, checked$, Indeterminate } from 'nanoviews'

const $checked = signal(false)

input({
  type: 'checkbox',
  [checked$]: $checked
})
```

Also you can manage [indeterminate state of checkboxes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes):

```js
$checked.set(Indeterminate)
```

### selected$

`selected$` is an effect attribute that manages the selected state of select's options.

```js
import { signal } from 'nanoviews/store'
import { select, option, selected$ } from 'nanoviews'

const $selected = signal('mid')

select({
  name: 'player-pos',
  [selected$]: $selected
})(
  option({
    value: 'carry'
  })('Yatoro'),
  option({
    value: 'mid',
  })('Larl'),
  option({
    value: 'offlane'
  })('Collapse'),
  option({
    value: 'support'
  })('Mira'),
  option({
    value: 'full-support',
  })('Miposhka'),
)
```

Multiple select:

```js
const $selected = signal(['mid', 'carry'])

select({
  name: 'player-pos',
  [selected$]: $selected
})(
  option({
    value: 'carry'
  })('Yatoro'),
  option({
    value: 'mid',
  })('Larl'),
  option({
    value: 'offlane'
  })('Collapse'),
  option({
    value: 'support'
  })('Mira'),
  option({
    value: 'full-support',
  })('Miposhka'),
)
```

### files$

`files$` is an effect attribute that can provide the files of file inputs.

```js
import { signal } from 'nanoviews/store'
import { input, files$ } from 'nanoviews'

const $files = signal([])

input({
  type: 'file',
  [files$]: $files
})
```

## Logic methods

### effect$

`effect$` is a method that add effects to the component.

```js
import { div, effect$ } from 'nanoviews'

function App() {
  effect$(() => {
    console.log('Mounted')

    return () => {
      console.log('Unmounted')
    }
  })

  return div()('Hello, Nanoviews!')
}
```

### observe$

`observe$` is a method to observe stores on component mount.

```js
import { div, observe$ } from 'nanoviews'

const $timeout = signal(1000)

function App() {
  let intervalId

  observe$((get) => {
    intervalId = setInterval(() => {
      console.log('Tick')
    }, get($timeout))

    return () => {
      clearInterval(intervalId)
    }
  })

  return div()('Hello, Nanoviews!')
}
```

### if$

`if$` is a method that can render different childs based on the condition.

```js
import { signal } from 'nanoviews/store'
import { if$, div, p } from 'nanoviews'

const $show = signal(false)

if$($show)(
  () => div()('Hello, Nanoviews!')
)

const $toggle = signal(false)

if$($toggle)(
  () => p()('Toggle is true'),
  () => div()('Toggle is false')
)
```

### switch$

`switch$` is a method like `if$` but with multiple conditions.

```js
import { signal } from 'nanoviews/store'
import { switch$, case$, default$, div, p } from 'nanoviews'

const $state = signal('loading')

switch$(state)(
  case$('loading', () => b()('Loading')),
  case$('error', () => b()('Error')),
  default$(() => 'Success')
)
```

### for$

`for$` is a method that can iterate over an array to render a list of blocks.

```js
import { signal, record } from 'nanoviews/store'
import { for$, ul, li } from 'nanoviews'

const $players = signal([
  { id: 0, name: 'chopper' },
  { id: 1, name: 'magixx' },
  { id: 2, name: 'zont1x' },
  { id: 3, name: 'donk' },
  { id: 4, name: 'sh1ro' },
  { id: 5, name: 'hally' }
])

ul()(
  for$($players, player => player.id)(
    $player => li()(
      record($player).name
    )
  )
)
```

### children$

`children$` is a method that creates block with optional children receiver.

```js
import { div, children$ } from 'nanoviews'

function MyComponent(props) {
  return children$(children => div(props)(
    'My component children: ',
    children || 'empty'
  ))
}

MyComponent() // <div>My component children: empty</div>

MyComponent()('Hello, Nanoviews!') // <div>My component children: Hello, Nanoviews!</div>
```

### slots$

`slots$` is a method to receive slots and rest children.

```js
import { main, header, footer, slot$, slots$ } from 'nanoviews'

function LayoutHeader(text) {
  return slot$(LayoutHeader, text)
}

function LayoutFooter(text) {
  return slot$(LayoutFooter, text)
}

function Layout() {
  return slots$(
    [LayoutHeader, LayoutFooter],
    (headerSlot, footerSlot, children) => main()(
      header()(headerSlot),
      children,
      footer()(footerSlot)
    )
  )
}

Layout()(
  LayoutHeader('Header content'),
  LayoutFooter('Footer content'),
  'Main content'
)
```

Slot's content can be anything, including functions, that can be used to render lists:

```js
import { ul, li, b, slot$, slots$, for$ } from 'nanoviews'

function ListItem(renderItem) {
  return slot$(ListItem, renderItem)
}

function List(items) {
  return slots$(
    [ListItem],
    (listItemSlot) => ul()(
      for$(items)(
        item => li()(
          listItemSlot(item.name)
        )
      )
    )
  )
}

List([
  { id: 0, name: 'chopper' },
  { id: 1, name: 'magixx' },
  { id: 2, name: 'zont1x' },
  { id: 3, name: 'donk' },
  { id: 4, name: 'sh1ro' },
  { id: 5, name: 'hally' }
])(
  ListItem(name => b()('Player: ', name))
)
```

### context$

`context$` is a method that can provide a context to the children.

```js
import { signal } from 'nanoviews/store'
import { div, context$, provide, inject } from 'nanoviews'

function ThemeContext() {
  return signal('light') // default value
}

function MyComponent() {
  const $theme = inject(ThemeContext)

  return div()(
    'Current theme: ',
    $theme
  )
}

function App() {
  const $theme = signal('dark')

  return context$(
    [provide(ThemeContext, $theme)],
    () => MyComponent()
  )
}

App() // <div>Current theme: dark</div>
```

> [!NOTE]
> Nanoviews contexts are based on [Kida's dependency injection system](../kida#dependency-injection).

### portal$

`portal$` is a method that can render a block in a different place in the DOM.

```js
import { div, portal$ } from 'nanoviews'

portal$(
  document.body,
  div()('I am in the body!')
)
```

### throw$

`throw$` is a helper to throw an error in expressions.

```js
import { ul, children$, throw$ } from 'nanoviews'

function MyComponent() {
  return children$((children = throw$(new Error('Children are required'))) => ul()(children))
}
```
