/* DISCLAIMER! VIBECODED! */
import {
  useSignal,
  useInject
} from '@nano_kit/react'
import {
  computed,
  inject
} from '@nano_kit/store'
import { title } from '@nano_kit/router'
import { Location$ } from '#src/stores/locations.ts'
import { Residents$ } from '#src/stores/characters'
import { LocationDetail } from '#src/ui/blocks/LocationDetail'
import { CharactersGrid } from '#src/ui/blocks/CharactersGrid'
import { Spinner } from '#src/ui/components/Spinner'
import styles from './Location.module.css'

export function Head$() {
  const { $location } = inject(Location$)

  return [
    title(computed(() => `Rick and Morty Wiki | ${$location()?.name || 'Location'}`))
  ]
}

export function Stores$() {
  const { $location } = inject(Location$)
  const { $residents } = inject(Residents$)

  return [$location, $residents]
}

export default function Location() {
  const {
    $locationError,
    $locationLoading
  } = useInject(Location$)
  const { $residents } = useInject(Residents$)
  const residents = useSignal($residents)
  const error = useSignal($locationError)
  const loading = useSignal($locationLoading)

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading location</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (loading || !residents) {
    return <Spinner>Loading location...</Spinner>
  }

  return (
    <section className={styles.container}>
      <LocationDetail />

      <div className={styles.residentsSection}>
        <h2 id='residents' className={styles.residentsTitle}>
          <a href='#residents'>Residents ({residents.length})</a>
        </h2>
        <CharactersGrid characters={residents} />
      </div>
    </section>
  )
}
