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
