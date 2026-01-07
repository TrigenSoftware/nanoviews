# @nano_kit/query

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@nano_kit/query.svg
[npm-url]: https://npmjs.com/package/@nano_kit/query

[deps]: https://img.shields.io/librariesio/release/npm/@nano_kit/query
[deps-url]: https://libraries.io/npm/@nano_kit/query/tree

[size]: https://deno.bundlejs.com/badge?q=@nano_kit/query
[size-url]: https://bundlejs.com/?q=@nano_kit/query

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/nanoviews/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/nanoviews/actions

[coverage]: https://img.shields.io/codecov/c/github/TrigenSoftware/nanoviews.svg
[coverage-url]: https://app.codecov.io/gh/TrigenSoftware/nanoviews

A small and powerful remote data manager for [@nano_kit/store](../store/) state manager.

- **Small**. Minimal footprint with tree-shakable architecture.
- **Type-safe**. Full TypeScript support with type inference for queries and mutations.
- **Signal-based**. Built on top of [@nano_kit/store](../store/)'s reactive signals for automatic UI updates.
- **Flexible**. Supports queries, infinite queries, mutations, and operations with cache management.
- **Extensible**. Customizable with settings and extensions.

```ts
import { signal, effect } from '@nano_kit/store'
import { queryKey, client } from '@nano_kit/query'

// Define query cache key
const PostKey = queryKey<[postId: number], Post | null>('post')
// Signal with current post ID
const $postId = signal(1)
// Create query client
const { query } = client()
// Create reactive query
const [$post, $postError, $postLoading] = query(PostKey, [$postId], (postId) => PostsService.fetch(postId))

// Mounting $post signal will trigger data fetching
effect(() => {
  if ($postLoading()) {
    console.log('Loading...')
  } else if ($postError()) {
    console.log('Error:', $postError())
  } else {
    console.log('Post:', $post())
  }
})
```

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#basics">Basics</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#extra-queries">Extra Queries</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#extensions">Extensions</a>
<br />
<hr />

## Install

```bash
pnpm add @nano_kit/store @nano_kit/query
# or
npm i @nano_kit/store @nano_kit/query
# or
yarn add @nano_kit/store @nano_kit/query
```

## Basics

### Client

First, create a query client. The client provides methods for data fetching and cache management:

```ts
import { client } from '@nano_kit/query'

const {
  query,      // Create reactive queries
  invalidate, // Invalidate cache entries
  revalidate, // Revalidate cache entries
  $data,      // Get/set cached data
  $error,     // Get cached error
  $loading    // Get cached loading state
} = client()
```

### Cache Keys

Then you need to define cache keys for your data using `queryKey`:

```ts
import { queryKey } from '@nano_kit/query'

// Simple key
const UsersKey = queryKey<[], User[]>('users')

// Key with parameters
const PostKey = queryKey<[id: number], Post>('post')

// Key with filtered parameters
const SearchKey = queryKey<[query: string, page: number], SearchResult>(
  'search',
  ([query]) => [query] // Only use query for cache key, ignore page
)
```

You can use cache keys to work with cached data with `revalidate`, `invalidate` and `$data` methods:

```ts
revalidate(PostKey(1)) // mark post with ID 1 to refresh
invalidate(PostKey) // remove all posts from cache
$data(PostKey(1), newPostData) // update post with ID 1 in the cache
// ...
```

### Query

`query` creates a reactive query that automatically fetches data when mounted and refetches when parameters change:

```ts
import { signal, effect } from '@nano_kit/store'
import { client } from '@nano_kit/query'

const PostKey = queryKey<[postId: number], Post | null>('post')
const $postId = signal(1)
const {
  query,
  invalidate,
  revalidate,
  $data
} = client()
// Query will use parameters types from the cache key
const [$post, $postError, $postLoading] = query(PostKey, [$postId], (postId) => PostsService.fetch(postId))

// Mounting $post signal will trigger data fetching
effect(() => {
  if ($postLoading()) {
    console.log('Loading...')
  } else if ($postError()) {
    console.log('Error:', $postError())
  } else {
    console.log('Post:', $post())
  }
})
```

Then you can manipulate the cache and trigger refetches:

```ts
revalidate(PostKey($postId())) // mark post to refresh, active querires will refresh it
revalidate(PostKey) // mark all posts to refresh, active querires will refresh it
/*
Loading...
Post: { ... }
> revalidate()
Loading...
Post: { ... }
*/

invalidate(PostKey($postId())) // remove post from cache, active querires will refetch it
invalidate(PostKey) // remove all posts from cache, active queries will refetch it
/*
Loading...
Post: { ... }
> invalidate()
Post: null
Loading...
Post: { ... }
*/

effect(() => {
  const post1 = $data(PostKey(1)) // get and subscribe to data from cache
})

$data(PostKey(1), newPostData) // update post in the cache
/*
Post: { ...updated post data... }
*/
$data(PostKey(1), post => post && ({ ...post, title: 'New Title' })) // update post in the cache with function
/*
Post: { id: 1, title: 'New Title', ... }
*/
$data(PostKey, dataOrFn) // update all posts
/*
Post: { ...updated post data... }
*/
```

