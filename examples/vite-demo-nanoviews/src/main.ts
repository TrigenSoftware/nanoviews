import './style.css'
import {
  component$,
  main,
  div,
  a,
  img,
  h1,
  p,
  render
} from 'nanoviews'
import typescriptLogo from '/typescript.svg'
import viteLogo from '/vite.svg'
import { Counter } from './counter.js'

const App = component$(() => main()(
  div()(
    a({
      href: 'https://vitejs.dev',
      target: '_blank'
    })(
      img({
        src: viteLogo,
        class: 'logo',
        alt: 'Vite logo'
      })
    ),
    a({
      href: 'https://www.typescriptlang.org/',
      target: '_blank'
    })(
      img({
        src: typescriptLogo,
        class: 'logo vanilla',
        alt: 'TypeScript logo'
      })
    )
  ),

  h1()('Vite + TypeScript'),

  div({
    class: 'card'
  })(
    Counter()
  ),

  p({
    class: 'read-the-docs'
  })(
    'Click on the Vite and TypeScript logos to learn more'
  )
))

render(App(), document.querySelector<HTMLDivElement>('#app')!)