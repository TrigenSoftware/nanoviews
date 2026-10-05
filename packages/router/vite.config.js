import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      formats: ['es'],
      entry: {
        index: './src/index.ts'
      }
    },
    rolldownOptions: {
      external: id => /^(nanoviews|@nano_kit\/router)(\/|$)/.test(id),
      output: {
        topLevelVar: false
      }
    },
    sourcemap: true,
    minify: false,
    emptyOutDir: false
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['@nanoviews/testing-library/vitest'],
    exclude: [...configDefaults.exclude, './package', './dist'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*.ts']
    }
  }
})
