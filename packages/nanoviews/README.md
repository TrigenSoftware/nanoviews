# nanoviews

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/nanoviews.svg
[npm-url]: https://npmjs.com/package/nanoviews

[deps]: https://img.shields.io/librariesio/release/npm/nanoviews
[deps-url]: https://libraries.io/npm/nanoviews/tree

[size]: https://packagephobia.com/badge?p=nanoviews
[size-url]: https://packagephobia.com/result?p=nanoviews

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews


A small Direct DOM library for creating user interfaces.

## Install

```bash
pnpm add -D nanoviews
# or
npm i -D nanoviews
# or
yarn add -D nanoviews
```

## Usage example

```js
import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { atom } from 'nanostores'
import { div, a, img, h1, button, p, render } from 'nanoviews'

function App() {
  const $counter = atom(0)

  return div()(
    a({ href: 'https://vitejs.dev', target: '_blank' })(
      img({ src: viteLogo, class: 'logo', alt: 'Vite logo' })
    ),
    a({ href: 'https://www.typescriptlang.org/', target: '_blank' })(
      img({ src: typescriptLogo, class: 'logo vanilla', alt: 'TypeScript logo' })
    ),
    h1()('Vite + TypeScript'),
    div({ class: 'card' })(
      button({
        id: 'counter',
        type: 'button',
        onClick() {
          $counter.set($counter.get() + 1)
        }
      })('count is ', $counter)
    ),
    p({ class: 'read-the-docs' })('Click on the Vite and TypeScript logos to learn more')
  )
}

render(App(), document.querySelector('#app'))
```

## Docs

Work in progress...
