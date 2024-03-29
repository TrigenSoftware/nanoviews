import { atom } from 'nanostores'

export function render(args, context) {
  const { id, component } = context

  if (!component) {
    throw new Error(`Unable to render story ${id} as the component annotation is missing from the default export`)
  }

  return [component, args]
}

function isAtom(value) {
  return value
    && typeof value.listen === 'function'
    && typeof value.get === 'function'
    && typeof value.set === 'function'
}

function propsToAtoms(props) {
  const entries = Object.entries(props).map(
    ([key, value]) => [
      key,
      typeof value === 'function' || isAtom(value)
        ? value
        : atom(value)
    ]
  )

  return Object.fromEntries(entries)
}

const atomsByDomElement = new Map()

function updateAtoms(canvasElement, props) {
  const reactiveProps = atomsByDomElement.get(canvasElement)

  if (reactiveProps) {
    Object.entries(props).forEach(([key, value]) => {
      const atom = reactiveProps[key]

      if (atom && typeof atom !== 'function' && !isAtom(value)) {
        atom.set(value)
      }
    })

    return reactiveProps
  }

  const newReactiveProps = propsToAtoms(props)

  atomsByDomElement.set(canvasElement, newReactiveProps)
  return newReactiveProps
}

const blocksByDomElement = new Map()

export function renderToCanvas({ storyFn, showMain, forceRemount }, canvasElement) {
  const [component, props] = storyFn()
  const reactiveProps = updateAtoms(canvasElement, props)
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
    atomsByDomElement.delete(canvasElement)
  }
}
