import {
  isSignal,
  signal
} from 'kida'
import { mount } from 'nanoviews'

export function render(args, context) {
  const { id, component } = context

  if (!component) {
    throw new Error(`Unable to render story ${id} as the component annotation is missing from the default export`)
  }

  return [component, args]
}

function propsToStores(props) {
  const entries = Object.entries(props).map(
    ([key, value]) => [
      key,
      typeof value === 'function' || isSignal(value)
        ? value
        : signal(value)
    ]
  )

  return Object.fromEntries(entries)
}

const storesByDomElement = new Map()

function updateProps(canvasElement, props) {
  const reactiveProps = storesByDomElement.get(canvasElement)

  if (reactiveProps) {
    Object.entries(props).forEach(([key, value]) => {
      const store = reactiveProps[key]

      if (isSignal(store) && !isSignal(value)) {
        store(value)
      }
    })

    return reactiveProps
  }

  const newReactiveProps = propsToStores(props)

  storesByDomElement.set(canvasElement, newReactiveProps)

  return newReactiveProps
}

const blocksByDomElement = new Map()

export function renderToCanvas({ storyFn, showMain, forceRemount }, canvasElement) {
  const [component, props] = storyFn()
  const reactiveProps = updateProps(canvasElement, props)
  let [block, unmount] = blocksByDomElement.get(canvasElement) || []

  if (forceRemount && block) {
    unmount()
    block = undefined
  }

  if (!block) {
    unmount = mount(() => {
      block = component(reactiveProps)
      return block
    }, canvasElement)
    blocksByDomElement.set(canvasElement, [block, unmount])
  }

  showMain()

  return () => {
    unmount?.()
    blocksByDomElement.delete(canvasElement)
    storesByDomElement.delete(canvasElement)
  }
}
