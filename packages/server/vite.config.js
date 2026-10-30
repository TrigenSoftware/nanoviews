import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      formats: ['es'],
      entry: {
        index: './src/index.ts',
        store: './src/store.ts',
        svg: './src/svg/index.ts'
      }
    },
    rolldownOptions: {
      // The parts nanoviews shares with the server are bundled in: a server
      // bundle that swaps nanoviews for this package has no nanoviews to load
      external: ['kida'],
      output: {
        topLevelVar: false
      }
    },
    sourcemap: true,
    minify: false,
    emptyOutDir: false
  },
  test: {
    environment: 'node',
    exclude: [...configDefaults.exclude, './package', './dist'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*.ts']
    }
  }
})
