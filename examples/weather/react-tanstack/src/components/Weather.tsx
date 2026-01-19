import { useWeather } from '../stores/context.jsx'
import { useCitySuggestions } from '../stores/cities.js'
import { useCurrentWeather } from '../stores/weather.js'
import styles from './Weather.module.css'

export function Weather() {
  const { locationSearch } = useWeather()
  const { data: citySuggestions = [] } = useCitySuggestions(locationSearch)
  const currentCity = citySuggestions[0] || null
  const { data: currentWeather } = useCurrentWeather(currentCity)

  if (!currentWeather) {
    return null
  }

  return (
    <div className={styles.root}>
      <h3 className={styles.currentTemp}>
        {currentWeather.tempText}
      </h3>
      <img
        className={styles.image}
        src={currentWeather.icon}
        alt={currentWeather.description}
      />
      <p
        className={styles.feelsLike}
      >
        Feels like
        {' '}
        {currentWeather.feelsLikeText}
      </p>
      <p className={styles.description}>
        {currentWeather.description}
        <br/>
        Humidity:
        {' '}
        {currentWeather.humidity}
        %
      </p>
    </div>
  )
}
