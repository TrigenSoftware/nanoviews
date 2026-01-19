import { useCallback } from 'react'
import {
  useInject,
  useSignal
} from '@nano_kit/react'
import {
  LocationSearch$,
  CitySuggestions$
} from 'data-layer/stores/location'
import styles from './CityInput.module.css'

export function CityInput() {
  const { $searchQueryPaced } = useInject(LocationSearch$)
  const { $suggestions } = useInject(CitySuggestions$)
  const searchQueryPaced = useSignal($searchQueryPaced)
  const suggestions = useSignal($suggestions)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => $searchQueryPaced(e.target.value),
    [$searchQueryPaced]
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
        value={searchQueryPaced}
        onChange={handleChange}
      />
      <datalist id='cities'>
        {suggestions.map(city => (
          <option
            key={city.label}
            value={city.label}
          />
        ))}
      </datalist>
    </div>
  )
}
