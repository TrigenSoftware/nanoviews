/* DISCLAIMER! VIBECODED! */
import { useSignal } from '@nano_kit/react'
import {
  $residents,
  $residentsError,
  $residentsLoading
} from '#src/stores/characters'
import { LocationDetail } from '#src/ui/blocks/LocationDetail'
import { CharactersGrid } from '#src/ui/blocks/CharactersGrid'
import { Spinner } from '#src/ui/components/Spinner'
import styles from './Location.module.css'

export function Location() {
  const residents = useSignal($residents)
  const error = useSignal($residentsError)
  const loading = useSignal($residentsLoading)

  if (loading || !residents) {
    return <Spinner>Loading location...</Spinner>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading location</h2>
        <p>{error}</p>
      </div>
    )
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
