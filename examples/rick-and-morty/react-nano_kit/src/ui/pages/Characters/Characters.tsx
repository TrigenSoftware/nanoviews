/* DISCLAIMER! VIBECODED! */
import { useSignal } from '@nano_kit/react'
import { $page } from '#src/stores/router'
import {
  $characters,
  $characterError,
  $characterLoading
} from '#src/stores/characters'
import { CharactersGrid } from '#src/ui/blocks/CharactersGrid'
import { Pagination } from '#src/ui/components/Pagination'
import { Spinner } from '#src/ui/components/Spinner'
import styles from './Characters.module.css'

function formatUrl(page: number) {
  return `?page=${page}`
}

function formatPageLabel(page: number) {
  return `Go to page ${page}`
}

export function Characters() {
  const charactersPage = useSignal($characters)
  const error = useSignal($characterError)
  const loading = useSignal($characterLoading)
  const currentPage = useSignal($page)

  if (loading || !charactersPage) {
    return (
      <section className={styles.container}>
        <Spinner>Loading characters...</Spinner>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.container}>
        <div className={styles.error}>
          <h2>Error loading characters</h2>
          <p>{error}</p>
        </div>
      </section>
    )
  }

  const {
    items: characters,
    totalPages
  } = charactersPage

  return (
    <section className={styles.container}>
      <CharactersGrid characters={characters} />

      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalPages}
          formatUrl={formatUrl}
          previousLabel='Previous'
          nextLabel='Next'
          formatPageLabel={formatPageLabel}
          label='Character pages navigation'
        />
      )}
    </section>
  )
}
