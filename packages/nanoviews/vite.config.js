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
        internals: './src/internals/index.ts'
      },
      fileName(_, entryName) {
        return `${entryName}.${process.env.NODE_ENV}.js`
      }
    },
    rollupOptions: {
      external: ['kida']
    },
    sourcemap: true,
    minify: false,
    emptyOutDir: false
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    exclude: [...configDefaults.exclude, './package'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*', '!**/*.stories.ts']
    }
  }
})
