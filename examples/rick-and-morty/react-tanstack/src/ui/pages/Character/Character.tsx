/* DISCLAIMER! VIBECODED! */
import { useParams } from '@tanstack/react-router'
import { useCharacterEpisodes } from '#src/stores/episodes'
import { CharacterDetail } from '#src/ui/blocks/CharacterDetail'
import { EpisodesGrid } from '#src/ui/blocks/EpisodesGrid'
import { Spinner } from '#src/ui/components/Spinner'
import styles from './Character.module.css'

export function Character() {
  const { characterId } = useParams({
    from: '/character/$characterId'
  })
  const { data: episodes, error, isLoading: loading } = useCharacterEpisodes(characterId)

  if (loading || !episodes) {
    return <Spinner>Loading character...</Spinner>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading character</h2>
        <p>{error.message}</p>
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
