# @nanoviews/testing-library

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nanoviews/testing-library.svg
[npm-url]: https://npmjs.com/package/@nanoviews/testing-library

[deps]: https://img.shields.io/librariesio/release/npm/@nanoviews/testing-library
[deps-url]: https://libraries.io/npm/@nanoviews%2Ftesting-library

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

Testing utilities for [Nanoviews](../nanoviews#readme), built on [Testing Library](https://testing-library.com/docs/dom-testing-library/intro).

- **Testing Library**. Re-exports the whole `@testing-library/dom` API, so `render`, `screen` and `fireEvent` come from a single import.
- **Stories**. A story composed with [`@nanoviews/storybook`](../storybook#readme) goes straight into `render`, args and all.
- **TypeScript**-first.

## Installation

```bash
pnpm add -D @nanoviews/testing-library @testing-library/dom vitest happy-dom
# or
npm i -D @nanoviews/testing-library @testing-library/dom vitest happy-dom
# or
yarn add -D @nanoviews/testing-library @testing-library/dom vitest happy-dom
```

## Quick Start

Run the tests with [Vitest](https://vitest.dev/) in [happy-dom](https://github.com/capricorn86/happy-dom), and set up the `vitest` entry of this package, which unmounts every rendered view after each test:

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['@nanoviews/testing-library/vitest']
  }
})
```

A test renders a view, acts on it and checks the DOM:

```ts
// Counter.spec.ts
import { it, expect } from 'vitest'
import { render, screen, fireEvent } from '@nanoviews/testing-library'
import { type WritableSignal, signal } from 'nanoviews/store'
import { button, component$ } from 'nanoviews'

const Counter = component$(({ $count }: { $count: WritableSignal<number> }) => (
  button({
    onClick() {
      $count(count => count + 1)
    }
  })(
    'count is ', $count
  )
))

it('should increment count on click', () => {
  const $count = signal(0)

  render(Counter({
    $count
  }))

  const counter = screen.getByRole('button')

  expect(counter.textContent).toBe('count is 0')

  fireEvent.click(counter)

  expect(counter.textContent).toBe('count is 1')
  expect($count()).toBe(1)
})
```

## Documentation

For comprehensive guides, advanced patterns, and API reference, visit the [documentation website](https://nanoviews.js.org/testing/).
