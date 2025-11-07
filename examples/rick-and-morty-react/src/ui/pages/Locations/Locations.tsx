/* DISCLAIMER! VIBECODED! */
import { useSignal } from '@kidajs/react'
import { $page } from '../../../stores/router'
import { $locations, $locationsTotalPages } from '../../../stores/locations'
import { $loading, $error } from '../../../stores/tasks'
import { LocationsGrid } from '../../blocks/LocationsGrid'
import { Pagination } from '../../components/Pagination'
import styles from './Locations.module.css'

function formatUrl(page: number) {
  return `?page=${page}`
}

function formatPageLabel(page: number) {
  return `Go to page ${page}`
}

export function Locations() {
  const locations = useSignal($locations)
  const currentPage = useSignal($page)
  const totalPages = useSignal($locationsTotalPages)
  const loading = useSignal($loading)
  const error = useSignal($error)

  if (loading) {
    return (
      <section className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading locations...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.container}>
        <div className={styles.error}>
          <h2>Error loading locations</h2>
          <p>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.container}>
      <LocationsGrid locations={locations} />

      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalPages}
          formatUrl={formatUrl}
          previousLabel='Previous'
          nextLabel='Next'
          formatPageLabel={formatPageLabel}
          label='Location pages navigation'
        />
      )}
    </section>
  )
}