### Mutation

`mutation` creates a method for data modifications:

```ts
import { signal } from '@nano_kit/store'
import { client, mutations, queryKey } from '@nano_kit/query'

const PostKey = queryKey<[postId: number], Post | null>('post')
const $postId = signal(1)
const {
  mutation,
  revalidate,
  $data
} = client(mutations())
// Revalidate data in cache on update success:
const [updatePost, $updateResult, $updateError, $updating] = mutation<[params: UpdatePostParams], Post>(
  (params, ctx) => {
    const postId = $postId()

    onSuccess(ctx, () => {
      revalidate(PostKey(postId))
    })

    return PostsService.update(postId, params)
  }
)
// Or update data optimistically
const [updatePost, $updateResult, $updateError, $updating] = mutation<[params: UpdatePostParams], Post>(
  (params, ctx) => {
    const postId = $postId()
    const postKey = PostKey(postId)
    const post = $data(postKey)

    if (post) {
      $data(postKey, {
        ...post,
        ...params
      })

      // Revert changes on error
      onError(ctx, () => {
        $data(postKey, post)
      })
    }

    return PostsService.update(postId, params)
  }
)
// Execute mutation, it returns a promise with result and error
const [result, error] = await updatePost({
  title: 'New Title'
})
```

### Settings and Extensions

To provide best tree-shaking and flexibility, settings and extensions are provided as functions that you can pass to the client or individual queries/mutations/operations. There are different types of them, what you can apply to specific parts:

- **Client extensions** you can apply only to the client, it will extend client methods.
- **Client settings** you can apply to the client globally or to individual queries/mutations, it will set default behavior.
- **Query/Mutation settings** you can apply only to specific query/mutation, it will set behavior for it only.

Under the hood, `operation` and `infinite` are just special cases of `query` so they support same settings and extensions as `query`.

```ts
// Apply dedubeTime globally
const { query } = client(
  dedupeTime(8000)
)
// Or per query
const [$post] = query(PostKey, [$postId], PostsService.fetch, [
  dedupeTime(10000)
])
```

### Basic Settings

#### `cacheTime`

The `cacheTime` setting allows you to specify how long (in milliseconds) the data should remain in the cache before being considered stale and eligible for invalidation.

Default is `Infinity`.

```ts
import { client, cacheTime } from '@nano_kit/query'

const { query } = client(
  cacheTime(300000) // Set global cache time to 5 minutes
)
// ...
const [$post] = query(PostKey, [$postId], PostsService.fetch, [
  cacheTime(60000) // Override cache time to 1 minute for this query
])
```

#### `dedupeTime`

The `dedupeTime` setting allows you to set a time window (in milliseconds) for deduplicating identical requests. If multiple requests for the same data are made within this time window, only one request will be sent, and the result will be shared among all callers.

Default is `4000` (4 seconds).

```ts
import { client, dedupeTime } from '@nano_kit/query'

const { query } = client(
  dedupeTime(8000) // Set global dedupe time to 8 seconds
)
// ...
const [$post] = query(PostKey, [$postId], PostsService.fetch, [
  dedupeTime(10000) // Override dedupe time to 10 seconds for this query
])
```

#### `dedupe`

The `dedupe` setting allows you to enable or disable request deduplication. There are two deduplication ways:

- **By loading state** - if a request for the same key is already in progress, new requests will not be triggered.
- **By time window** - requests made within the dedupe time window will not be triggered again. Available ony for non-mutation queries.

Enabled by default.

```ts
import { client, dedupe } from '@nano_kit/query'

const { query } = client(
  dedupe(true, false) // Disable time-based deduplication globally
)
// ...
const [updatePost] = mutation<[params: UpdatePostParams], Post>(PostsService.update, [
  dedupe(false) // Disable loading state deduplication for this mutation
])
```

#### `disabled`

The `disabled` setting allows you to disable requests based on a signal. When the signal is `true`, requests will not be made.

```ts
import { signal } from '@nano_kit/store'
import { client, disabled } from '@nano_kit/query'

const { query } = client()
// ...
const [$post] = query(PostKey, [$postId], PostsService.fetch, [
  disabled(computed($postId)) // Disable request when $postId is falsy
])
```

#### `mapError`

Error signals provided by queries and mutations contains error strings, because cache storage works with serializable data. You can use `mapError` setting to override default error mapping behavior:

```ts
import { client, mapError } from '@nano_kit/query'

const { query } = client(
  mapError(err => `Failed to fetch data: ${(err as Error).message}`) // Override default error mapping globally
)
```

