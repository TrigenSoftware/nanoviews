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

A small state management library inspired by [Nano Stores](https://github.com/nanostores/nanostores).

- **Small**. Between 366 B and 2.84 kB (minified and brotlied). Zero dependencies.
- **~2x faster** than Nano Stores.
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

export const $admins = computed(get => get($users).filter(user => user.isAdmin))
```

```tsx
// components/admins.ts
import { record } from 'kida'
import { $admins } from '../stores/admins.js'

export function Admins() {
  return ul()(
    for$($admins, user => user.id)(
      $admin => li()(record($admin).name)
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
<a href="#extra-stores">Extra stores</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#tasks">Tasks</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#ssr">SSR</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#utils">Utils</a>
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

## Basics

### Signal

Signal is a basic store type. It stores a single value.

```ts
import { signal, update } from 'kida'

const $count = signal(0)

$count.set($count.get() + 1)
// or
update($count, count => count + 1)
```

To listen changes, use the `listen` or `subscribe` function. `subscribe` will call the listener immediately.

```ts
import { signal, subscribe } from 'kida'

const $count = signal(0)

const unsubscribe = subscribe($count, count => {
  console.log('Count:', count)
})
// later you can unsubscribe
unsubscribe()
```

### Computed

Computed is a store that depends on other stores. It updates when its dependencies change.

```ts
import { computed } from 'kida'

const $firstName = signal('John')
const $lastName = signal('Doe')
const $fullName = computed(get => `${get($firstName)} ${get($lastName)}`)

console.log($fullName.get()) // John Doe
```

To batch updates, use the `batch` function.

```ts
import { computed, batch } from 'kida'

computed(get => `${get($firstName)} ${get($lastName)}`, batch)
// or with specific debounce time
computed(get => `${get($firstName)} ${get($lastName)}`, batch(300))
```

### `observe` and `effect`

To subscribe to multiple stores at once, use `observe`. As with `subscribe`, the listener is called immediately.

```ts
import { signal, observe } from 'kida'

const $firstName = signal('John')
const $lastName = signal('Doe')

observe((get) => {
  console.log('Full name:', `${get($firstName)} ${get($lastName)}`)
})
```

`effect` accepts a signal store as a first argument to start observer on this [store mount](#lifecycles).

```ts
import { signal, effect } from 'kida'

const $weather = signal('sunny')
const $city = signal('Batumi')

effect($weather, (get) => {
  $weather.set(getWeather(get($city)))
})
```

`observe` and `effect` also accept `batch` function as a last argument.

### Lifecycles

One of main feature of Kida is that every store can be mounted (active) or unmounted (inactive). It allows to create lazy stores, which will use resources only if store is really used in the UI.

- Store is **mounted** when one or more listeners is attached to it.
- Store is **unmounted** when store has no listeners.

`onMount` lifecycle method adds callback for mount and unmount events.

```ts
import { signal, onMount } from 'kida'

const $count = signal(0)

onMount($count, () => {
  // Store is now active
  return () => {
    // Store is going to be inactive
  }
})
```

For performance reasons, store will move to disabled mode with 1 second delay after last listener unsubscribing. It allows to avoid unnecessary store updates in case of fast mount/unmount events.

There are other lifecycle methods:

- `onStart($signal, (shared) => void)`: first listener was attached. Low-level method. It is better to use `onMount` for simple lazy stores.
- `onStop($signal, (shared) => void)`: last listener was detached. Low-level method. It is better to use `onMount` for simple lazy stores.
- `onSet($signal, (nextValue, value, abort, shared) => void)`: before applying any changes to the store.
- `onNotify($signal, (value, prevValue, abort, shared) => void)`: before notifying store’s listeners about changes. It also avaiable under `onChange` alias.

- `onSet` and `onNotify` events has `abort()` function to prevent changes or notification.
- All event listeners can communicate with shared object.

```ts
import { signal, onSet } from 'kida'

const $name = signal('')

onSet($name, (nextValue, _value, abort) => {
  if (!validate(nextValue)) {
    abort()
  }
})
```

## Complex data types

### Record

`record` method gives access to properties of the object as child stores.

```ts
import { signal, record } from 'kida'

const $user = record(signal({ name: 'Dan', age: 30 }))
const $name = $user.name

console.log($name.get()) // Dan
```

`record` method caches child stores in the parent store. So you can call `record` multiple times on same store without performance issues.

```ts
import { signal, record } from 'kida'

const $user = signal({ name: 'Dan', age: 30 })
const $name = record($user).name
const $age = record($user).age
```

### Deep Record

`deepRecord` method gives access to nested properties of the object as child stores.

```ts
import { signal, deepRecord } from 'kida'

const $user = deepRecord(signal({ name: 'Dan', address: { city: 'Batumi' } }))
const $city = $user.address.city

console.log($city.get()) // Batumi
```

### List

`atIndex` method creates a store for a specific index of an array.

```ts
import { signal, atIndex } from 'kida'

const $users = signal(['Dan', 'John', 'Alice'])
const $firstUser = atIndex($users, 0)

console.log($firstUser.get()) // Dan

$firstUser.set('Bob')

console.log($users.get()) // ['Bob', 'John', 'Alice']
```

`atIndex` supports dynamic indexes.

```ts
import { signal, atIndex } from 'kida'

const $users = signal(['Dan', 'John', 'Alice'])
const $index = signal(0)
const $user = atIndex($users, $index)

console.log($user.get()) // Dan

$index.set(1)

console.log($user.get()) // John
```

There are also other methods to work with arrays:

- `updateList($list, fn)` - update the value of the list store using a function.
- `push($list, ...values)` - add values to the list store.
- `pop($list)` - removes the last element from a list store and returns it.
- `shift($list)` - removes the first element from a list store and returns it.
- `unshift($list, ...values)` - inserts new elements at the start of an list store, and returns the new length of the list.
- `getIndex($list, index)` - get value at index from the list store.
- `setIndex($list, index, value)` - set value at index in the list store.
- `deleteIndex($list, index)` - delete element at index from the list store.
- `clearList($list)` - clear the list store.
- `includes($list, value)` - check if the list store includes a value.

### Map

`atKey` method creates a store for a specific key of an object map.

```ts
import { signal, atKey } from 'kida'

const $users = signal({
  2: 'Dan',
  4: 'John',
  6: 'Alice'
})
const $atId4 = atKey($users, 4)

console.log($atId4.get()) // John

$atId4.set('Bob')

console.log($atId4.get()) // { 2: 'Dan', 4: 'Bob', 6: 'Alice' }
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

console.log($user.get()) // John

$index.set(6)

console.log($user.get()) // Alice
```

There are also other methods to work with object maps:

- `getKey($map, key)` - get value by key from the map store.
- `setKey($map, key, value)` - set value by key to the map store.
- `deleteKey($map, key)` - delete item by key from the map store.
- `clearMap($map)` - clear the map store.
- `has($map, key)` - check if the map store has the key.

## Extra stores

### Lazy

`lazy` method creates a store that is runs initializer function only when it is accessed.

```ts
import { lazy } from 'kida'

const $savedString = lazy(() => localStorage.getItem('string') ?? '')

console.log($savedString.get()) // runs initializer function
```

### External

`external` method creates a store that can receive value from external sources.

```ts
import { external, subscribe } from 'kida'

const $mq = external((set) => {
  const mq = window.matchMedia('(min-width: 600px)')
  const setMatched = (mq) => set(mq.matches)

  setMatched(mq)

  return () => {
    mq.addEventListener('change', setMatched)

    return () => mq.removeEventListener('change', setMatched)
  }
})

subscribe($mq, (matched) => {
  console.log('Media query matched:', matched)
})
```

### Mapped

`mapped` method creates a store that maps the value of another store. Usually you can use `computed` for this, but `mapped` is useful when you need to increase performance.

```ts
import { signal, mapped } from 'kida'

const $names = signal(['Dan', 'John', 'Alice'])
const $count = mapped($names, names => names.length)
```

By default map function is not memoized and can be called multiple times with same value. You can use `memo` function to memoize map function.

```ts
import { signal, mapped, memo } from 'kida'

const $names = signal(['Dan', 'John', 'Alice'])
const $count = mapped($names, memo(names => names.length))
```

## Tasks

`addTask` can be used to mark all async operations during store initialization.

```ts
import { signal, addTask, onMount } from 'kida'

const tasks = new Set()
const $user = signal(null)

onMount($user, () => {
  addTask(tasks, fetchUser().then(user => $user.set(user)))
})
```

You can wait for all ongoing tasks end with `allTasks` method.

```ts
import { allTasks, start } from 'kida'

start($user)
await allTasks(tasks)
```

### Channel

To handle async operations in your app, is better to use `channel` method. It creates task runner function and stores with loading and error states.

```ts
import { channel, signal, onMount } from 'kida'

const tasks = new Set()
const $user = signal(null)
const [userTask, $userLoading, $userError] = channel(tasks)

function fetchUser() {
  return userTask(async (signal) => {
    const response = await fetch('/user', { signal })
    const user = await response.json()

    $user.set(user)
  })
}

onMount($user, fetchUser)
```

Task function receives `AbortSignal` as an argument, so you can run only one task at a time.

## SSR

To successfully use stores with SSR, stores should be created for each request. To save tree-shaking capabilities and implement SSR features, mini dependency injection system is implemented in Kida.

### Dependency Injection

Dependency injection implementation in Kida has four main methods:

1. `InjectionContext` - store for shared dependencies.
2. `run` - function to run code within the context.
3. `inject` - accepts a factory function and returns dependency from the context or initializes it.
3. `action` - helper to bind action functions to the context.

```ts
import { InjectionContext, run, inject, action, signal, onMount, Tasks, channel, observe } from 'kida'

function UserChannel() {
  const tasks = inject(Tasks)

  return channel(tasks)
}

function UserSignal() {
  return signal(null)
}

function fetchUserAction() {
  const [userTask] = inject(UserChannel)
  const $user = inject(UserSignal)

  return userTask(async (signal) => {
    const response = await fetch('/user', { signal })
    const user = await response.json()

    $user.set(user)
  })
}

function UserStore() {
  const [userTask, $userLoading, $userError] = inject(UserChannel)
  const $user = inject(UserSignal)
  const fetchUser = action(fetchUserAction)

  onMount($user, fetchUser)

  return { $user, $userLoading, $userError }
}

const context = new InjectionContext()

run(context, () => {
  const { $user, $userLoading, $userError } = inject(UserStore)

  observe((get) => {
    console.log('User:', get($user))
    console.log('Loading:', get($userLoading))
    console.log('Error:', get($userError))
  })
})
```

> [!NOTE]
> With UI frameworks you will not use `InjectionContext` and `run` directly. Integrations with frameworks should include own more convenient API to work with injection context.

### Serialization

To serialize stores while SSR, firstly you should mark stores with `serializable` method to assign serialization key.

```ts
import { signal, serializable } from 'kida'

function UserSignal() {
  return serializable('user', signal(null))
}
```

Then, on SSR server, you can use `serialize` method wait all tasks and serialize stores.

```ts
import { serialize } from 'kida'

const serialized = await serialize(() => {
  const { $user } = inject(UserStore)

  return [$user] // stores to trigger mount event
})
```

On client side you should provide serialized data to context with `Serialized` factory.

```ts
import { InjectionContext, Serialized, run, inject, observe } from 'kida'

const serialized = {
  user: {
    name: 'John'
  }
}
const context = new InjectionContext(undefined, [[Serialized, serialized]])

run(context, () => {
  const { $user, $userLoading, $userError } = inject(UserStore)

  observe((get) => {
    console.log('User:', get($user))
    console.log('Loading:', get($userLoading))
    console.log('Error:', get($userError))
  })
})
```

> [!NOTE]
> With UI frameworks you will not use `InjectionContext` and `run` directly. Integrations with frameworks should include own more convenient API to work with injection context.

## Utils

### `toSignal`

`toSignal` method converts any value to signal store or returns signal store as is.

```ts
import { toSignal, computed } from 'kida'

const $count = toSignal(0) // WritableSignal<number>
const $double = toSignal(computed(get => get($count) * 2)) // ReadableSignal<number>
```

### `length$`

`length$` method creates a store that tracks the `length` property of the object.

```ts
import { signal, length$ } from 'kida'

const $users = signal(['Dan', 'John', 'Alice'])
const $count = length$($users)
```

### `boolean$`

`boolean$` method creates a store that converts the value to a boolean.

```ts
import { signal, boolean$ } from 'kida'

const $user = signal(null)
const $hasUser = boolean$($user)
```
