import type {
  Store,
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
  isFunction,
  createEffectAttribute
} from '../internals/index.js'

export type ClassListPrimitive = string | boolean | EmptyValue

export type ClassListEffect = (set: (classList: ClassList) => StrictEffect<void>) => StrictEffect<void>

export type ClassList = ValueOrStore<ClassListPrimitive | ClassListEffect | readonly ClassList[]>

export type ClassListStore = Store<ClassListPrimitive | ClassListEffect | readonly ClassList[]>

function isClassName(cls: string) {
  return isString(cls) && cls.includes(' ')
}

function addClass(classList: DOMTokenList, cls: ClassListPrimitive) {
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

function createDynamicEffect<T>(
  $store: Store<T>,
  createEffect: (value: T) => StrictEffect<void>
) {
  let effect: StrictEffect<void> | EmptyValue = createEffect($store.get())
  let destroy: Destroy | EmptyValue

  return () => {
    destroy = effect!()
    effect = null

    let unsubscribe: Destroy | null = $store.listen((value) => {
      destroy?.()
      destroy = createEffect(value)()
    })

    return () => {
      unsubscribe!()
      destroy!()
      destroy = null
      unsubscribe = null
    }
  }
}

function createClassListEffect(
  domClassList: DOMTokenList,
  $classList: ClassList
): StrictEffect<void> {
  let destroy: Destroy | EmptyValue

  if (isStore($classList)) {
    return createDynamicEffect($classList, classList => createClassListEffect(domClassList, classList))
  }

  if (isFunction($classList)) {
    return $classList(classList => createClassListEffect(domClassList, classList))
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

export function classIf$(
  classList: ClassList,
  $condition: ValueOrStore<boolean | EmptyValue>
): ClassList {
  if (isStore($condition)) {
    return set => createDynamicEffect($condition, condition => set(condition && classList))
  }

  return $condition && classList
}

export function classGet$(
  classMap: Record<string, string>,
  $key: ValueOrStore<string | EmptyValue>
): ClassList {
  if (isStore($key)) {
    return set => createDynamicEffect($key, key => set(classMap[key!]))
  }

  return classMap[$key!]
}

/**
 * Effect attribute to control class list of element
 */
export const classList$ = /* @__PURE__ */ createEffectAttribute<'classList', Element, ClassList>(
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

