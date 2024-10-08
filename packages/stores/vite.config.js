import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  build: {
    lib: {
      formats: ['es'],
      entry: {
        index: './src/index.ts',
        internals: './src/internals/index.ts'
      },
      fileName(_, entryName) {
        return `${entryName}.js`
      }
    },
    sourcemap: true,
    minify: false,
    emptyOutDir: false
  },
  test: {
    exclude: [...configDefaults.exclude, './package'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*']
    }
  }
})
