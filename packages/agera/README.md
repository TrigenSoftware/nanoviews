# Agera

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/agera.svg
[npm-url]: https://npmjs.com/package/agera

[deps]: https://img.shields.io/librariesio/release/npm/agera
[deps-url]: https://libraries.io/npm/agera/tree

[size]: https://deno.bundlejs.com/badge?q=agera
[size-url]: https://bundlejs.com/?q=agera

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

A small push-pull based signal library based on [alien-signals](https://github.com/stackblitz/alien-signals) algorithm.

Was created as reactivity system for [nanoviews](https://github.com/TrigenSoftware/nanoviews/tree/main/packages/nanoviews) and [Kida](https://github.com/TrigenSoftware/nanoviews/tree/main/packages/kida).

- **Small**. Around 1.37 kB for basic methods (minified and brotlied). Zero dependencies.
- **Super fast** as [alien-signals](https://github.com/stackblitz/alien-signals).
- Designed for best **Tree-Shaking**: only the code you use is included in your bundle.
- **TypeScript**-first.

```ts
import { signal, computed, effect } from 'agera'

const $count = signal(1)
const $doubleCount = computed(() => count() * 2)

effect(() => {
  console.log(`Count is: ${$count()}`);
}) // Console: Count is: 1

console.log($doubleCount()) // 2

$count(2) // Console: Count is: 2

console.log($doubleCount()) // 4
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#basics">API</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#differences-from-alien-signals">Differences from alien-signals</a>
<br />
<hr />

## Install

```bash
pnpm add -D agera
# or
npm i -D agera
# or
yarn add -D agera
```

## API

### Signal

Signal is a basic store type. It stores a single value.

```ts
import { signal, update } from 'agera'

const $count = signal(0)

$count($count() + 1)
// or
update($count, count => count + 1)
```

To watch signal changes, use the `effect` function. Effect will be called immediately and every time the signal changes.

```ts
import { signal, effect } from 'agera'

const $count = signal(0)

const stop = effect(() => {
  console.log('Count:', $count())

  return () => {
    // Cleanup function. Will be called before effect update and before effect stop.
  }
})
// later you can stop effect
stop()
```

### Computed

Computed is a signal that computes its value based on other signals.

```ts
import { computed } from 'agera'

const $firstName = signal('John')
const $lastName = signal('Doe')
const $fullName = computed(() => `${$firstName()} ${$lastName()}`)

console.log($fullName()) // John Doe
```

### `effectScope`

`effectScope` creates a scope for effects. It allows to stop all effects in the scope at once.

```ts
import { signal, effectScope, effect } from 'agera'

const $a = signal(0)
const $b = signal(0)
const stop = effectScope(() => {
  effect(() => {
    console.log('A:', $a())
  })

  effectScope(() => {
    effect(() => {
      console.log('B:', $b())
    })
  })
})

stop() // stop all effects
```

Also there is a possibility to create a lazy scope.

```ts
import { signal, effectScope, effect } from 'agera'

const $a = signal(0)
const $b = signal(0)
// All scopes will run immediately, but effects run is delayed
const start = effectScope(() => {
  effect(() => {
    console.log('A:', $a())
  })

  effectScope(() => {
    effect(() => {
      console.log('B:', $b())
    })
  })
}, true) // marks scope as lazy
// start all effects
const stop = start()

stop() // stop all effects
```

### Lifecycles

One of main feature of Agera is that every signal can be active or inactive. It allows to create lazy signals, which will use resources only if signal is really used in the UI.

- Signal is active when one or more effects is attached to it.
- Signal is incative when signal has no effects.

`onActivate` lifecycle method adds callback for activation and deactivation events.

```ts
import { signal, onActivate, effect } from 'agera'

const $count = signal(0)

onActivate($count, (active) => {
  console.log('Signal is', active ? 'active' : 'inactive')
})

// will activate signal
const stop = effect(() => {
  console.log('Count:', $count())
})
// will deactivate signal
stop()
```

### Batch updates

To batch updates you should wrap signal updates between `startBatch` and `endBatch`.

```ts
import { signal, startBatch, endBatch, effect } from 'agera'

const $a = signal(0)
const $b = signal(0)

effect(() => {
  console.log('Sum:', $a() + $b())
})

// Effects will be called only once
startBatch()
$a(1)
$b(2)
endBatch()
```

### Skip tracking

To skip tracking of signal changes you should wrap signal calls between `pauseTracking` and `resumeTracking`.

```ts
import { signal, pauseTracking, resumeTracking, effect } from 'agera'

const $a = signal(0)
const $b = signal(0)

effect(() => {
  const a = $a()

  pauseTracking()

  const b = $b()

  resumeTracking()

  console.log('Sum:', a + b)
})

// Will trigger effect run
$a(1)

// Will not trigger effect run
$b(2)
```

### Morph

`morph` methods allows to create signals that can change their getter and setter on the fly.

```ts
import { signal, morph, $$get, $$set, $$source } from 'agera'

const $string = signal('')
// Debounce signal updates
const $debouncedString = morph($string, {
  [$$set]: debounce($string, 300)
})
// Lazy initialization
const $lazyString = morph($string, {
  [$$get]() {
    this[$$set]('Lazy string')
    this[$$get] = this[$$source]
    return 'Lazy string'
  }
})
```

### `isSignal`

`isSignal` method checks if the value is a signal.

```ts
import { isSignal, signal } from 'agera'

isSignal(signal(1)) // true
```

## Differences from alien-signals

Key differences from [alien-signals](https://github.com/stackblitz/alien-signals):

- **Tree-shaking**. Agera is designed to be tree-shakable. Only the code you use is included in your bundle. Alien-signals is not well tree-shakable.
- **Size**. Agera has a little bit smaller size for basic methods than alien-signals.
- **Lifecycles**. Agera has lifecycles for signals. You can listen to signal activation and deactivation events.
- **Modificated `effectScope`**. Agera has a possibility to put effect scope inside another effect scope. Also there is a possibility to create a lazy scope.
