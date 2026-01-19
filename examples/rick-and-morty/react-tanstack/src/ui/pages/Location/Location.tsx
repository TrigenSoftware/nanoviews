/* DISCLAIMER! VIBECODED! */
import { useParams } from '@tanstack/react-router'
import { useLocation } from '#src/stores/locations'
import { useResidents } from '#src/stores/characters'
import { LocationDetail } from '#src/ui/blocks/LocationDetail'
import { CharactersGrid } from '#src/ui/blocks/CharactersGrid'
import { Spinner } from '#src/ui/components/Spinner'
import styles from './Location.module.css'

export function Location() {
  const { locationId } = useParams({
    from: '/location/$locationId'
  })
  const { data: location } = useLocation(locationId)
  const ids = location?.residents.map((url: string) => {
    const parts = url.split('/')

    return Number(parts[parts.length - 1])
  }) || []
  const { data: residents, error, isLoading: loading } = useResidents(ids)

  if (loading || !residents) {
    return <Spinner>Loading location...</Spinner>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading location</h2>
        <p>{error.message}</p>
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
