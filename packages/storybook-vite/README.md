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

[Nanoviews](../nanoviews#readme) + Vite framework for [Storybook](https://storybook.js.org): the [`@nanoviews/storybook`](../storybook#readme) renderer wired to [`@storybook/builder-vite`](https://github.com/storybookjs/storybook/tree/next/code/builders/builder-vite). It re-exports the whole renderer API, so stories and config come from one package.

- **CSF3**. Stories are plain Component Story Format objects, typed with `Meta` and `StoryObj`.
- **Args are signals**. A story's `render` is a Nanoviews component that receives the args as writable signals, so an edited control updates the view in place, with no remount.
- **Portable stories**. `composeStories` turns stories into functions that [`@nanoviews/testing-library`](../testing-library#readme) renders in unit tests.
- **One option**. A single `framework` entry in `.storybook/main.ts` wires the renderer to the Vite builder.

## Installation

```bash
pnpm add -D @nanoviews/storybook-vite storybook vite
# or
npm i -D @nanoviews/storybook-vite storybook vite
# or
yarn add -D @nanoviews/storybook-vite storybook vite
```

## Quick Start

Name this package as the framework in `.storybook/main.ts`:

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@nanoviews/storybook-vite'

const config: StorybookConfig = {
  framework: '@nanoviews/storybook-vite',
  stories: ['../src/**/*.stories.ts']
}

export default config
```

Stories import the renderer API from this package too:

```ts
// src/button.stories.ts
import type { Meta, StoryObj } from '@nanoviews/storybook-vite'
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
    return (
      button()(
        label
      )
    )
  }
}
// <button>Click me</button>
```

Start Storybook with `storybook dev`, and the story shows up under **Button**. `label` is a plain string in `args`, while `render` receives it as a signal, so an edit of the control changes the text of the same button.

## Documentation

For comprehensive guides, advanced patterns, and API reference, visit the [documentation website](https://nanoviews.js.org/storybook/).
