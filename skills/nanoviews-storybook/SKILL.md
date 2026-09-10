---
name: nanoviews-storybook
description: "Setting up and writing Storybook stories for nanoviews with @nanoviews/storybook-vite: the framework and preview config, CSF3 Meta/StoryObj typing, args that reach render as writable signals, component-driven stories without render, decorators, and portable stories (composeStories, composeStory, setProjectAnnotations) for tests. Apply when adding or editing *.stories.ts files, .storybook config or story-based tests in a project that uses nanoviews."
license: MIT
compatibility:
  - Claude Code
  - Codex
  - Cursor
  - Gemini CLI
  - GitHub Copilot
  - Windsurf
  - Cline
  - Roo Code
  - Goose
  - Continue
  - OpenCode
  - Amp
  - universal
metadata:
  author: dangreen
  tags:
    - nanoviews
    - storybook
    - stories
---

# Nanoviews Storybook

`@nanoviews/storybook` is the renderer (it teaches Storybook to mount and update a nanoviews tree); `@nanoviews/storybook-vite` is the framework that wires it to the Vite builder and re-exports the renderer. A story's `render` is a nanoviews component like any other: it gets props and returns a view. How views are written is the nanoviews skill.

## Setup

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@nanoviews/storybook-vite'

const config: StorybookConfig = {
  framework: '@nanoviews/storybook-vite',
  stories: ['../src/**/*.stories.ts']
}

export default config
```

```ts
// .storybook/preview.ts
import type { Preview } from '@nanoviews/storybook'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' }   // every onX arg logs as an action; fn() from storybook/test is the explicit alternative
  }
}

export default preview
```

- Dev dependencies: `@nanoviews/storybook-vite`, `@nanoviews/storybook` (the snippets import its types; the framework re-exports them, so importing from `@nanoviews/storybook-vite` needs only the framework), `storybook`, `vite`. Script: `storybook dev -p 6006 --no-open`.
- Stories are plain CSF3: a default export with the meta and a named export per story. Story files are excluded from the library build and from coverage in the nanoviews repo.

## Writing stories

```ts
import type { Meta, StoryObj } from '@nanoviews/storybook'
import { b, if_ } from 'nanoviews'

const meta: Meta<{ value: boolean; label: string }> = {   // args type: plain values
  title: 'Logic/if_'
}

export default meta

type Story = StoryObj<typeof meta>

export const Static: Story = {
  render() {
    return if_(true)(() => b()('on'))
  }
}

export const Reactive: Story = {
  args: { value: true, label: 'on' },
  render({ value, label }) {                  // WritableSignal<boolean>, WritableSignal<string>
    return if_(value)(() => b()(label), () => 'off')
  }
}
```

- `Meta<Args>` takes the plain args type; `Meta<typeof Component>` takes the component, whose signal props define the args. In both forms `args` stays plain and `render` receives one writable signal per key.
- A story with `component` in the meta needs no `render` of its own: `export const Default: Story = {}` and `export const Dozen: Story = { args: { count: 12 } }` render the component with those args. A story with neither `render` nor a `component` fails to render.
- A value computed from `value()` at render time goes stale; derive with `computed` or pass the signal through to `if_`, `for_`, attributes and children.
- Args that are already signals, and function args (`fn()` from `storybook/test` for actions), pass through untouched.
- Decorators wrap the rendered view and run once per mount: `export const withWrap: Decorator = story => div({ class: 'wrap' })(story())`; type them `Decorator<{ label: WritableSignal<string> }>` when they read args.

## Args are signals

On the first render of a canvas the renderer wraps every plain arg in `signal()` and mounts the story once. Every later render (a control edited, an arg changed from the URL) writes the new plain values into the same signals: no re-render, the bindings that depend on the arg update. A toolbar (globals) change and `forceRemount` unmount and mount again, which resets component-local signals.

## Portable stories

```ts
import { composeStories, composeStory } from '@nanoviews/storybook'
import * as Stories from './toggle.stories.js'
import meta, { Reactive as ReactiveStory } from './toggle.stories.js'

const { Static, Reactive } = composeStories(Stories)   // every story of the module
const ReactiveAlone = composeStory(ReactiveStory, meta)  // one story
```

- A composed story is a function whose result is the `[component, props]` tuple `@nanoviews/testing-library`'s `render` accepts: `render(Reactive({ value: false }))`. Every arg is optional and may be a plain value or a signal; a signal is the handle the test drives, an omitted arg falls back to the story's own `args` wrapped in a signal.
- `setProjectAnnotations(preview)` from `@nanoviews/storybook`, called once in a test setup file, applies the globals from `.storybook/preview.ts` to every composed story.
- Testing details (setup, `render`, events) are the nanoviews-testing skill.

## Entry points and types

- `@nanoviews/storybook`: `composeStories`, `composeStory`, `setProjectAnnotations` and the types `Meta`, `StoryObj`, `StoryFn`, `Decorator`, `Loader`, `StoryContext`, `Preview`, `NanoviewsRenderer`, plus `Args`, `ArgTypes`, `Parameters`, `StrictArgs` re-exported from `storybook/internal/types`. `@nanoviews/storybook-vite` re-exports all of it and adds `StorybookConfig`.
- `@nanoviews/storybook/preset` is the `previewAnnotations` hook a framework points `core.renderer` at; `@nanoviews/storybook/entry-preview` holds the renderer's preview annotations (`render`, `renderToCanvas`, `applyDecorators`, `argTypesEnhancers`). Neither is imported by an ordinary project.
