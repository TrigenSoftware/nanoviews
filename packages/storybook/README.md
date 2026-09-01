# @nanoviews/storybook

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nanoviews/storybook.svg
[npm-url]: https://npmjs.com/package/@nanoviews/storybook

[deps]: https://img.shields.io/librariesio/release/npm/@nanoviews/storybook
[deps-url]: https://libraries.io/npm/@nanoviews%2Fstorybook

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

Storybook renderer for [Nanoviews](../nanoviews#readme).

```ts
import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import type { WritableSignal } from 'nanoviews/store'
import { button } from 'nanoviews'

function Counter({ count, label }: {
  count: WritableSignal<number>
  label: WritableSignal<string>
}) {
  return (
    button({
      onClick() {
        count(count() + 1)
      }
    })(
      label, ': ', count
    )
  )
}

const meta: Meta<typeof Counter> = {
  title: 'Counter',
  component: Counter,
  args: {
    count: 0,
    label: 'Clicks'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dozen: Story = {
  args: {
    count: 12
  }
}
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#setup">Setup</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#writing-stories">Writing stories</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#args-are-signals">Args are signals</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#portable-stories">Portable stories</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#api">API</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#entry-points">Entry points</a>
<br />
<hr />

## Install

```bash
pnpm add -D @nanoviews/storybook @nanoviews/storybook-vite storybook vite
# or
npm i -D @nanoviews/storybook @nanoviews/storybook-vite storybook vite
# or
yarn add -D @nanoviews/storybook @nanoviews/storybook-vite storybook vite
```

`@nanoviews/storybook` is the *renderer*: it teaches Storybook how to mount and update a Nanoviews tree. It has no builder of its own, so it needs a *framework* — [`@nanoviews/storybook-vite`](../storybook-vite#readme) wires it to Storybook's Vite builder.

The framework already depends on the renderer, so the framework alone is enough to run Storybook. The renderer is listed above as well because the examples below import from `@nanoviews/storybook` directly, and that needs it in your own dependencies. Everything here is also re-exported from `@nanoviews/storybook-vite` — a project that imports it from there needs only the framework.

## Setup

### .storybook/main.ts

```ts
import type { StorybookConfig } from '@nanoviews/storybook-vite'

const config: StorybookConfig = {
  framework: '@nanoviews/storybook-vite',
  stories: ['../src/**/*.stories.ts']
}

export default config
```

### .storybook/preview.ts

Global parameters, decorators and loaders go into the preview file. Its default export is typed with `Preview`:

```ts
import type { Preview } from '@nanoviews/storybook'

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*'
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
```

### Run it

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006 --no-open"
  }
}
```

## Writing stories

Stories are plain [CSF3](https://storybook.js.org/docs/formats/component-story-format): a default export with the metadata and a named export per example.

A story's `render` is a Nanoviews component like any other: it gets props and returns a view. The props are the story's args, one writable signal per key.

```ts
import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import {
  div,
  style$
} from 'nanoviews'

const meta: Meta<{
  color: string
}> = {
  title: 'Elements/Effect Attributes/Style'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render() {
    return (
      div({
        [style$]: {
          color: 'green'
        }
      })(
        'Hello, world!'
      )
    )
  }
}

export const ReactiveValue: Story = {
  args: {
    color: 'green'
  },
  // `color` here is a `WritableSignal<string>`, not a `string`
  render({ color }) {
    return (
      div({
        [style$]: {
          color
        }
      })(
        'Hello, world!'
      )
    )
  }
}
```

`Meta` can be parameterized either with the component or with the plain args type — the values you put into `args` and the Controls panel edits. Both forms describe the same story: `args` stays plain, `render` and the component get signals.

### Stories without a render

`component` in the meta is the story's default renderer, so a story that only picks args needs no `render` of its own — the `Counter` stories at the top of the page do exactly that.

A story with neither a `render` nor a `component` to fall back to fails to render.

## Args are signals

An arg has two ends: the story declares it as a plain value, and the view receives it as a writable signal. Everything between the two is the renderer.

On the first render of a canvas element every plain arg is wrapped in a `signal()`, and the story is mounted once with that map of signals. On every next render — a control edited, an arg changed from the URL — the new plain values are **written into the same signals** instead of being passed to a new component instance. There is no re-render: the signal updates exactly the bindings that depend on it. Only `forceRemount` unmounts the tree and mounts it again.

Args that are already signals, and args that are functions (action args like `fn()` from `storybook/test`), are passed through untouched.

So one prop has three shapes, and the types name all three:

- what the story declares (`args`, Controls) — plain values;
- what `render` and the component receive — writable signals;
- what a composed story accepts in a test — either of the two.

### Decorators

A decorator wraps the view the story rendered, the same way as in every other Storybook renderer:

```ts
import type { Decorator } from '@nanoviews/storybook'
import { div } from 'nanoviews'

export const withWrap: Decorator = story => div({ class: 'wrap' })(story())
```

Decorators run once per mount, together with the story they wrap: later arg edits reach the view through the signals, not through a new call to the decorator.

## Portable stories

`composeStories` applies the meta, the project annotations and the renderer to every story of a module, so the story becomes a function you can call in a test. Its result is what [`@nanoviews/testing-library`](../testing-library#readme)'s `render` takes:

```ts
import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'nanoviews/store'
import * as Stories from './style.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('style$', () => {
  it('should render static value', () => {
    const { container } = render(StaticValue())

    expect(container.innerHTML).toBe('<div><div style="color: green;">Hello, world!</div></div>')
  })

  it('should render overridden value', () => {
    const { container } = render(ReactiveValue({
      color: 'red'
    }))

    expect(container.innerHTML).toBe('<div><div style="color: red;">Hello, world!</div></div>')
  })

  it('should render reactive value', () => {
    const color = signal('green')
    const { container } = render(ReactiveValue({
      color
    }))

    expect(container.innerHTML).toBe('<div><div style="color: green;">Hello, world!</div></div>')

    color('red')

    expect(container.innerHTML).toBe('<div><div style="color: red;">Hello, world!</div></div>')
  })
})
```

Every arg of a composed story is optional and can be passed as a plain value or as a signal — the story is reactive either way, because the renderer wraps the plain ones. Passing a signal is how you get the handle to drive the story with: write to it and assert on the DOM it changed.

To compose a single story instead of the whole module, `composeStory` takes the story and the meta of the module it comes from:

```ts
import { composeStory } from '@nanoviews/storybook'
import meta, { ReactiveValue as ReactiveValueStory } from './style.stories.js'

const ReactiveValue = composeStory(ReactiveValueStory, meta)
```

### Project annotations

To make portable stories pick up the globals from `.storybook/preview.ts`, apply them once in a test setup file:

```ts
import { setProjectAnnotations } from '@nanoviews/storybook'
import preview from './.storybook/preview.js'

setProjectAnnotations(preview)
```

## API

### composeStory

Composes one story into a callable function bound to the Nanoviews renderer. Takes the story object and the meta of its module; project annotations and the story's export name are optional third and fourth arguments.

### composeStories

Composes all stories of a CSF module — the `import * as Stories` namespace — into callable functions bound to the Nanoviews renderer. Project annotations can be passed as an optional second argument. Every arg of a composed story is optional and accepts a plain value or a writable signal.

### setProjectAnnotations

Applies project-level annotations to all portable stories of a test run.

### Types

- `Meta<Component>` or `Meta<Args>` — metadata of the default export. Parameterize it with the component or with the plain args type; `args` is plain in both cases.
- `StoryObj<typeof meta>` — a CSF3 story object. Can also be parameterized with a component or a plain args type directly, instead of with the meta.
- `StoryFn<Component>` or `StoryFn<Args>` — a CSF2 story function.
- `Decorator<Args>`, `Loader<Args>`, `StoryContext<Args>` — Storybook's decorator, loader and story context types, bound to the Nanoviews renderer.
- `Preview` — type of the `.storybook/preview.ts` default export.
- `NanoviewsRenderer<Props>` — the renderer itself; its `component` takes signal props and its `storyResult` is the view they render.
- `Args`, `ArgTypes`, `Parameters`, `StrictArgs` — re-exported from `storybook/internal/types`.

## Entry points

- `@nanoviews/storybook` — everything above.
- `@nanoviews/storybook/preset` — the `previewAnnotations` hook that adds the preview entry to Storybook's config. `@nanoviews/storybook-vite` points at it as `core.renderer`; a framework for another builder would do the same.
- `@nanoviews/storybook/entry-preview` — the preview annotations of the renderer: `parameters`, `applyDecorators`, `render`, `renderToCanvas` and `argTypesEnhancers`.
