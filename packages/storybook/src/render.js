import {
  isFunction,
  isSignal,
  signal
} from 'nanoviews/store'
import { defaultDecorateStory } from 'storybook/preview-api'
import { mount } from 'nanoviews'

const signalsByDomElement = new WeakMap()
const unmountsByDomElement = new WeakMap()
const globalsByDomElement = new WeakMap()

// Storybook rebuilds the globals object on every render but keeps the identity of each value that did
// not change, so a shallow compare is what tells an args update apart from a globals update.
function sameGlobals(a, b) {
  if (!b) {
    return false
  }

  const keys = Object.keys(a)

  return keys.length === Object.keys(b).length
    && keys.every(key => Object.is(a[key], b[key]))
}

function toSignals(props, canvasElement) {
  const signals = canvasElement && signalsByDomElement.get(canvasElement)

  if (signals) {
    Object.entries(props).forEach(([key, value]) => {
      const target = signals[key]

      if (isSignal(target) && !isSignal(value)) {
        target(value)
      }
    })

    return signals
  }

  const newSignals = Object.fromEntries(
    Object.entries(props).map(
      ([key, value]) => [
        key,
        isFunction(value) || isSignal(value)
          ? value
          : signal(value)
      ]
    )
  )

  if (canvasElement) {
    signalsByDomElement.set(canvasElement, newSignals)
  }

  return newSignals
}

export function applyDecorators(storyFn, decorators) {
  const decorated = defaultDecorateStory(storyFn, decorators)

  return context => [
    props => decorated({
      ...context,
      args: props
    }),
    toSignals(context.args, context.canvasElement)
  ]
}

export function render(props, context) {
  const { id, component } = context

  if (!component) {
    throw new Error(`Unable to render story ${id} as the component annotation is missing from the default export`)
  }

  return component(props)
}

export function renderToCanvas({ storyFn, showMain, forceRemount, storyContext }, canvasElement) {
  // A story is mounted once and updated through its signals, so a decorator only ever runs at mount.
  // Globals-driven decorators — the backgrounds, outline and measure toolbars among them — would never
  // see a toolbar change, so a globals change has to remount.
  const { globals } = storyContext
  let unmount = unmountsByDomElement.get(canvasElement)

  if (unmount && (forceRemount || !sameGlobals(globals, globalsByDomElement.get(canvasElement)))) {
    unmount()
    unmount = undefined
    unmountsByDomElement.delete(canvasElement)
    signalsByDomElement.delete(canvasElement)
  }

  globalsByDomElement.set(canvasElement, globals)

  const [view, props] = storyFn()

  if (!unmount) {
    try {
      unmount = mount(() => view(props), canvasElement)
    } catch (error) {
      signalsByDomElement.delete(canvasElement)
      throw error
    }

    unmountsByDomElement.set(canvasElement, unmount)
  }

  showMain()

  return () => {
    unmount?.()
    unmountsByDomElement.delete(canvasElement)
    signalsByDomElement.delete(canvasElement)
    globalsByDomElement.delete(canvasElement)
  }
}
