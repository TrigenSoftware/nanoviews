import { PropertySymbol } from 'happy-dom'
import { cleanup } from '@nanoviews/testing-library'
import { afterEach } from 'vitest'
import '@nanoviews/testing-library/vitest'

// happy-dom 20.8.9 mis-selects an option inserted with its `selected`
// property already set: left with two selected options, its
// `updateSelectedness` keeps the option at index `selected.length - 1`
// instead of the last selected one in tree order, the way the spec and the
// browsers do. The last one is settled here before happy-dom takes over
type SelectInternals = Record<symbol, (selectedOption?: HTMLOptionElement | null) => void>
type OptionInternals = Record<symbol, boolean>

const selectPrototype = HTMLSelectElement.prototype as HTMLSelectElement & SelectInternals
const updateSelectedness = selectPrototype[PropertySymbol.updateSelectedness]

selectPrototype[PropertySymbol.updateSelectedness] = function updateSelectednessInTreeOrder(this: HTMLSelectElement, selectedOption) {
  if (!selectedOption && !this.multiple) {
    const options = Array.from(this.options)
    const selected = options.filter(option => option.selected)

    if (selected.length > 1) {
      const last = selected[selected.length - 1]

      options.forEach((option) => {
        (option as HTMLOptionElement & OptionInternals)[PropertySymbol.selectedness] = option === last
      })
    }
  }

  updateSelectedness.call(this, selectedOption)
}

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
