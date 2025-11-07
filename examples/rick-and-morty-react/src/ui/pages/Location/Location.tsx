/* DISCLAIMER! VIBECODED! */
import { useSignal } from '@kidajs/react'
import {
  $error,
  $loading
} from '../../../stores/tasks'
import { $residents } from '../../../stores/characters'
import { LocationDetail } from '../../blocks/LocationDetail'
import { CharactersGrid } from '../../blocks/CharactersGrid'
import styles from './Location.module.css'

export function Location() {
  const residents = useSignal($residents)
  const loading = useSignal($loading)
  const error = useSignal($error)

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading location...</p>
      </div>
    )
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
