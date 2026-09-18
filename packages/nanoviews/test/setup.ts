import { cleanup } from '@nanoviews/testing-library'
import { afterEach } from 'vitest'
import '@nanoviews/testing-library/vitest'

// happy-dom 20.8.9 has no `defaultSelected` on an option, while its form
// reset does look for the `selected` attribute the property reflects
Object.defineProperty(HTMLOptionElement.prototype, 'defaultSelected', {
  get(this: HTMLOptionElement) {
    return this.hasAttribute('selected')
  },
  set(this: HTMLOptionElement, selected: boolean) {
    this.toggleAttribute('selected', selected)
  }
})

afterEach(cleanup)
