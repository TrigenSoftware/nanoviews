import { CityInput } from './components/CityInput.jsx'
import { Weather } from './components/Weather.jsx'
import { Forecast } from './components/Forecast.jsx'
import styles from './App.module.css'

export function App() {
  return (
    <main class={styles.main}>
      <header>
        <h1 class={styles.title}>Weather App</h1>
      </header>
      <CityInput />
      <Weather />
      <Forecast />
    </main>
  )
}
