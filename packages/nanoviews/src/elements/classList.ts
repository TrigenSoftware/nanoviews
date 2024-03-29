import type {
  ValueOrStore,
  EmptyValue,
  StrictEffect,
  Destroy
} from '../internals/index.js'
import {
  isString,
  isReadonlyArray,
  isStore,
  composeEffects,
  noop,
  createEffectAttribute
} from '../internals/index.js'

export type ClassList = ValueOrStore<string | EmptyValue | readonly ClassList[]>

function isClassName(cls: string) {
  return isString(cls) && cls.includes(' ')
}

function addClass(classList: DOMTokenList, cls: string | EmptyValue) {
  if (isString(cls) && cls) {
    if (isClassName(cls)) {
      const classes = cls.split(' ')

      classes.forEach(cls => classList.add(cls))

      return () => classes.forEach(cls => classList.remove(cls))
    }

    classList.add(cls)

    return () => classList.remove(cls)
  }

  return noop
}

function composeClassListEffects(domClassList: DOMTokenList, classList: readonly ClassList[]) {
  return composeEffects(classList.map(cls => createClassListEffect(domClassList, cls)))
}

function createClassListEffect(
  domClassList: DOMTokenList,
  $classList: ClassList
): StrictEffect<void> {
  let destroy: Destroy | EmptyValue

  if (isStore($classList)) {
    const classList = $classList.get()
    const subscribe = () => {
      let unsubscribe: Destroy | null = $classList.listen((classList) => {
        destroy?.()
        destroy = createClassListEffect(domClassList, classList)()
      })

      return () => {
        unsubscribe!()
        destroy!()
        destroy = null
        unsubscribe = null
      }
    }

    if (isReadonlyArray(classList)) {
      let effect: StrictEffect<void> | null = composeClassListEffects(domClassList, classList)

      return () => {
        destroy = effect!()
        effect = null

        return subscribe()
      }
    }

    destroy = addClass(domClassList, classList)

    return subscribe
  }

  if (isReadonlyArray($classList)) {
    return composeClassListEffects(domClassList, $classList)
  }

  destroy = addClass(domClassList, $classList)

  return () => () => {
    destroy!()
    destroy = null
  }
}

/**
 * Effect attribute to control class list of element
 */
export const classList$ = createEffectAttribute<'classList', Element, ClassList>(
  (element, $classList) => createClassListEffect(element.classList, $classList)
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    [classList$]: ClassList
  }

  interface EffectAttributeTargets {
    [classList$]: Element
  }
}

