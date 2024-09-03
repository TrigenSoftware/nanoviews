# @nanoviews/stores

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/%40nanoviews%2Fstores.svg
[npm-url]: https://npmjs.com/package/@nanoviews/stores

[deps]: https://img.shields.io/librariesio/release/npm/%40nanoviews%2Fstores
[deps-url]: https://libraries.io/npm/%40nanoviews%2Fstores/tree

[size]: https://packagephobia.com/badge?p=%40nanoviews%2Fstores
[size-url]: https://packagephobia.com/result?p=%40nanoviews%2Fstores

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

A small state management library for Nanoviews inspired by [Nano Stores](https://github.com/nanostores/nanostores).

- **Small**. Between 297 B and 2.36 kB (minified and brotlied). Zero dependencies.
- **Fast**. With small atomic and computed stores, you do not need to call the selector function for all components on every store change.
- Designed for best **Tree-Shaking**: only the code you use is included in your bundle.
- **TypeScript**-first.

```ts
// store/users.ts
import { list, push, record } from '@nanoviews/stores'

export const $users = list([] as User[], record)

export function addUser(user: User) {
  push($users, user)
}
```

```ts
// store/admins.ts
import { computed, list, record } from '@nanoviews/stores'
import { $users } from './users.js'

export const $admins = list(
  computed($users, users => users.filter(i => i.isAdmin)),
  record
)
```

```tsx
// components/admins.ts
import { $admins } from '../stores/admins.js'

export const Admins = component$(() => ul()(
  for$($admins, admin => li()(admin.name))
))
```

<hr />
<a href="#install">Install</a>
<!-- span>&nbsp;&nbsp;•&nbsp;&nbsp;</span -->
<br />
<hr />

## Install

```bash
pnpm add -D @nanoviews/stores
# or
npm i -D @nanoviews/stores
# or
yarn add -D @nanoviews/stores
```

*...Work in progress...*
