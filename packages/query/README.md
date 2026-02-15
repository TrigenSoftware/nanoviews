# @nano_kit/query

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nano_kit/query.svg
[npm-url]: https://npmjs.com/package/@nano_kit/query

[deps]: https://img.shields.io/librariesio/release/npm/@nano_kit/query
[deps-url]: https://libraries.io/npm/@nano_kit/query

[size]: https://deno.bundlejs.com/badge?q=@nano_kit/query
[size-url]: https://bundlejs.com/?q=@nano_kit/query

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nano_kit/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nano_kit/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nano_kit.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nano_kit

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../../website/src/assets/pulsar_white.svg">
  <img alt="Four-pointed pulsar star logo" src="../../website/src/assets/pulsar_black.svg" width="100" height="100" align="right">
</picture>

A small and powerful remote data manager for [@nano_kit/store](../store) state manager.

- **Small**. Minimal footprint with tree-shakable architecture.
- **Type-safe**. Full TypeScript support with type inference for queries and mutations.
- **Signal-based**. Built on top of [@nano_kit/store](../store)'s reactive signals for automatic UI updates.
- **Flexible**. Supports queries, infinite queries, mutations, and operations with cache management.
- **Extensible**. Customizable with settings and extensions.

## Installation

```bash
pnpm add @nano_kit/store @nano_kit/query
# or
npm install @nano_kit/store @nano_kit/query
# or
yarn add @nano_kit/store @nano_kit/query
```

## Quick Start

Here is a minimal example demonstrating reactive data fetching with automatic cache management:

```ts
import { signal, effect } from '@nano_kit/store'
import { queryKey, client } from '@nano_kit/query'

/* Define a cache key for your data */
const PostKey = queryKey<[postId: number], Post | null>('post')

/* Create a signal with the post ID to fetch */
const $postId = signal(1)

/* Create a query client */
const { query } = client()

/* Create a reactive query */
const [$post, $postError, $postLoading] = query(PostKey, [$postId], postId => fetch(`/api/posts/${postId}`).then(r => r.json()))

/* React to data changes (mounting $post triggers data fetching) */
const unsub = effect(() => {
  if ($postLoading()) {
    console.log('Loading...')
  } else if ($postError()) {
    console.log('Error:', $postError())
  } else {
    console.log('Post:', $post())
  }
})
// Output: Loading...
// Output: Post: { id: 1, title: 'First Post', ... }

/* Update triggers automatic refetch */
$postId(2)
// Output: Loading...
// Output: Post: { id: 2, title: 'Second Post', ... }

/* Cleanup: removes listener and stops data fetching */
unsub()
```

## Documentation

For comprehensive guides, advanced patterns, and API reference, visit the [documentation website](https://nano_kit.js.org/query).
