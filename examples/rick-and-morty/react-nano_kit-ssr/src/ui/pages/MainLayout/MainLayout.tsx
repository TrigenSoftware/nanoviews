import {
  useSignal,
  useInject
} from '@nano_kit/react'
import {
  Location$,
  Paths$,
  Outlet,
  useSyncHead$,
  useListenLinks$,
  meta,
  title
} from '@nano_kit/react-router'
import clsx from 'clsx'
import styles from './MainLayout.module.css'

export function Head$() {
  return [
    title('Rick and Morty Wiki'),
    meta({
      charSet: 'utf-8'
    }),
    meta({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    })
  ]
}

export default function MainLayout() {
  const $location = useInject(Location$)
  const paths = useInject(Paths$)
  const { route } = useSignal($location)

  useSyncHead$()
  useListenLinks$()

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
