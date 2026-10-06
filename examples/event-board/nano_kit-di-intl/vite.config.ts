import {
  type Connect,
  defineConfig
} from 'vite'
import { getRequestListener } from '@hono/node-server'
import { api } from './api/index.js'

function apiMiddleware(): Connect.NextHandleFunction {
  const listener = getRequestListener(api().fetch)

  return (req, res, next) => {
    if (!req.url?.startsWith('/api')) {
      next()

      return
    }

    listener(req, res).catch(next)
  }
}

export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    {
      name: 'event-board-api',
      configureServer(server) {
        server.middlewares.use(apiMiddleware())
      },
      configurePreviewServer(server) {
        server.middlewares.use(apiMiddleware())
      }
    }
  ]
})