#### `onEveryError`

You can use `onEveryError` setting to provide a global error callback that will be called on every query/mutation error.

Callback accepts `error` object and `stopped` boolean that indicates whether error propagation was stopped by `stopErrorPropagation` in request context.

```ts
import { client, onEveryError } from '@nano_kit/query'

const { query } = client(
  onEveryError((error, stopped) => {
    if (!stopped) {
      showErrorToast(error)
    }
  })
)
// ...
const [$post] = query(PostKey, [$postId], (postId, ctx) => {
  onError(ctx, (error) => {
    if (shouldIgnoreError(error)) {
      // Will not show error toast
      stopErrorPropagation(ctx)
    }
  })

  return PostsService.fetch(postId)
})
```

### Request Context

Query and mutation fetcher functions receive request context as last parameter. It provides methods to manage request lifecycle:

- `onSuccess(ctx, fn)` - register success callback
- `onError(ctx, fn)` - register error callback
- `onSettled(ctx, fn)` - register settled callback
- `stopErrorPropagation(ctx)` - stop error propagation to global `onEveryError` handler

```ts
import { client, mutations, onSuccess, onError, onSettled, stopErrorPropagation } from '@nano_kit/query'

const { mutation } = client(mutations())
// ...
const [updatePost] = mutation<[params: UpdatePostParams], Post>(
  (params, ctx) => {
    onSuccess(ctx, (data) => {
      // Data updated successfully
    })
    onError(ctx, (error) => {
      // Handle error
    })
    onSettled(ctx, (data, error) => {
      // Always executed
    })
    // Mark error as stopped to prevent global error handling
    // Can be invoked in onError callback as well
    stopErrorPropagation(ctx)

    return PostsService.update(postId, params)
  }
)
```

Also query's context can be used as a cache key for advanced scenarios:

```ts
import { client, queryKey } from '@nano_kit/query'

const TagsKey = queryKey<[postId: number], Tag[] | null>('tags')
const $postId = signal(1)
const {
  query,
  $data
} = client()
const [$tags, $tagsError, $tags] = query(TagsKey, [$postId], async (postId, ctx) => {
  // Use ctx as current query key to accumulate data in the cache
  const prevTags = $data(ctx) || []
  const newTags = await PostsService.fetchTags(postId)

  return [...new Set(prevTags.concat(newTags))]
})
```

## Extra Queries

### Operation

If you need lazy query or "heavy" mutation that saves its state in the cache, you can use `operation` to create an on-demand query:

```ts
import { client, operations, operationKey } from '@nano_kit/query'

const PostGenerationKey = operationKey<[], [prompt: string], Post>('postGeneration')
const { operation } = client(
  operations()
)
// "Heavy" mutation with saving state in the cache, you can "hide it in background" and then back to it without loosing state, unlike with regular mutation
const [generatePost, /* ... */] = operation(PostGenerationKey, [], (prompt) => (
  PostsService.generateWithAi(prompt)
))
```

### Infinite

If you need to load paginated data, you can use `infinite` to create an infinite query:

```ts
import { type InfinitePages, client, infinites, queryKey } from '@nano_kit/query'

const PostsKey = queryKey<[], InfinitePages<PostsPage, number>>('posts')
const { infinite } = client(
  infinites()
)
// First page is loaded initially, to load next page you should call `fetchNext`
const [fetchNext, $posts, $postsError, $postsLoading] = infinite(PostsKey, [], page => page.nextCursor, (cursor) => (
  PostsService.fetchPosts(cursor)
))

effect(() => {
  const posts = $posts()

  console.log({
    'Posts: ': posts.pages.flatMap(page => page.posts),
    'Has more: ': posts.more
  })
})

loadNextButton.onclick = fetchNext
```

## Extensions

### `retryOnError`

The `retryOnError` extension enables automatic retries for failed requests. By default, it uses an exponential backoff strategy for delays between retries.

```ts
import { client, retryOnError } from '@nano_kit/query'

const { query } = client()
// ...
const [$post, $postError, $postLoading] = query(PostKey, [$postId], (postId) => (
  PostsService.fetch(postId)
), [
  // Retry on error with exponential backoff
  retryOnError()
])
```

### `abortable`

The `abortable` extension makes requests cancellable using the AbortController API. It provides an `AbortSignal` in the request context that you can use in your fetchers. You can also abort previous requests or manually abort a request.

```ts
import { client, operations, abortable, abortSignal, abort, abortPrevious } from '@nano_kit/query'

const { operation } = client(
  operations(),
  abortable()
)
// ...
const [fetchPost, $post, $postError, $postLoading] = operation(PostKey, [$postId], (postId, ctx) => {
  // Abort previous running request
  abortPrevious(ctx)

  // Provide AbortSignal to data fetcher
  return PostsService.fetch(postId, abortSignal(ctx))
})
const promise = fetchPost()

// Also you can abort running promise
abort(promise)
```

