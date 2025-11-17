import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import {
  DEV,
  inlineSymbols
} from '../../scripts/index.js'
import * as ageraSymbols from '../agera/src/internals/symbols.min.ts'
import * as symbols from './src/internals/symbols.ts'
import * as symbolsMin from './src/internals/symbols.min.ts'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      formats: ['es'],
      entry: {
        index: './src/index.ts'
      }
    },
    rollupOptions: {
      external: ['agera']
    },
    sourcemap: true,
    minify: !DEV && 'esbuild',
    emptyOutDir: false
  },
  plugins: [
    // inline symbols values to optimize bundle size
    inlineSymbols(symbols, symbolsMin, ageraSymbols)
  ],
  test: {
    exclude: [...configDefaults.exclude, './package'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*']
    }
  }
})
