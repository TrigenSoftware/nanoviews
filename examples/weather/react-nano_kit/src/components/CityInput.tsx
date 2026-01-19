import { useCallback } from 'react'
import { useSignal } from '@nano_kit/react'
import {
  $locationSearchQueryPaced,
  $citySuggestions
} from 'data-layer/stores/location'
import styles from './CityInput.module.css'

export function CityInput() {
  const locationSearchQuery = useSignal($locationSearchQueryPaced)
  const citySuggestions = useSignal($citySuggestions)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => $locationSearchQueryPaced(e.target.value),
    []
  )

  return (
    <div className={styles.root}>
      <label
        htmlFor='city'
        className={styles.label}
      >
        Search for a city:
      </label>
      <input
        className={styles.input}
        id='city'
        type='text'
        list='cities'
        name='city'
        value={locationSearchQuery}
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
