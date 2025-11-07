/* DISCLAIMER! VIBECODED! */
import { useSignal } from '@kidajs/react'
import { $page } from '../../../stores/router'
import {
  $characters,
  $charactersTotalPages
} from '../../../stores/characters'
import {
  $error,
  $loading
} from '../../../stores/tasks'
import { CharactersGrid } from '../../blocks/CharactersGrid'
import { Pagination } from '../../components/Pagination'
import styles from './Characters.module.css'

function formatUrl(page: number) {
  return `?page=${page}`
}

function formatPageLabel(page: number) {
  return `Go to page ${page}`
}

export function Characters() {
  const characters = useSignal($characters)
  const loading = useSignal($loading)
  const error = useSignal($error)
  const currentPage = useSignal($page)
  const totalPages = useSignal($charactersTotalPages)

  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading characters...</p>
        </div>
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
