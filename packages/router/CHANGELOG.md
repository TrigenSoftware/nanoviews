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

### Features

* add the nanoviews integration of `@nano_kit/router` ([#53](https://github.com/TrigenSoftware/nanoviews/issues/53)) ([87fb7f6](https://github.com/TrigenSoftware/nanoviews/commit/87fb7f648fa02de430a7896ea8b677606383a3ab))
* rename `ValueOrAccessor` to `Signalish` ([#210](https://github.com/TrigenSoftware/nanoviews/issues/210)) ([c42723a](https://github.com/TrigenSoftware/nanoviews/commit/c42723a56944cea0f3935b1456a45b607924f0a9))

### Bug Fixes

* preserve `statusCode` of loadable `notFound` pages ([#166](https://github.com/TrigenSoftware/nanoviews/issues/166)) ([40da5a6](https://github.com/TrigenSoftware/nanoviews/commit/40da5a6c688e7406242267e1a973f974a0f3843c))
