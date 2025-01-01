import type {
  Effect,
  Destroy
} from './types/index.js'

let globalEffects: Effect[] | undefined

/**
 * Capture effects from a function
 * @param effects - Target effects array
 * @param fn - Function to capture effects from
 * @returns Function result
 */
export function captureEffects<R>(effects: Effect[], fn: () => R): R {
  const prevEffects = globalEffects

  globalEffects = effects

  try {
    return fn()
  } finally {
    globalEffects = prevEffects
  }
}

/**
 * Add mounted effect.
 * Effect will be run on block mount and can return destroy function to run on unmount.
 * @param effect - Effect function to add
 */
export function addEffect(effect: Effect) {
  globalEffects!.push(effect)
}

/**
 * Run effects from array and return destroy functions
 * @param effects - Effects array
 * @returns Destroy functions
 */
export function runEffects(effects: Effect[]) {
  const len = effects.length
  const destroys: Destroy[] = []

  if (len) {
    for (let i = 0, destroy; i < len; i++) {
      if (destroy = effects[i]()) {
        destroys.push(destroy)
      }
    }
  }

  return destroys
}

/**
 * Run destroy functions
 * @param destroys - Destroy functions array
 */
export function runDestroys(destroys: Destroy[] | undefined) {
  const len = destroys?.length

  if (len) {
    for (let i = 0; i < len; i++) {
      destroys[i]()
    }
  }
}
