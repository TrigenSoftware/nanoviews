# Examples Bundle Sizes 🚀

This document contains bundle size information for various examples in the project, next to the same apps built on other stacks in [nano_kit](https://github.com/TrigenSoftware/nano_kit/tree/main/examples).

A size is the sum of the minified JS chunks that `vite build` emits for the browser, raw and with Gzip at its default level. All rows were built on the same day with the same toolchain.

## vite-demo 🎨

| Stack | Raw Size | Gzipped Size |
|-------|----------|--------------|
| nanoviews | 8.33 kB | 3.26 kB 🪶 |
| Solid | 11.49 kB | 4.59 kB |
| Svelte | 26.52 kB | 10.64 kB 🪨 |

## weather 🌤️

| Stack | Raw Size | Gzipped Size |
|-------|----------|--------------|
| nanoviews + nano_kit | 27.98 kB | 10.36 kB 🪶 |
| nanoviews + nano_kit + DI | 29.31 kB | 10.82 kB |
| Solid + Nano Stores | 36.41 kB | 13.55 kB |
| Svelte + Nano Stores | 56.08 kB | 21.34 kB |
| Svelte + nano_kit | 61.74 kB | 23.12 kB |
| Svelte + nano_kit + DI | 63.13 kB | 23.57 kB |
| React + Nano Stores | 206.71 kB | 65.12 kB |
| React + nano_kit | 211.39 kB | 66.49 kB |
| React + nano_kit + DI | 212.92 kB | 67.06 kB |
| React + Reatom | 228.10 kB | 72.15 kB |
| React + TanStack Query | 232.56 kB | 71.56 kB 🪨 |

## rick-and-morty 🛸

| Stack | Raw Size | Gzipped Size |
|-------|----------|--------------|
| nanoviews + nano_kit query + nano_kit router | 43.54 kB | 17.75 kB 🪶 |
| Svelte + nano_kit query + nano_kit router | 90.45 kB | 36.20 kB |
| React + nano_kit query + nano_kit router | 229.99 kB | 73.70 kB |
| React + TanStack Query + TanStack Router | 330.54 kB | 102.34 kB 🪨 |

## event-board 📅

Every stack uses the DI stores and the intl messages of nano_kit. The Preact, Svelte and React apps render on the server too: their sizes are the client bundles, which also hydrate the page.

| Stack | Raw Size | Gzipped Size |
|-------|----------|--------------|
| nanoviews + nano_kit | 61.02 kB | 25.03 kB 🪶 |
| Preact + nano_kit, SSR | 76.82 kB | 30.87 kB |
| Svelte + nano_kit, SSR | 108.52 kB | 44.02 kB |
| React + nano_kit, SSR | 245.54 kB | 82.08 kB 🪨 |

## cvapp 💼

| Stack | Raw Size | Gzipped Size |
|-------|----------|--------------|
| nanoviews + nano_kit | 37.36 kB | 14.41 kB 🪶 |
| React + nano_kit | 221.66 kB | 70.24 kB 🪨 |
