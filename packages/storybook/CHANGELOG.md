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

* apply the annotations of `setProjectAnnotations` to composed stories ([#66](https://github.com/TrigenSoftware/nanoviews/issues/66)) ([8d91e4c](https://github.com/TrigenSoftware/nanoviews/commit/8d91e4cc76c6302c2713732afebb6ae2398900b8))
* derive plain args from the `Signalish` props of a component ([#36](https://github.com/TrigenSoftware/nanoviews/issues/36)) ([307ece7](https://github.com/TrigenSoftware/nanoviews/commit/307ece7cc4b609a4fcaa1e96fb91b21fc5b61009)), closes [#28](https://github.com/TrigenSoftware/nanoviews/issues/28)
* fix auto unmount ([9f31231](https://github.com/TrigenSoftware/nanoviews/commit/9f31231159be827db92216d0cd01f215f2284c45))
* render a story inside the `context$` of its decorator ([#72](https://github.com/TrigenSoftware/nanoviews/issues/72)) ([53b8f48](https://github.com/TrigenSoftware/nanoviews/commit/53b8f48801e40c0cc49c52abe25ef83fddd5a873))
* use oxlint ([#135](https://github.com/TrigenSoftware/nanoviews/issues/135)) ([e16f28a](https://github.com/TrigenSoftware/nanoviews/commit/e16f28a22549f911a8c133e83d46a945b05aac85))
