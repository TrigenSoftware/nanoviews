# @kida/react

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/%40kida%2Freact.svg
[npm-url]: https://npmjs.com/package/@kida/react

[deps]: https://img.shields.io/librariesio/release/npm/%40kida%2Freact
[deps-url]: https://libraries.io/npm/%40kida%2Freact/tree

[size]: https://deno.bundlejs.com/badge?q=%40kida%2Freact
[size-url]: https://bundlejs.com/?q=%40kida%2Freact

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

[Kida](packages/kida#readme) integration for React.

```tsx
import { signal } from 'kida'
import { useSignal } from '@kida/react'

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
pnpm add -D kida
# or
npm i -D kida
# or
yarn add -D kida
```

## Exports

### useSignal

`useSignal` hook returns the current value of the signal store and subscribes to changes.

```tsx
import { signal } from 'kida'
import { useSignal } from '@kida/react'

const $user = signal<User | null>(null)

export function UserProfile() {
  const user = useSignal($user)

  return <div>{user?.name}</div>
}
```

### InjectionContext

`InjectionContext` is a component to initialize injection context and provide dependencies to the children.

```tsx
import { InjectionContext, useInject } from '@kida/react'

function Theme(): 'light' | 'dark' {
  return 'light'
}

function App() {
  return (
    <InjectionContext providers={[[Theme, 'dark']]}>
      <TopBar />
    </InjectionContext>
  )
}
```

### useInject

`useInject` hook returns the value of the dependency.

```tsx
import { useInject } from '@kida/react'

function TopBar() {
  const theme = useInject(Theme)

  return <div>Current theme: {theme}</div>
}
```

### useAction

`useAction` hook creates an action that runs within the current injection context.

```tsx
import { signal } from 'kida'
import { useInject, useAction } from '@kida/react'

function Theme() {
  return signal<'light' | 'dark'>('light')
}

function setThemeAction(theme: 'light' | 'dark') {
  const $theme = useInject(Theme)

  $theme.set(theme)
}

function TopBar() {
  const setTheme = useAction(setThemeAction)

  return (
    <button onClick={() => setTheme('dark')}>
      Switch to dark theme
    </button>
  )
}
```
