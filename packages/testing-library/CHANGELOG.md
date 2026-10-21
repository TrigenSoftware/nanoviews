# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.0](https://github.com/TrigenSoftware/nanoviews/compare/v1.0.0-alpha.9...v1.0.0) (2026-10-21)

### Nanoviews 1.0 🎉

Nanoviews' first stable release is out, together with [Nano Kit 2.0](https://nano-kit.js.org/), whose signals it shares. A view is a tree of element calls, attributes first and children second, that builds real DOM once. The signals bound into it update their own nodes in place: no JSX, no virtual DOM, no re-render, in 3.5 to 7 kB minified and brotlied.

```ts
import { signal, length } from 'nanoviews/store'
import { form, input, ul, li, p, mount, component$, for_ } from 'nanoviews'

const Todos = component$(() => {
  const $todos = signal(['Release 1.0'])
  const $draft = signal('')

  return (
    form({
      onSubmit(event) {
        event.preventDefault()
        $todos(todos => [...todos, $draft()])
        $draft('')
      }
    })(
      input({
        placeholder: 'What next?',
        value: $draft
      }),
      ul()(
        for_($todos)(
          $todo => li()(
            $todo
          )
        )
      ),
      p()(
        'Total: ', length($todos)
      )
    )
  )
})

mount(Todos, document.querySelector('#app')!)
// <form><input placeholder="What next?"><ul><li>Release 1.0</li></ul><p>Total: 1</p></form>
```

Start with the [documentation](https://nanoviews.js.org/getting-started/).

### ⚠ BREAKING CHANGES

* `render` of `@nanoviews/testing-library` no longer takes a `[component, ...args]`
* the packages require Node.js 24 or newer.

### Features

* publish the packages and rework the story API ([#5](https://github.com/TrigenSoftware/nanoviews/issues/5)) ([6d72f43](https://github.com/TrigenSoftware/nanoviews/commit/6d72f4354f6ccf206115c14e7d748d4c014d9e65))
* require Node.js 24 ([#47](https://github.com/TrigenSoftware/nanoviews/issues/47)) ([617cdd7](https://github.com/TrigenSoftware/nanoviews/commit/617cdd720143cf0c2877b10dc157157b0b8a5ca8))
* return a composed story unbuilt, like a component instance ([#77](https://github.com/TrigenSoftware/nanoviews/issues/77)) ([786d0b9](https://github.com/TrigenSoftware/nanoviews/commit/786d0b91cff0392180f0c56618912b163dc2f668))
* upgrade dev tools for new nanoviews version ([5dbef34](https://github.com/TrigenSoftware/nanoviews/commit/5dbef3436799b56b630292c47a8b3ef4edfbf408))

### Bug Fixes

* support TypeScript 7 ([#156](https://github.com/TrigenSoftware/nanoviews/issues/156)) ([6d9edce](https://github.com/TrigenSoftware/nanoviews/commit/6d9edce57bd709859deb9cf86d9a982ab7cf4a11))
* use oxlint ([#135](https://github.com/TrigenSoftware/nanoviews/issues/135)) ([e16f28a](https://github.com/TrigenSoftware/nanoviews/commit/e16f28a22549f911a8c133e83d46a945b05aac85))
