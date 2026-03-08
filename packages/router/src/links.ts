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