### `revalidateOnFocus`

To automatically refresh data when the browser window gains focus, you can use the `revalidateOnFocus` extension:

```ts
import { client, revalidateOnFocus } from '@nano_kit/query'

const { query } = client(
  revalidateOnFocus() // Enable revalidation on window focus globally
)
// ...
const [$post] = query(PostKey, [$postId], PostsService.fetch, [
  revalidateOnFocus() // Or enable revalidation on window focus for cpecific query only
])
```

### `revalidateOnReconnect`

To automatically refresh data when the network connection is restored, you can use the `revalidateOnReconnect` extension:

```ts
import { client, revalidateOnReconnect } from '@nano_kit/query'

const { query } = client(
  revalidateOnReconnect() // Enable revalidation on network reconnect globally
)
// ...
const [$post] = query(PostKey, [$postId], PostsService.fetch, [
  revalidateOnReconnect() // Or enable revalidation on network reconnect for cpecific query only
])
```

### `revalidateOnInterval`

To automatically refresh data at regular intervals, you can use the `revalidateOnInterval` extension:

```ts
import { client, revalidateOnInterval } from '@nano_kit/query'

const { query } = client(
  revalidateOnInterval(60000) // Enable revalidation every 60 seconds globally
)
// ...
const [$post] = query(PostKey, [$postId], PostsService.fetch, [
  revalidateOnInterval(30000) // Or enable revalidation every 30 seconds for cpecific query only
])
```

### `indexedDbStorage`

The `indexedDbStorage` extension enables caching of query data in IndexedDB for offline support and persistence across sessions. You can specify the duration (in milliseconds) for which the data should be stored in IndexedDB.

```ts
import { client, indexedDbStorage } from '@nano_kit/query'

const { query } = client(
  // Cache data in IndexedDB for 24 hours
  indexedDbStorage(24 * 60 * 60 * 1000)
)
// ...
```

### `entities`

The `entities` extension allows you to map query or mutation results to entity references for better cache management and data consistency. Thus you can update entity data in one place and have it reflected across all queries that reference that entity.

```ts
import { client, mutations, entity, entities, onError } from '@nano_kit/query'

const PostEntity = entity<Post>('post')
// ...
const { query, mutation, $data } = client(
  mutations()
)
// ...
const [$post] = query(PostKey, [$postId], (postId) => (
  PostsService.fetch(postId)
), [
  // Map entity to entity reference
  // Also every refetch will update entity in the cache
  entities(PostEntity)
])
const [$posts] = query(PostsKey, [], () => (
  PostsService.fetchPosts()
), [
  // Map entities in the page to entity references
  // Also every refetch will update entities in the cache
  entities(page => ({
    ...page,
    posts: page.posts.map(PostEntity)
  }))
])
const [updatePost, /* ... */] = mutation<[params: UpdatePostParams], Post>(
  (params, ctx) => (
    PostsService.update(postId, params)
  ),
  [
    // Map entity to entity reference in mutation result
    // Also will update entity in the cache on success
    entities(PostEntity)
  ]
)
// Or update data optimistically
const [updatePost, /* ... */] = mutation<[params: UpdatePostParams], Post>(
  (params, ctx) => {
    const postId = $postId()
    // Get entity key by id
    const postEntityKey = PostEntity(postId)
    // Get current entity data
    const post = $data(postEntityKey)

    if (post) {
      // Optimistically update entity data, will update all references
      $data(postEntityKey, {
        ...post,
        ...params
      })

      // Revert changes on error
      onError(ctx, () => {
        $data(postEntityKey, post)
      })
    }

    return PostsService.update(postId, params)
  }
)

effect(() => {
  console.log(`Post(${$postId()}):`, $post())
})
// Post(1): { id: 1, title: 'Post Title', ... }

// *-- Update post on the server --*

effect(() => {
  console.log('Posts:', $posts().posts)
})
// Posts: [ { id: 1, title: 'Updated Title', ... }, { id: 2, ... }, ... ]
// Post(1): { id: 1, title: 'Updated Title', ... }

updatePost({
  title: 'Another Title'
})
// Posts: [ { id: 1, title: 'Another Title', ... }, { id: 2, ... }, ... ]
// Post(1): { id: 1, title: 'Another Title', ... }
```

### `tasks`

To await all client tasks completion, you can use the `tasks` extension that adds task tracking to the client:

```ts
import { type TasksPool, tasksRunner, waitTasks } from '@nano_kit/store'
import { client, tasks } from '@nano_kit/query'

const tasksPool = new Set()
const runTask = tasksRunner(tasksPool)
const { query } = client(
  tasks(runTask)
)
// ...
// Await all tasks completion
await waitTasks(tasksPool)
```
