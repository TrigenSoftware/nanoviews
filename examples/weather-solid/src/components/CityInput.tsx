import { useStore } from '@nanostores/solid'
import { For } from 'solid-js'
import {
  $locationSearch,
  $citySuggestions
} from '../stores/location.js'
import styles from './CityInput.module.css'

export function CityInput() {
  const locationSearch = useStore($locationSearch)
  const citySuggestions = useStore($citySuggestions)

  return (
    <div class={styles.root}>
      <label
        class={styles.label}
        for='city'
      >
        Search for a city:
      </label>
      <input
        list='cities'
        id='city'
        type='text'
        name='city'
        class={styles.input}
        value={locationSearch()}
        onInput={e => $locationSearch.set(e.currentTarget.value)}
      />
      <datalist id='cities'>
        <For each={citySuggestions()}>
          {city => <option value={city.label}></option>}
        </For>
      </datalist>
    </div>
  )
}
