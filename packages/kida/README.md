# Kida

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/kida.svg
[npm-url]: https://npmjs.com/package/kida

[deps]: https://img.shields.io/librariesio/release/npm/kida
[deps-url]: https://libraries.io/npm/kida/tree

[size]: https://deno.bundlejs.com/badge?q=kida
[size-url]: https://bundlejs.com/?q=kida

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

A small state management library inspired by [Nano Stores](https://github.com/nanostores/nanostores) and based on [Agera](https://github.com/TrigenSoftware/nanoviews/tree/main/packages/agera).

- **Small**. Around 2 kB for basic methods (minified and brotlied). Zero dependencies.
- **~5x faster** than Nano Stores.
- Designed for best **Tree-Shaking**: only the code you use is included in your bundle.
- **TypeScript**-first.

```ts
// store/users.ts
import { signal, push } from 'kida'

export const $users = signal<User[]>([])

export function addUser(user: User) {
  push($users, user)
}
```

```ts
// store/admins.ts
import { computed } from 'kida'
import { $users } from './users.js'

export const $admins = computed(() => $users().filter(user => user.isAdmin))
```

```tsx
// components/admins.ts
import { record } from 'kida'
import { $admins } from '../stores/admins.js'

export function Admins() {
  return ul()(
    for$($admins, user => user.id)(
      $admin => li()(record($admin).$name)
    )
  )
}
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#basics">Basics</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#complex-data-types">Complex data types</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#extra-signals">Extra signals</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#tasks">Tasks</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#ssr">SSR</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#utils">Utils</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#why">Why?</a>
<br />
<hr />

## Install

```bash
pnpm add kida
# or
npm i kida
# or
yarn add kida
```

## Basics

### Signal

Signal is a basic store type. It stores a single value.

```ts
import { signal } from 'agera'

const $count = signal(0)

$count($count() + 1)
// or
$count(count => count + 1)
```

To watch signal changes, use the `effect` function. Effect will be called immediately and every time the signal changes.

```ts
import { signal, effect } from 'kida'

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
import { computed } from 'kida'

const $firstName = signal('John')
const $lastName = signal('Doe')
const $fullName = computed(() => `${$firstName()} ${$lastName()}`)

console.log($fullName()) // John Doe
```

### `effectScope`

`effectScope` creates a scope for effects. It allows to stop all effects in the scope at once.

```ts
import { signal, effectScope, effect } from 'kida'

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
import { signal, effectScope, effect } from 'kida'

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

### `onMountEffect`

`onMountEffect` accepts a signal as a first argument to start effect on this [signal mount](#lifecycles).

```ts
import { signal, mountable, onMountEffect } from 'kida'

const $weather = mountable(signal('sunny'))
const $city = signal('Batumi')

onMountEffect($weather, () => {
  $weather(getWeather($city()))
})
```

### `onMountEffectScope`

`onMountEffectScope` accepts a signal as a first argument to run effect scope on this [signal mount](#lifecycles).

```ts
import { signal, mountable, onMountEffectScope, effect } from 'kida'

const $weather = mountable(signal('sunny'))
const $city = signal('Batumi')

onMountEffectScope($weather, () => {
  effect(() => {
    console.log('Weather:', $weather())
  })

  effect(() => {
    console.log('City:', $city())
  })
})
```

### Lifecycles

One of main feature of Kida is that you can create *mountable* signals. It allows to create lazy signals, which will use resources only if signal is really used in the UI.

- Signal is **mounted** when one or more effects is attached to it.
- Signal is **unmounted** when signal has no effects.

`mountable` method makes signal mountable.

`onMount` lifecycle method adds callback for mount and unmount events.

```ts
import { signal, mountable, onMount, effect } from 'kida'

const $count = mountable(signal(0))

onMount($count, () => {
  // Signal is now active
  return () => {
    // Signal is going to be inactive
  }
})

// will trigger mount event
const stop = effect(() => {
  console.log('Count:', $count())
})
// will trigger unmount event
stop()
```

For performance reasons, signal will move to disabled mode with 1 second delay after last effect unsubscribing. It allows to avoid unnecessary signal updates in case of fast mount/unmount events.

There are other lifecycle methods:

- `onStart($signal, () => void)`: first effect was attached. Low-level method. It is better to use `onMount` for simple lazy signals.
- `onStop($signal, () => void)`: last effect was detached. Low-level method. It is better to use `onMount` for simple lazy signals.

#### `start`

`start` method starts signal and returns function to stop it. It can be useful to write tests for signals.

```ts
import { signal, mountable, onMount, start } from 'kida'

const $count = mountable(signal(0))

onMount($count, () => {
  console.log('Signal started')
})

const stop = start($count) // Signal started

stop()
```

#### `exec`

`exec` method starts and immediately stops signal and returns signal value. It can be used to trigger onMount events.

```ts
import { signal, mountable, onMount, exec } from 'kida'

const $count = mountable(signal(0))

onMount($count, () => {
  console.log('Signal started')
})

exec($count) // Signal started and stopped
```

## Complex data types

### Record

`record` method gives access to properties of the object as child signals.

```ts
import { record } from 'kida'

const $user = record({ name: 'Dan', age: 30 })
const $name = $user.$name

console.log($name()) // Dan
```

Also record can be created from another signal.

```ts
const $userRecord = record($computedUser)
```

`record` method caches child signals in the parent signal. So you can call `record` multiple times on same signal without performance issues.

```ts
import { signal, record } from 'kida'

const $user = signal({ name: 'Dan', age: 30 })
const $name = record($user).$name
const $age = record($user).$age
```

### Deep Record

`deepRecord` method gives access to nested properties of the object as child signals.

```ts
import { deepRecord } from 'kida'

const $user = deepRecord({ name: 'Dan', address: { city: 'Batumi' } })
const $city = $user.$address.$city

console.log($city()) // Batumi
```

Also deep record can be created from another signal.

```ts
const $userRecord = deepRecord($computedUser)
```

### List

`atIndex` method creates a signal for a specific index of an array.

```ts
import { signal, atIndex } from 'kida'

const $users = signal(['Dan', 'John', 'Alice'])
const $firstUser = atIndex($users, 0)

console.log($firstUser()) // Dan

$firstUser('Bob')

console.log($users()) // ['Bob', 'John', 'Alice']
```

`atIndex` supports dynamic indexes.

```ts
import { signal, atIndex } from 'kida'

const $users = signal(['Dan', 'John', 'Alice'])
const $index = signal(0)
const $user = atIndex($users, $index)

console.log($user()) // Dan

$index(1)

console.log($user()) // John
```

There are also other methods to work with arrays:

- `atFindIndex($list, predicate)` - create a signal for the first element that satisfies the predicate function.
- `updateList($list, fn)` - update the value of the list signal using a function.
- `push($list, ...values)` - add values to the list signal.
- `pop($list)` - removes the last element from a list signal and returns it.
- `shift($list)` - removes the first element from a list signal and returns it.
- `unshift($list, ...values)` - inserts new elements at the start of an list signal, and returns the new length of the list.
- `getIndex($list, index)` - get value at index from the list signal.
- `setIndex($list, index, value)` - set value at index in the list signal.
- `deleteIndex($list, index)` - delete element at index from the list signal.
- `clearList($list)` - clear the list signal.
- `includes($list, value)` - check if the list signal includes a value.

### Map

`atKey` method creates a signal for a specific key of an object map.

```ts
import { signal, atKey } from 'kida'

const $users = signal({
  2: 'Dan',
  4: 'John',
  6: 'Alice'
})
const $atId4 = atKey($users, 4)

console.log($atId4()) // John

$atId4('Bob')

console.log($atId4()) // { 2: 'Dan', 4: 'Bob', 6: 'Alice' }
```

`atKey` supports dynamic indexes.

```ts
import { signal, atKey } from 'kida'

const $users = signal({
  2: 'Dan',
  4: 'John',
  6: 'Alice'
})
const $id = signal(4)
const $user = atKey($users, $id)

console.log($user()) // John

$index(6)

console.log($user()) // Alice
```

There are also other methods to work with object maps:

- `getKey($map, key)` - get value by key from the map signal.
- `setKey($map, key, value)` - set value by key to the map signal.
- `deleteKey($map, key)` - delete item by key from the map signal.
- `clearMap($map)` - clear the map signal.
- `has($map, key)` - check if the map signal has the key.

## Extra signals

### External

`external` method creates a signal that can receive value from external sources.

```ts
import { external, onMount, effect } from 'kida'

const $mq = external(($mq) => {
  const mq = window.matchMedia('(min-width: 600px)')
  const setMatched = (mq) => $mq(mq.matches)

  setMatched(mq)

  onMount($mq, () => {
    setMatched(mq)
    mq.addEventListener('change', setMatched)

    return () => mq.removeEventListener('change', setMatched)
  })
})

effect(() => {
  console.log('Media query matched:', $mq())
})
```

Also you can create external signal to save value in external storage.

```ts
import { external, effect } from 'kida'

const $locale = external(($locale) => {
  $local(localStorage.getItem('locale') ?? 'en')

  return (newLocale) => {
    localStorage.setItem('locale', newLocale)
    $locale(newLocale)
  }
})

$locale('ru') // will save 'ru' to localStorage
```

Or you can implement lazy initialization with external signal.

```ts
import { external } from 'kida'

const $savedString = external(($savedString) => {
  $savedString(localStorage.getItem('string') ?? '')
})

console.log($savedString()) // runs initializer function
```

### Paced

`paced` method creates a signal where updates are rate-limited.

```ts
import { signal, paced, effect, debounce } from 'kida'

const $search = signal('')
const $searchPaced = paced($search, debounce(300))

effect(() => {
  console.log('Search:', $search())
})

$searchPaced('a')
$searchPaced('ab')
// will log only 'ab' after 300ms
```

There is also `throttle` method to limit updates by time interval.

## Tasks

`addTask` can be used to mark all async operations during signal initialization.

```ts
import { signal, mountable, addTask, onMount } from 'kida'

const tasks = new Set()
const $user = mountable(signal(null))

onMount($user, () => {
  addTask(tasks, fetchUser().then(user => $user(user)))
})
```

You can wait for all current tasks end with `waitCurrentTasks` method.

```ts
import { waitCurrentTasks, start } from 'kida'

start($user)
await waitCurrentTasks(tasks)
```

Or you can wait for all tasks including future with `waitTasks` method.

```ts
import { waitTasks, start } from 'kida'

start($user)
await waitTasks(tasks)
```

## SSR

To successfully use signals with SSR, signals should be created for each request. To save tree-shaking capabilities and implement SSR features, mini dependency injection system is implemented in Kida.

### Dependency Injection

Dependency injection implementation in Kida has four main methods:

1. `InjectionContext` - store for shared dependencies.
2. `run` - function to run code within the context.
3. `inject` - accepts a factory function and returns dependency from the context or initializes it.
3. `action` - helper to bind action functions to the context.

```ts
import { InjectionContext, run, inject, action, signal, mountable, onMount, $TasksSet, channel, effect } from 'kida'

function $UserChannel() {
  return channel(inject($TasksSet))
}

function $UserSignal() {
  return mountable(signal(null))
}

function $UserStore() {
  const [userTask, $userLoading, $userError] = inject($UserChannel)
  const $user = inject($UserSignal)
  const fetchUser = action(() => userTask(async (signal) => {
    const response = await fetch('/user', { signal })
    const user = await response.json()

    $user(user)
  }))

  onMount($user, fetchUser)

  return { $user, $userLoading, $userError, fetchUser }
}

const context = new InjectionContext()

run(context, () => {
  const { $user, $userLoading, $userError } = inject($UserStore)

  effect(() => {
    console.log('User:', $user())
    console.log('Loading:', $userLoading())
    console.log('Error:', $userError())
  })
})
```

> [!NOTE]
> With UI frameworks you will not use `InjectionContext` and `run` directly. Integrations with frameworks should include own more convenient API to work with injection context.

### Serialization

To serialize signals while SSR, firstly you should mark signals with `serializable` method to assign serialization key.

```ts
import { signal, serializable } from 'kida'

function $UserSignal() {
  return serializable('user', signal(null))
}
```

Then, on SSR server, you can use `serialize` method wait all tasks and serialize signals.

```ts
import { serialize } from 'kida'

const serialized = await serialize(() => {
  const { $user } = inject($UserStore)

  return [$user] // signals to trigger mount event
})
```

On client side you should provide serialized data to context with `Serialized` factory.

```ts
import { InjectionContext, $Serialized, provide, run, inject, effect } from 'kida'

const serialized = {
  user: {
    name: 'John'
  }
}
const context = new InjectionContext([provide($Serialized, serialized)])

run(context, () => {
  const { $user, $userLoading, $userError } = inject(UserStore)

  effect(() => {
    console.log('User:', $user())
    console.log('Loading:', $userLoading())
    console.log('Error:', $userError())
  })
})
```

> [!NOTE]
> With UI frameworks you will not use `InjectionContext` and `run` directly. Integrations with frameworks should include own more convenient API to work with injection context.

## Utils

### `isSignal`

`isSignal` method checks if the value is a signal.

```ts
import { isSignal, signal } from 'kida'

isSignal(signal(1)) // true
```

### `toSignal`

`toSignal` method converts any value to signal or returns signal as is.

```ts
import { toSignal, computed } from 'kida'

const $count = toSignal(0) // WritableSignal<number>
const $double = toSignal(computed(() => $count() * 2)) // ReadableSignal<number>
```

### `length`

`length` method creates a signal that tracks the `length` property of the object.

```ts
import { signal, length } from 'kida'

const $users = signal(['Dan', 'John', 'Alice'])
const $count = length($users)
```

### `boolean`

`boolean` method creates a signal that converts the value to a boolean.

```ts
import { signal, boolean } from 'kida'

const $user = signal(null)
const $hasUser = boolean($user)
```

### `get`

`get` method gets the value from the signal or returns the given value.

```ts
import { signal, get } from 'kida'

get(signal(1)) // 1
get(1) // 1
```

### `composeDestroys`

`composeDestroys` method composes multiple destroy functions into one.

```ts
import { composeDestroys, effect } from 'kida'

effect(() => composeDestroys(
  intervalLogger($interval),
  windowResizeLogger($size)
))
```

## Why?

Nano Stores is a great library with wonderful idea of stores with lifecycles. But it has some drawbacks:

- **Performance**. Nano Stores is slow. Kida is ~5x faster than Nano Stores.
- **DX**. Kida is focused more on DX than on bundle size. Nano Stores is smaller, but (to my mind) have worse API.
- **SSR**. Nano Stores has no support for SSR. Kida has a built-in dependency injection system and serialization methods to work with SSR.

| Benchmark<br>Throughput avg (ops/s) | Kida / Agera | Alien Signals | Nano Stores |
| ------- | --------- | ------- | ------ |
| [signal](../benchmarks/atom.js) | 25 541 296 ± 0.00% | 25 692 493 ± 0.00% | 4 501 870 ± 0.01% |
| [computed](../benchmarks/computed.js) | 3 747 576 ± 0.01% | 3 979 152 ± 0.01% | 611 026 ± 0.04% |
| [effect](../benchmarks/effect.js) | 3 977 679 ± 0.01% | 4 165 849 ± 0.01% | 1 992 654 ± 0.01% |
