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

[Storybook](https://storybook.js.org) renderer for [Nanoviews](../nanoviews#readme), run on the Vite builder by the [`@nanoviews/storybook-vite`](../storybook-vite#readme) framework.

- **CSF3**. Stories are plain Component Story Format objects, typed with `Meta` and `StoryObj`.
- **Args are signals**. A story's `render` is a Nanoviews component that receives the args as writable signals, so an edited control updates the view in place, with no remount.
- **Portable stories**. `composeStories` turns stories into functions that [`@nanoviews/testing-library`](../testing-library#readme) renders in unit tests.
- **One option**. A single `framework` entry in `.storybook/main.ts` wires the renderer to the Vite builder.

## Installation

Storybook uses the renderer through the [`@nanoviews/storybook-vite`](../storybook-vite#readme) framework, so the framework is installed with it:

```bash
pnpm add -D @nanoviews/storybook @nanoviews/storybook-vite storybook vite
# or
npm i -D @nanoviews/storybook @nanoviews/storybook-vite storybook vite
# or
yarn add -D @nanoviews/storybook @nanoviews/storybook-vite storybook vite
```

## Quick Start

Name the framework in `.storybook/main.ts`:

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@nanoviews/storybook-vite'

const config: StorybookConfig = {
  framework: '@nanoviews/storybook-vite',
  stories: ['../src/**/*.stories.ts']
}

export default config
```

Write a component and its stories:

```ts
// src/button.ts
import { type Signalish, when } from 'nanoviews/store'
import { button, component$ } from 'nanoviews'

export interface ButtonProps {
  primary?: Signalish<boolean>
  onClick?: (event: MouseEvent) => void
}

export const Button = component$(({ primary, onClick }: ButtonProps, children) => (
  button({
    class: ['button', when(primary, 'button_primary')],
    onClick
  })(
    ...children
  )
))
```

```ts
// src/button.stories.ts
import type { Meta, StoryObj } from '@nanoviews/storybook'
import { fn } from 'storybook/test'
import { Button } from './button.js'

const meta: Meta<typeof Button> = {
  title: 'Button',
  args: {
    primary: false,
    onClick: fn()
  },
  render(props) {
    return Button(props)('Send')
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
// <button class="button">Send</button>

export const Primary: Story = {
  args: {
    primary: true
  }
}
// <button class="button button_primary">Send</button>
```

Start Storybook with `storybook dev`, and both stories show up under **Button**. `primary` is a plain boolean in `args` and in the Controls panel, while `Button` receives a signal: a toggle is written into it, and the class of the same button changes.

## Documentation

For comprehensive guides, advanced patterns, and API reference, visit the [documentation website](https://nanoviews.js.org/storybook/).
