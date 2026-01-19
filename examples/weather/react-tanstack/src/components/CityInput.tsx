import { useCallback } from 'react'
import { useWeather } from '../stores/context.jsx'
import { useCitySuggestions } from '../stores/cities.js'
import styles from './CityInput.module.css'

export function CityInput() {
  const { locationSearch, setLocationSearch } = useWeather()
  const { data: citySuggestions = [] } = useCitySuggestions(locationSearch)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLocationSearch(e.target.value),
    [setLocationSearch]
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
