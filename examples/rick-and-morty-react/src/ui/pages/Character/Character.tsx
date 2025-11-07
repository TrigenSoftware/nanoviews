/* DISCLAIMER! VIBECODED! */
import { useSignal } from '@kidajs/react'
import {
  $error,
  $loading
} from '../../../stores/tasks'
import { $characterEpisodes } from '../../../stores/episodes'
import { CharacterDetail } from '../../blocks/CharacterDetail'
import { EpisodesGrid } from '../../blocks/EpisodesGrid'
import styles from './Character.module.css'

export function Character() {
  const episodes = useSignal($characterEpisodes)
  const loading = useSignal($loading)
  const error = useSignal($error)

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading character...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading character</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <section className={styles.container}>
      <CharacterDetail />

      <div className={styles.episodesSection}>
        <h2 id='episodes' className={styles.episodesTitle}>
          <a href='#episodes'>Episodes ({episodes.length})</a>
        </h2>
        <EpisodesGrid episodes={episodes} />
      </div>
    </section>
  )
}
