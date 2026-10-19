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
  docs:
    paths:
      - storybook
---

# Nanoviews Storybook

`@nanoviews/storybook` is the Storybook renderer for nanoviews, and `@nanoviews/storybook-vite` is the framework that runs it on the Vite builder and re-exports its whole API. Stories are plain CSF3; a story's `render`, like the `component` of its meta, gets the args as writable signals and returns a view. How views are written is the nanoviews skill.

## Reference

`DOCS.md` next to this file is the documentation of the released packages as published on https://nanoviews.js.org, generated from the site sources. Read its relevant sections for the setup, the `Meta` forms, decorators, loaders, portable stories and the exact types before writing code. This skill adds only conventions, choices and pitfalls.

## Mental model

- An arg has three shapes: a plain value in `args`, the Controls panel and loaders; a writable signal in `render`, the component and decorators; either one in a call of a composed story. Function args and args that already are signals pass through untouched.
- A story mounts once. A control edit writes into the same signals and updates only the bindings that read them: no re-render, no new decorator call, component state kept. A change of globals (backgrounds, viewport, a toolbar of your own `globalTypes`) and the Reload story button remount it, with fresh signals and fresh state.

## Conventions

- `name.stories.ts` sits next to the module it shows: `const meta: Meta<...> = { title: 'Group/Name', ... }`, `export default meta`, `type Story = StoryObj<typeof meta>`, then one PascalCase CSF3 object per story. The spec of the module can render its composed stories instead of building the same views again.
- Every named export of a stories module is a story: shared decorators, loaders and fixtures live in modules of their own, such as `.storybook/decorators.ts`.
- Story code is view code: `render` and decorators take the block layout and the naming of the nanoviews skill (attributes one per line, `})(` or `()(` ends the line, children indented, `)` on its own line). Args keep the names of the props, so `render({ label })` destructures signals under plain names; a signal made in `render` takes the `$` (`$total`).
- Every handler arg gets `fn()` from `storybook/test` in `args`, usually the meta's: the Actions panel logs its calls, and a test passes its own spy instead.
- Install `@nanoviews/storybook-vite` alone, not the renderer: it depends on `@nanoviews/storybook` and re-exports its API, so the story API and the config types are imported from it.
- A library package keeps `**/*.stories.ts` out of its declaration build and its coverage, as the nanoviews package does.

## Which form for which job

- `Meta<typeof Component>` with `component`: the stories of one component whose props are `Signalish`, `WritableSignal` or functions. A story that only picks args is `{}` or `{ args }`, with no `render`.
- `Meta<Args>`, the plain args type: a story of several components or of a view with no component, and a `component$` whose props are all optional (the component form types their args `any`). It can still name the `component` that renders its stories.
- `render` in the meta: the render of every story of the module; the stories then only set `args`.
- A context for `inject`: a decorator wraps `story()` in `context$(provide(...))`, in the preview for every story, with the toolbar value read from `context.globals`; `render`, the components of the story and an inner decorator can all `inject` what it provides.
- A test of a story: `composeStories(Stories, preview)` and `render(Story({ arg: $signal }))` from `@nanoviews/testing-library`, with a signal for every arg the test drives.

## Pitfalls

- `setProjectAnnotations(preview)` in a test setup file gives the preview to every composed story; a preview passed to a call, `composeStories(Stories, preview)` or `composeStory(Story, meta, preview)`, composes on top of it.
- There is no docgen, so Storybook knows only the args a story gives a value or declares in `argTypes`. An arg left out has no control, and `actions: { argTypesRegex: '^on[A-Z].*' }` makes no action for an undeclared `onX`, which is what `fn()` is for. Give an optional prop that needs a control a value in `args`.
- The signals are made for the args a story has at mount: an arg set later, from the control of a declared argType, reaches the view only at the next remount. `loaded` is fixed at mount too: a loader that reads an edited arg shows its new result after a remount.
- A value read from an arg in the body of `render`, like `price() * quantity()`, is read once and goes stale on the next edit: derive it with `computed`, an operator or an arrow, or hand the signal itself to an attribute, a child or a block.
- A component prop typed as a plain value (`id: string`) makes `component` a type error, because the renderer hands it a signal: type it `Signalish<string>`.
- Decorators get the args as signals, but `Meta` and `StoryObj` type them as plain values: hand `context.args.label` to a binding, never read it as a string. Type a shared decorator with the plain args, `Decorator<{ label: string }>`, for a meta or a story; the preview takes the untyped `Decorator`. `Decorator<{ label: WritableSignal<string> }>` fits no `decorators`.
- A composed story runs no loaders by itself: `await Story.load()` before `render`.

## Related skills

- nanoviews: views, components, signals, dependency injection, the layout and naming rules.
- nanoviews-testing: the Vitest setup, `render`, queries and events of the tests that render composed stories.
- nanoviews-router: a routed view of the dependency injection shape gets the router tokens from a decorator that provides `virtualNavigation(path, routes)` as `LocationNavigation$`, the way its tests do; the links of the module-scope shape ignore it and move the location of the preview iframe.
