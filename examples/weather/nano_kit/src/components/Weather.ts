import {
  div,
  h3,
  img,
  p,
  br,
  component$,
  if_
} from 'nanoviews'
import { $currentLocation } from '../stores/location.js'
import { $currentWeather } from '../stores/weather.js'

export const Weather = component$(() => if_($currentWeather)(
  () => div({
    class: 'weather',
    'data-city': () => $currentLocation()?.name
  })(
    h3({
      class: 'weather-temp'
    })(
      $currentWeather.$tempText
    ),
    img({
      class: 'weather-icon',
      src: $currentWeather.$icon,
      alt: $currentWeather.$description
    }),
    p({
      class: 'weather-feels-like'
    })(
      'Feels like ', $currentWeather.$feelsLikeText
    ),
    p({
      class: 'weather-description'
    })(
      $currentWeather.$description,
      br(),
      'Humidity: ',
      $currentWeather.$humidity,
      '%'
    )
  )
))
