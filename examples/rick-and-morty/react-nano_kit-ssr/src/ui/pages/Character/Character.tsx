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
import { Character$ } from '#src/stores/characters'
import { CharacterEpisodes$ } from '#src/stores/episodes'
import { CharacterDetail } from '#src/ui/blocks/CharacterDetail'
import { EpisodesGrid } from '#src/ui/blocks/EpisodesGrid'
import { Spinner } from '#src/ui/components/Spinner'
import styles from './Character.module.css'

export function Head$() {
  const { $character } = inject(Character$)

  return [
    title(computed(() => `Rick and Morty Wiki | ${$character()?.name || 'Character'}`))
  ]
}

export function Stores$() {
  const { $character } = inject(Character$)
  const { $characterEpisodes } = inject(CharacterEpisodes$)

  return [$character, $characterEpisodes]
}

export default function Character() {
  const {
    $characterError,
    $characterLoading
  } = useInject(Character$)
  const { $characterEpisodes } = useInject(CharacterEpisodes$)
  const episodes = useSignal($characterEpisodes)
  const error = useSignal($characterError)
  const loading = useSignal($characterLoading)

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading character</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (loading || !episodes) {
    return <Spinner>Loading character...</Spinner>
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
