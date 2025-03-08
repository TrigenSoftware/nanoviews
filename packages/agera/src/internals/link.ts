import type {
  Dependency,
  Link,
  Subscriber,
  Signal
} from './types.js'
import {
  $$subs,
  $$subsTail,
  $$deps,
  $$depsTail,
  $$dep,
  $$sub,
  $$nextDep,
  $$prevSub,
  $$nextSub,
  $$onActivate
} from './symbols.js'
import { queueActivateListener } from './lifecycle.js'

/**
 * Creates and attaches a new link between the given dependency and subscriber.
 *
 * Reuses a link object from the linkPool if available. The newly formed link
 * is added to both the dependency's linked list and the subscriber's linked list.
 * @param dep - The dependency to link.
 * @param sub - The subscriber to be attached to this dependency.
 * @param nextDep - The next link in the subscriber's chain.
 * @param depsTail - The current tail link in the subscriber's chain.
 * @returns The newly created link object.
 */
export function linkNewDep(dep: Dependency, sub: Subscriber, nextDep: Link | undefined, depsTail: Link | undefined): Link {
  const newLink: Link = {
    [$$dep]: dep,
    [$$sub]: sub,
    [$$nextDep]: nextDep,
    [$$prevSub]: undefined,
    [$$nextSub]: undefined
  }

  if (depsTail === undefined) {
    sub[$$deps] = newLink
  } else {
    depsTail[$$nextDep] = newLink
  }

  if (dep[$$subs] === undefined) {
    dep[$$subs] = newLink

    if ($$onActivate in dep) {
      queueActivateListener((dep as Signal)[$$onActivate]!)
    }
  } else {
    const oldTail = dep[$$subsTail]!

    newLink[$$prevSub] = oldTail
    oldTail[$$nextSub] = newLink
  }

  sub[$$depsTail] = newLink
  dep[$$subsTail] = newLink

  return newLink
}

/**
 * Verifies whether the given link is valid for the specified subscriber.
 *
 * It iterates through the subscriber's link list (from sub[$$deps] to sub[$$depsTail])
 * to determine if the provided link object is part of that chain.
 * @param checkLink - The link object to validate.
 * @param sub - The subscriber whose link list is being checked.
 * @returns `true` if the link is found in the subscriber's list; otherwise `false`.
 */
export function isValidLink(checkLink: Link, sub: Subscriber): boolean {
  const depsTail = sub[$$depsTail]

  if (depsTail !== undefined) {
    let link = sub[$$deps]!

    do {
      if (link === checkLink) {
        return true
      }

      if (link === depsTail) {
        break
      }

      link = link[$$nextDep]!
    } while (link !== undefined)
  }

  return false
}

/**
 * Links a given dependency and subscriber if they are not already linked.
 * @param dep - The dependency to be linked.
 * @param sub - The subscriber that depends on this dependency.
 * @returns The newly created link object if the two are not already linked; otherwise `undefined`.
 */
export function link(dep: Dependency, sub: Subscriber): Link | undefined {
  const currentDep = sub[$$depsTail]

  if (currentDep !== undefined && currentDep[$$dep] === dep) {
    return
  }

  const nextDep = currentDep !== undefined
    ? currentDep[$$nextDep]
    : sub[$$deps]

  if (nextDep !== undefined && nextDep[$$dep] === dep) {
    sub[$$depsTail] = nextDep
    return
  }

  const depLastSub = dep[$$subsTail]

  if (
    depLastSub !== undefined
    && depLastSub[$$sub] === sub
    && isValidLink(depLastSub, sub)
  ) {
    return
  }

  return linkNewDep(dep, sub, nextDep, currentDep)
}
