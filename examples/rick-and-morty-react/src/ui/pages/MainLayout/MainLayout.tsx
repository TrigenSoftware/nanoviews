import { useSignal } from '@kidajs/react'
import { Outlet } from '@kidajs/react-router'
import clsx from 'clsx'
import {
  $location,
  paths
} from '../../../stores/router'
import styles from './MainLayout.module.css'

export function MainLayout() {
  const { route } = useSignal($location)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            <span className={styles.logo}>🛸</span>
            Rick and Morty
          </h1>

          <nav className={styles.nav}>
            <a
              href={paths.characters}
              className={clsx(styles.navLink, route === 'characters' && styles.active)}
            >
              Characters
            </a>
            <a
              href={paths.locations}
              className={clsx(styles.navLink, route === 'locations' && styles.active)}
            >
              Locations
            </a>
            <a
              href={paths.episodes}
              className={clsx(styles.navLink, route === 'episodes' && styles.active)}
            >
              Episodes
            </a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
