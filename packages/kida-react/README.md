# @kidajs/react

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/%40kidajs%2Freact.svg
[npm-url]: https://npmjs.com/package/@kidajs/react

[deps]: https://img.shields.io/librariesio/release/npm/%40kidajs%2Freact
[deps-url]: https://libraries.io/npm/%40kidajs%2Freact/tree

[size]: https://deno.bundlejs.com/badge?q=%40kidajs%2Freact
[size-url]: https://bundlejs.com/?q=%40kidajs%2Freact

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

[Kida](../kida#readme) integration for React.

```tsx
import { signal } from 'kida'
import { useSignal } from '@kidajs/react'

const $user = signal<User | null>(null)

export function UserProfile() {
  const user = useSignal($user)

  return <div>{user?.name}</div>
}
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#exports">Exports</a>
<br />
<hr />

## Install

```bash
pnpm add kida @kidajs/react
# or
npm i kida @kidajs/react
# or
yarn add kida @kidajs/react
```

## Exports

### useSignal

`useSignal` hook returns the current value of the signal store and subscribes to changes.

```tsx
import { signal } from 'kida'
import { useSignal } from '@kidajs/react'

const $user = signal<User | null>(null)

export function UserProfile() {
  const user = useSignal($user)

  return <div>{user?.name}</div>
}
```

### InjectionContextProvider

`InjectionContextProvider` is a component to initialize injection context and provide dependencies to the children.

```tsx
import { provide } from 'kida'
import { InjectionContextProvider, useInject } from '@kidajs/react'

function $Theme(): 'light' | 'dark' {
  return 'light'
}

function App() {
  return (
    <InjectionContextProvider context={[provide($Theme, 'dark')]}>
      <TopBar />
    </InjectionContextProvider>
  )
}
```

### useInject

`useInject` hook returns the value of the dependency.

```tsx
import { useInject } from '@kidajs/react'

function TopBar() {
  const theme = useInject($Theme)

  return <div>Current theme: {theme}</div>
}
```
