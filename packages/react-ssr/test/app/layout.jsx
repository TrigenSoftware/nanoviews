import { Outlet } from '@nano_kit/react-router'

export default function Layout() {
  return (
    <>
      <main>
        <Outlet/>
      </main>
    </>
  )
}
