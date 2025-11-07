/* DISCLAIMER! VIBECODED! */
import { useSignal } from '@kidajs/react'
import {
  $error,
  $loading
} from '../../../stores/tasks'
import { $residents } from '../../../stores/characters'
import { EpisodeDetail } from '../../blocks/EpisodeDetail'
import { CharactersGrid } from '../../blocks/CharactersGrid'
import styles from './Episode.module.css'

export function Episode() {
  const characters = useSignal($residents)
  const loading = useSignal($loading)
  const error = useSignal($error)

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading episode...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading episode</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <section className={styles.container}>
      <EpisodeDetail />

      <div className={styles.charactersSection}>
        <h2 id='characters' className={styles.charactersTitle}>
          <a href='#characters'>Characters ({characters.length})</a>
        </h2>
        <CharactersGrid characters={characters} />
      </div>
    </section>
  )
}
