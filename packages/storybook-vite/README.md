# @nanoviews/storybook-vite

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nanoviews/storybook-vite.svg
[npm-url]: https://npmjs.com/package/@nanoviews/storybook-vite

[deps]: https://img.shields.io/librariesio/release/npm/@nanoviews/storybook-vite
[deps-url]: https://libraries.io/npm/@nanoviews%2Fstorybook-vite

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

Nanoviews + Vite framework for [Storybook](https://storybook.js.org): the [`@nanoviews/storybook`](../storybook#readme) renderer wired to [`@storybook/builder-vite`](https://github.com/storybookjs/storybook/tree/next/code/builders/builder-vite) by a single `framework` option. It re-exports the whole renderer API, so stories and config come from one package.

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@nanoviews/storybook-vite'

const config: StorybookConfig = {
  framework: '@nanoviews/storybook-vite',
  stories: ['../src/**/*.stories.ts']
}

export default config
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#setup">Setup</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#stories">Stories</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#configuration">Configuration</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#api">API</a>
<br />
<hr />

## Install

```bash
pnpm add -D @nanoviews/storybook-vite storybook vite
# or
npm i -D @nanoviews/storybook-vite storybook vite
# or
yarn add -D @nanoviews/storybook-vite storybook vite
```

[`@nanoviews/storybook`](../storybook#readme) — the renderer — is a dependency of this package, so it is installed along with it, and its whole API is re-exported here. Stories and config come from `@nanoviews/storybook-vite` alone.

## Setup

The Storybook CLI cannot scaffold a third-party framework, so the setup is done by hand: two config files and two scripts.

```text
.storybook/
  main.ts
  preview.ts
src/
  button.stories.ts
```

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

Optional, but this is where global parameters and decorators live.

```ts
import type { Preview } from '@nanoviews/storybook-vite'

const preview: Preview = {
  parameters: {
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

### Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

## Stories

A story's `render` is a Nanoviews component: it takes props and returns a view.

```ts
import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook-vite'
import { button } from 'nanoviews'

const meta: Meta<{
  label: string
}> = {
  title: 'Button'
}

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Click me'
  },
  render({ label }) {
    return button()(label)
  }
}
```

Args are declared as plain values, but `render` receives them as signals: `label` above is a signal, which is why `button()(label)` updates itself when the control changes, without remounting the view.

A meta can also name the `component` itself — it takes signal props like any other Nanoviews component — and then a story needs nothing but its `args`, or nothing at all.

> [!NOTE]
> The whole story API — the `Meta`, `StoryObj`, `StoryFn`, `Preview`, `Decorator` and the rest of the CSF types, plus the `composeStory`, `composeStories` and `setProjectAnnotations` helpers — is re-exported from this package. See [`@nanoviews/storybook`](../storybook#readme) for the full reference.

## Configuration

### Framework options

`framework` also accepts the object form, where `options.builder` are [`@storybook/builder-vite`](https://storybook.js.org/docs/builders/vite) options:

```ts
import type { StorybookConfig } from '@nanoviews/storybook-vite'

const config: StorybookConfig = {
  framework: {
    name: '@nanoviews/storybook-vite',
    options: {
      builder: {
        viteConfigPath: '.storybook/vite.config.ts'
      }
    }
  },
  stories: ['../src/**/*.stories.ts']
}

export default config
```

By default the builder reads the project's own `vite.config` file; `viteConfigPath` points it at another one, resolved relative to `process.cwd()`. In the object form `options` is required, so pass `options: {}` when there is nothing to configure.

### viteFinal

`StorybookConfig` also types [`viteFinal`](https://storybook.js.org/docs/api/main-config/main-config-vite-final), to extend the resolved Vite config:

```ts
import type { StorybookConfig } from '@nanoviews/storybook-vite'

const config: StorybookConfig = {
  framework: '@nanoviews/storybook-vite',
  stories: ['../src/**/*.stories.ts'],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      resolve: {
        alias: {
          '~': '/src'
        }
      }
    })
  }
}

export default config
```

## API

### StorybookConfig

The type of a `.storybook/main.ts` default export. It is Storybook's own config type from `storybook/internal/types`, extended with the Vite builder options — `viteFinal` and the rest — and narrowed so that `framework`, and the optional `core.builder`, take the names of this package and its builder.

### FrameworkOptions

Options accepted under `framework.options`:

- `builder` — optional, passed straight through to `@storybook/builder-vite`.

### Re-exports

Everything exported by [`@nanoviews/storybook`](../storybook#readme) is re-exported from `@nanoviews/storybook-vite`, so a project can import both its config types and its story types from one package.

### defineMain

`@nanoviews/storybook-vite/node` exports `defineMain`, an identity helper that types a `main.ts` config without a type annotation:

```ts
// .storybook/main.ts
import { defineMain } from '@nanoviews/storybook-vite/node'

export default defineMain({
  framework: '@nanoviews/storybook-vite',
  stories: ['../src/**/*.stories.ts']
})
```

> [!NOTE]
> The `@nanoviews/storybook-vite/preset` entry is loaded by Storybook itself when `framework` names this package — it is what makes the framework mean "the Nanoviews renderer plus `@storybook/builder-vite`". There is no reason to import it directly.

For the view library itself, see [`nanoviews`](../nanoviews#readme).
