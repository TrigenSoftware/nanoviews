import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      formats: ['es'],
      entry: {
        index: './src/index.ts',
        internals: './src/internals/index.ts'
      },
      fileName(_, entryName) {
        return `${entryName}.${process.env.NODE_ENV}.js`
      }
    },
    sourcemap: true,
    minify: false,
    emptyOutDir: false
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['lcovonly', 'text']
    }
  }
})
