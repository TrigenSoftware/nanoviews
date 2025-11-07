/* DISCLAIMER! VIBECODED! */
import { type Location } from 'rickmortyapi'
import { LocationCard } from '../LocationCard'
import styles from './LocationsGrid.module.css'

export interface LocationsGridProps {
  locations: Location[]
}

export function LocationsGrid({ locations }: LocationsGridProps) {
  return (
    <div className={styles.grid}>
      {locations.map(location => (
        <LocationCard
          key={location.id}
          location={location}
        />
      ))}
    </div>
  )
}
