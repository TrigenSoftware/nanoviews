import { useCallback } from 'react'
import { useStore } from '@nanostores/react'
import {
  $locationSearch,
  $citySuggestions
} from 'data-layer/stores/location'
import styles from './CityInput.module.css'

export function CityInput() {
  const locationSearch = useStore($locationSearch)
  const citySuggestions = useStore($citySuggestions)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => $locationSearch.set(e.target.value),
    []
  )

  return (
    <div className={styles.root}>
      <label
        className={styles.label}
        htmlFor='city'
      >
        Search for a city:
      </label>
      <input
        list='cities'
        id='city'
        type='text'
        name='city'
        className={styles.input}
        value={locationSearch}
        onChange={handleChange}
      />
      <datalist id='cities'>
        {citySuggestions.map(city => (
          <option
            key={city.label}
            value={city.label}
          />
        ))}
      </datalist>
    </div>
  )
}
