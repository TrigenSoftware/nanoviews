import type { Navigation } from './navigation.js'

/**
 * Handle link click events to navigate using the router.
 * @param this - Router navigation object
 * @param event - MouseEvent from the click
 */
export function onLinkClick(
  this: Navigation,
  event: Pick<MouseEvent, 'target' | 'button' | 'defaultPrevented' | 'altKey' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'preventDefault'>
) {
  const link = (event.target as HTMLElement).closest('a')

  if (
    link
    && event.button === 0 // Left mouse button
    && link.target !== '_blank' // Not for new tab
    && link.origin === location.origin // Not external link
    && link.rel !== 'external' // Not external link
    && link.target !== '_self' // Now manually disabled
    && !link.download // Not download link
    && !event.altKey // Not download link by user
    && !event.metaKey // Not open in new tab by user
    && !event.ctrlKey // Not open in new tab by user
    && !event.shiftKey // Not open in new window by user
    && !event.defaultPrevented // Click was not cancelled
  ) {
    event.preventDefault()
    this.push(link.href)
  }
}

/**
 * Effect to listen for link clicks and navigate using the router.
 * @param navigation - Router navigation object
 * @returns Cleanup function to remove the event listener
 */
export function listenLinks(navigation: Navigation) {
  const onClick = onLinkClick.bind(navigation)

  document.body.addEventListener('click', onClick)

  return () => {
    document.body.removeEventListener('click', onClick)
  }
}

/**
 * Reset scroll position to the top of the page.
 */
export function resetScroll() {
  window.scrollTo(0, 0)
}

/**
 * Scroll to an anchor on the page.
 * @param hash - The anchor hash (e.g., #section1)
 * @param options - `scrollIntoView` options
 */
export function scrollToAnchor(hash: string, options?: ScrollIntoViewOptions) {
  if (hash) {
    const id = hash.slice(1)
    const anchor = document.getElementById(id) || document.getElementsByName(id)[0]

    if (anchor) {
      anchor.scrollIntoView(options)
    }
  }
}

/**
 * Utility class to save and restore scroll positions using session storage.
 */
export class ScrollRestorator {
  readonly #storageKeyPrefix: string

  /**
   * Create a ScrollRestorator instance.
   * @param storageKeyPrefix - Prefix for session storage keys
   */
  constructor(storageKeyPrefix = 'krsp-') {
    this.#storageKeyPrefix = storageKeyPrefix
  }

  /**
   * Save the current scroll position for the given location.
   * @param location - The location object
   */
  save(location: Location) {
    sessionStorage.setItem(this.#storageKeyPrefix + location.href, String(window.scrollY))
  }

  /**
   * Restore the scroll position for the given location.
   * @param location - The location object
   * @returns True if a saved position was restored, false otherwise
   */
  restore(location: Location) {
    const key = this.#storageKeyPrefix + location.href
    const value = parseInt(sessionStorage.getItem(key)!)

    if (!isNaN(value)) {
      window.scrollTo(0, value)
      this.clear(location)

      return true
    }

    return false
  }

  /**
   * Clear the saved scroll position for the given location.
   * @param location - The location object
   */
  clear(location: Location) {
    sessionStorage.removeItem(this.#storageKeyPrefix + location.href)
  }
}
