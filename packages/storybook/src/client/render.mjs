import {
  isStore,
  atom
} from '@nanoviews/stores'

export function render(args, context) {
  const { id, component } = context

  if (!component) {
    throw new Error(`Unable to render story ${id} as the component annotation is missing from the default export`)
  }

  return [component, args]
}

function propsToStores(props, argTypes) {
  const entries = Object.entries(props).map(
    ([key, value]) => [
      key,
      typeof value === 'function' || isStore(value)
        ? value
        : argTypes[key]?.$store?.(value) || atom(value)
    ]
  )

  return Object.fromEntries(entries)
}

const storesByDomElement = new Map()

function updateProps(canvasElement, props, argTypes) {
  const reactiveProps = storesByDomElement.get(canvasElement)

  if (reactiveProps) {
    Object.entries(props).forEach(([key, value]) => {
      const store = reactiveProps[key]

      if (store && typeof store !== 'function' && !isStore(value)) {
        store.set(value)
      }
    })

    return reactiveProps
  }

  const newReactiveProps = propsToStores(props, argTypes)

  storesByDomElement.set(canvasElement, newReactiveProps)

  return newReactiveProps
}

const blocksByDomElement = new Map()

export function renderToCanvas({ storyFn, showMain, forceRemount, storyContext: { argTypes } }, canvasElement) {
  const [component, props] = storyFn()
  const reactiveProps = updateProps(canvasElement, props, argTypes)
  let block = blocksByDomElement.get(canvasElement)

  if (forceRemount && block) {
    block.d()
    block = undefined
  }

  if (!block) {
    block = component(reactiveProps)
    blocksByDomElement.set(canvasElement, block)
    block.c()
    block.m(canvasElement)
    block.e()
  }

  showMain()

  return () => {
    block?.d()
    blocksByDomElement.delete(canvasElement)
    storesByDomElement.delete(canvasElement)
  }
}
