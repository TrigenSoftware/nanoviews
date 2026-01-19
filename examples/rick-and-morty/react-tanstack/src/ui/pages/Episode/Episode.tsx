/* DISCLAIMER! VIBECODED! */
import { useParams } from '@tanstack/react-router'
import { useEpisode } from '#src/stores/episodes'
import { useResidents } from '#src/stores/characters'
import { EpisodeDetail } from '#src/ui/blocks/EpisodeDetail'
import { CharactersGrid } from '#src/ui/blocks/CharactersGrid'
import { Spinner } from '#src/ui/components/Spinner'
import styles from './Episode.module.css'

export function Episode() {
  const { episodeId } = useParams({
    from: '/episode/$episodeId'
  })
  const { data: episode } = useEpisode(episodeId)
  const ids = episode?.characters.map((url: string) => {
    const parts = url.split('/')

    return Number(parts[parts.length - 1])
  }) || []
  const { data: characters, error, isLoading: loading } = useResidents(ids)

  if (loading || !characters) {
    return <Spinner>Loading episode...</Spinner>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading episode</h2>
        <p>{error.message}</p>
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
