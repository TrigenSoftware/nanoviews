import { createRoot } from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { App } from './App.jsx'
import './app.css'

const queryClient = new QueryClient()
const root = createRoot(document.getElementById('app')!)

root.render(
  <QueryClientProvider client={queryClient}>
    <App/>
  </QueryClientProvider>
)
