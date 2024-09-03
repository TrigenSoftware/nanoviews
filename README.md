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

[size]: https://packagephobia.com/badge?p=nanoviews
[size-url]: https://packagephobia.com/result?p=nanoviews

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

A small Direct DOM library for creating user interfaces.

- **Small**. Between 2.71 and 4.77 kB (minified and brotlied). Zero dependencies[*](#reactivity).
- **Direct DOM**. Less CPU and memory usage compared to Virtual DOM.
- Designed for best **Tree-Shaking**: only the code you use is included in your bundle.
- **TypeScript**-first.

```js
import { atom } from 'nanostores'
import { div, a, img, h1, button, p, render } from 'nanoviews'

function App() {
  const $counter = atom(0)

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

render(App(), document.querySelector('#app'))
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

Nanoviews is designed to be used with [Nano Stores](https://github.com/nanostores/nanostores) for reactivity. But Nano Stores is not a direct dependency of Nanoviews, so you can use any other reactive library that implements [store interface](./packages/nanoviews/src/internals/types/common.ts#L29).

```js
import { atom } from 'nanostores'
import { fragment, input, p } from 'nanoviews'

const $text = atom('')

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
import { atom } from 'nanostores'
import { ul, li } from 'nanoviews'

const $boolean = atom(true)

ul({ class: 'list' })(
  li()('String value'),
  li()('Number value', 42),
  li()('Boolean value', $boolean)
)
```

## Special methods

### text$

`text$` is a method that creates text node block with the specified value or store.

```js
import { atom } from 'nanostores'
import { text$, effect$ } from 'nanoviews'

function TickTak() {
  const $tick = atom(0)
  const effect = () => {
    const id = setInterval(() => {
      $tick.set($tick.get() + 1)
    }, 1000)

    return () => clearInterval(id)
  }

  return effect$(
    effect,
    text$($tick)
  )
}
```

### fragment

`fragment` is a method that creates a fragment block with the specified children.

```js
import { atom } from 'nanostores'
import { fragment, effect$ } from 'nanoviews'

function TickTak() {
  const $tick = atom(0)
  const effect = () => {
    const id = setInterval(() => {
      $tick.set($tick.get() + 1)
    }, 1000)

    return () => clearInterval(id)
  }

  return effect$(
    effect,
    fragment('Tick tak: ', $tick)
  )
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

### attachShadow

`attachShadow` is a method that attaches a shadow DOM to the specified element block.

```js
import { div, attachShadow } from 'nanoviews'

attachShadow(
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
import { atom } from 'nanostores'
import { div, ref$ } from 'nanoviews'

const $ref = atom(null)

div({
  [ref$]: $ref
})(
  'Target element'
)
```

### style$

`style$` is an effect attribute that manages the style of the element.

```js
import { atom } from 'nanostores'
import { button, style$ } from 'nanoviews'

const $color = atom('white')

button({
  [style$]: {
    color: $color,
    backgroundColor: 'black'
  }
})(
  'Click me'
)
```

### classList$

`classList$` is an effect attribute that manages class names of the element.

```js
import { button, classList$, classIf$, classGet$ } from 'nanoviews'
import * as styles from './styles.css'

function MyButton({
  class: className,
  theme = 'primary',
  rounded = false
}) {
  return button({
    [classList$]: [className, 'myButton', classIf$(styles.rounded, rounded), classGet$(styles, theme)]
  })
}
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
import { atom } from 'nanostores'
import { textarea, value$ } from 'nanoviews'

const $review = atom('')

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
import { atom } from 'nanostores'
import { input, checked$, Indeterminate } from 'nanoviews'

const $checked = atom(false)

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
import { atom } from 'nanostores'
import { select, option, selected$ } from 'nanoviews'

const $selected = atom('mid')

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
const $selected = atom(['mid', 'carry'])

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
import { atom } from 'nanostores'
import { input, files$ } from 'nanoviews'

const $files = atom([])

input({
  type: 'file',
  [files$]: $files
})
```

## Logic methods

### effect$

`effect$` is a method that add effects to the element block.

```js
import { div, effect$ } from 'nanoviews'

function App() {
  const effect = (element) => {
    console.log('Mounted', element.outerHTML) // Mounted <div>Hello, Nanoviews!</div>

    return () => {
      console.log('Unmounted')
    }
  }

  return effect$(
    effect, // or array of effects
    div()('Hello, Nanoviews!')
  )
}
```

### decide$

`decide$` is a method that can switch between different childs.

```js
import { atom } from 'nanostores'
import { decide$, div, p } from 'nanoviews'

const $show = atom(false)

decide$($show, (show) => {
  if (show) {
    return div()('Hello, Nanoviews!')
  }
})

const $toggle = atom(false)

decide$($toggle, toggle => (
  toggle ? p()('Toggle is true') : div()('Toggle is false')
))
```

### for$

`for$` is a method that can iterate over an array to render a list of blocks.

```js
import { atom } from 'nanostores'
import { for$, ul, li } from 'nanoviews'

const $players = atom([
  { id: 0, name: 'chopper' },
  { id: 1, name: 'magixx' },
  { id: 2, name: 'zont1x' },
  { id: 3, name: 'donk' },
  { id: 4, name: 'sh1ro' },
  { id: 5, name: 'hally' }
])

ul()(
  for$($players, (player) => player.id, (player) => li()(player))
)
```

### children$

`children$` is a method that creates block with optional children receiver.

```js
import { div, children$ } from 'nanoviews'

function MyComponent(props) {
  return children$((children) => div(props)(
    'My component children: ',
    children || 'empty'
  ))
}

MyComponent() // <div>My component children: empty</div>

MyComponent()('Hello, Nanoviews!') // <div>My component children: Hello, Nanoviews!</div>
```

### slots$

`slots$` is a method that should be used with `children$` to receive slots.

```js
import { main, header, footer, children$, slots$, createSlot } from 'nanoviews'

const LayoutHeaderSlot = createSlot()
const LayoutFooterSlot = createSlot()

function Layout() {
  return children$(
    slots$(
      [LayoutHeaderSlot, LayoutFooterSlot],
      (headerSlot, footerSlot, children) => main()(
        header()(headerSlot),
        children,
        footer()(footerSlot)
      )
    )
  )
}

Layout()(
  LayoutHeaderSlot('Header content'),
  LayoutFooterSlot('Footer content'),
  'Main content'
)
```

Slot's content can be anything, including functions, that can be used to render lists:

```js
import { ul, li, b, children$, slots$ createSlot, for$ } from 'nanoviews'

const ListItemSlot = createSlot()

function List(items) {
  return children$(
    slots$(
      [ListItemSlot],
      (listItemSlot) => ul()(
        for$(items, (item) => item.id, (item) => li()(
          listItemSlot(item.name)
        ))
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
  ListItemSlot((name) => b()('Player: ', name))
)
```

### context$

`context$` is a method that can provide a context to the children.

```js
import { atom } from 'nanostores'
import { div, context$, createContext } from 'nanoviews'

const [ThemeContext, getTheme] = createContext(atom('light')) // default value

function MyComponent() {
  const theme = getTheme()

  return div()(
    'Current theme: ',
    theme
  )
}

function App() {
  const $theme = atom('dark')

  return context$(
    ThemeContext($theme),
    () => MyComponent()
  )
}

App() // <div>Current theme: dark</div>
```

### portal$

`portal$` is a method that can render a block in a different place in the DOM.

```js
import { div, portal$ } from 'nanoviews'

portal$(
  document.body,
  div()('I am in the body!')
)
```

### await$

`await$` is a method that can handle and render promises.

```js
import { atom } from 'nanostores'
import { i, b, await$, pending$, then$, catch$ } from 'nanoviews'

const $promise = atom(Promise.resolve('Hello, Nanoviews!'))

await$($promise)(
  pending$(() => i()('Loading...')),
  then$((value) => b()(value)),
  catch$((error) => String(error))
)
```

### forAwait$

`forAwait$` is a method that can handle and render async iterables.

```js
import { ul, li, forAwait$, pending$, each$, then$, catch$ } from 'nanoviews'

ul()(
  forAwait$(fetchProducts())(
    pending$(() => li()('Loading...')),
    each$((product) => ProductView(product)),
    then$((count) => li()('Loaded products count: ', count)),
    catch$((error) => li()('Error: ', error))
  )
)
```

Also you can render list in reversed order:

```js
import { main, div, forAwait$, pending$, each$, then$, catch$ } from 'nanoviews'

main()(
  forAwait$(fetchNewsFeed(), true)(
    pending$(() => div()('Loading...')),
    each$((product) => PostView(product)),
    then$((count) => div()('Loaded products count: ', count)),
    catch$((error) => div()('Error: ', error))
  )
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
