# @nano_kit/react

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/%40nano_kit%2Freact.svg
[npm-url]: https://npmjs.com/package/@nano_kit/react

[deps]: https://img.shields.io/librariesio/release/npm/%40nano_kit%2Freact
[deps-url]: https://libraries.io/npm/%40nano_kit%2Freact/tree

[size]: https://deno.bundlejs.com/badge?q=%40nano_kit%2Freact
[size-url]: https://bundlejs.com/?q=%40nano_kit%2Freact

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nano_kit/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nano_kit/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nano_kit.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nano_kit

The `@nano_kit/react` package provides seamless integration between [@nano_kit/store](../store) signals, dependency injection and React components.

## Installation

```bash
pnpm add @nano_kit/store @nano_kit/react
# or
npm install @nano_kit/store @nano_kit/react
# or
yarn add @nano_kit/store @nano_kit/react
```

## Quick Start

Here is a minimal example demonstrating reactive state in React:

```tsx
import { signal } from '@nano_kit/store'
import { useSignal } from '@nano_kit/react'

const $count = signal(0)

export function Counter() {
  const count = useSignal($count)

  return (
    <button onClick={() => $count(count + 1)}>
      Count: {count}
    </button>
  )
}
```

## Documentation

For comprehensive guides, API reference, and integration patterns, visit the [documentation website](https://nano_kit.js.org/integrations/react).
