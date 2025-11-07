/* DISCLAIMER! VIBECODED! */
import { useSignal } from '@kidajs/react'
import { $page } from '../../../stores/router'
import {
  $episodes,
  $episodesTotalPages
} from '../../../stores/episodes'
import {
  $error,
  $loading
} from '../../../stores/tasks'
import { EpisodesGrid } from '../../blocks/EpisodesGrid'
import { Pagination } from '../../components/Pagination'
import styles from './Episodes.module.css'

function formatUrl(page: number) {
  return `?page=${page}`
}

function formatPageLabel(page: number) {
  return `Go to page ${page}`
}

export function Episodes() {
  const episodes = useSignal($episodes)
  const loading = useSignal($loading)
  const error = useSignal($error)
  const currentPage = useSignal($page)
  const totalPages = useSignal($episodesTotalPages)

  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading episodes...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.container}>
        <div className={styles.error}>
          <h2>Error loading episodes</h2>
          <p>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.container}>
      <EpisodesGrid episodes={episodes} />

      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalPages}
          formatUrl={formatUrl}
          previousLabel='Previous'
          nextLabel='Next'
          formatPageLabel={formatPageLabel}
          label='Episode pages navigation'
        />
      )}
    </section>
  )
}
