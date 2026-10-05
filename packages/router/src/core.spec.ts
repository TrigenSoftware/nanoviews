import {
  describe,
  it,
  expect
} from 'vitest'
import { render } from '@nanoviews/testing-library'
import {
  InjectionContext,
  DependencyNotFound,
  signal,
  provide,
  inject
} from 'nanoviews/store'
import {
  div,
  header,
  main,
  p,
  section,
  component$,
  context$,
  if_
} from 'nanoviews'
import {
  Page$,
  virtualNavigation,
  param,
  title
} from '@nano_kit/router'
import {
  page,
  layout,
  notFound,
  loadable
} from './type-overrides.js'
import {
  App,
  Outlet,
  router,
  pageView,
  syncPageHead$,
  syncHead$
} from './core.js'

const HomePage = component$(() => div()('Home Page'))
const AboutPage = component$(() => div()('About Page'))

describe('router', () => {
  describe('core', () => {
    describe('pageView', () => {
      it('should render the page matched by the route', () => {
        const [$location, navigation] = virtualNavigation('/', {
          home: '/home',
          about: '/about'
        })
        const $page = router($location, [
          page('home', HomePage),
          page('about', AboutPage)
        ])
        const { container } = render(() => pageView($page))

        expect(container.innerHTML).toBe('<div></div>')

        navigation.push('/home')

        expect(container.innerHTML).toBe('<div><div>Home Page</div></div>')

        navigation.push('/about')

        expect(container.innerHTML).toBe('<div><div>About Page</div></div>')

        navigation.push('/unknown')

        expect(container.innerHTML).toBe('<div></div>')
      })

      it('should keep the page when only the params change', () => {
        const [$location, navigation] = virtualNavigation('/users/1', {
          user: '/users/:id'
        })
        const $page = router($location, [
          page('user', () => p()('User ', param($location, 'id')))
        ])
        const { container } = render(() => pageView($page))
        const userPage = container.querySelector('p')

        expect(container.innerHTML).toBe('<div><p>User 1</p></div>')

        navigation.push('/users/2')

        expect(container.innerHTML).toBe('<div><p>User 2</p></div>')
        expect(container.querySelector('p')).toBe(userPage)
      })

      it('should render the not found page when no route matches', () => {
        const [$location, navigation] = virtualNavigation('/unknown', {
          home: '/'
        })
        const $page = router($location, [
          page('home', HomePage),
          notFound(() => div()('Not Found'))
        ])
        const { container } = render(() => pageView($page))

        expect(container.innerHTML).toBe('<div><div>Not Found</div></div>')

        navigation.push('/')

        expect(container.innerHTML).toBe('<div><div>Home Page</div></div>')
      })

      it('should render the fallback while the page is loading', async () => {
        const about = Promise.resolve({
          default: AboutPage
        })
        const [$location] = virtualNavigation('/about', {
          about: '/about'
        })
        const $page = router($location, [
          page('about', loadable(() => about, () => div()('Loading')))
        ])
        const { container } = render(() => pageView($page))

        expect(container.innerHTML).toBe('<div><div>Loading</div></div>')

        await about

        expect(container.innerHTML).toBe('<div><div>About Page</div></div>')
      })

      describe('layout', () => {
        it('should render the page at the outlet and keep the layout while its pages swap', () => {
          const [$location, navigation] = virtualNavigation('/', {
            home: '/home',
            login: '/login',
            register: '/register'
          })
          const AuthLayout = component$(() => main()(Outlet()))
          const $page = router($location, [
            page('home', HomePage),
            layout(AuthLayout, [
              page('login', () => div()('Login Page')),
              page('register', () => div()('Register Page'))
            ])
          ])
          const { container } = render(() => pageView($page))

          navigation.push('/login')

          const authLayout = container.querySelector('main')

          expect(container.innerHTML).toBe('<div><main><div>Login Page</div></main></div>')

          navigation.push('/register')

          expect(container.innerHTML).toBe('<div><main><div>Register Page</div></main></div>')
          expect(container.querySelector('main')).toBe(authLayout)

          navigation.push('/home')

          expect(container.innerHTML).toBe('<div><div>Home Page</div></div>')
        })

        it('should keep every layout above the page that swaps in nested layouts', () => {
          const [$location, navigation] = virtualNavigation('/', {
            login: '/login',
            dashboard: '/dashboard',
            settings: '/settings'
          })
          const AuthLayout = component$(() => main()(Outlet()))
          const DashboardLayout = component$(() => section()(Outlet()))
          const $page = router($location, [
            layout(AuthLayout, [
              page('login', () => div()('Login')),
              layout(DashboardLayout, [
                page('dashboard', () => div()('Dashboard')),
                page('settings', () => div()('Settings'))
              ])
            ])
          ])
          const { container } = render(() => pageView($page))

          navigation.push('/settings')

          const authLayout = container.querySelector('main')
          const dashboardLayout = container.querySelector('section')

          expect(container.innerHTML).toBe('<div><main><section><div>Settings</div></section></main></div>')

          navigation.push('/dashboard')

          expect(container.innerHTML).toBe('<div><main><section><div>Dashboard</div></section></main></div>')
          expect(container.querySelector('main')).toBe(authLayout)
          expect(container.querySelector('section')).toBe(dashboardLayout)

          navigation.push('/login')

          expect(container.innerHTML).toBe('<div><main><div>Login</div></main></div>')
          expect(container.querySelector('main')).toBe(authLayout)

          navigation.push('/settings')

          expect(container.innerHTML).toBe('<div><main><section><div>Settings</div></section></main></div>')
          expect(container.querySelector('main')).toBe(authLayout)
        })

        it('should render the layout fallback as the page while the layout is loading', async () => {
          const Layout = component$(() => main()(Outlet()))
          const layoutModule = Promise.resolve({
            default: Layout
          })
          const [$location] = virtualNavigation('/home', {
            home: '/home'
          })
          const $page = router($location, [
            layout(loadable(() => layoutModule, () => div()('Loading')), [
              page('home', HomePage)
            ])
          ])
          const { container } = render(() => pageView($page))

          expect(container.innerHTML).toBe('<div><div>Loading</div></div>')

          await layoutModule

          expect(container.innerHTML).toBe('<div><main><div>Home Page</div></main></div>')
        })

        it('should resolve what the layout and its pages inject in the injection context above the layout', () => {
          function Store$() {
            return {}
          }

          const stores: unknown[] = []
          const [$location, navigation] = virtualNavigation('/store', {
            home: '/home',
            store: '/store'
          })
          const $page = router($location, [
            page('home', HomePage),
            layout(() => main()(Outlet()), [
              page('store', () => {
                stores.push(inject(Store$))

                return div()('Store')
              })
            ])
          ])
          const context = new InjectionContext()

          render(() => context$(context)(pageView($page)))

          // the layout is built anew, and the page gets the same store
          navigation.push('/home')
          navigation.push('/store')

          expect(stores).toHaveLength(2)
          expect(stores[1]).toBe(stores[0])
          expect(inject(Store$, context)).toBe(stores[0])
        })
      })
    })

    describe('Outlet', () => {
      it('should render the page at any depth of the layout', () => {
        const $shown = signal(false)
        const Content = component$(() => section()(
          if_($shown)(() => Outlet())
        ))
        const Layout = component$(() => main()(
          header()('Header'),
          Content()
        ))
        const [$location] = virtualNavigation('/home', {
          home: '/home'
        })
        const $page = router($location, [
          layout(Layout, [
            page('home', HomePage)
          ])
        ])
        const { container } = render(() => pageView($page))

        expect(container.innerHTML).toBe('<div><main><header>Header</header><section></section></main></div>')

        $shown(true)

        expect(container.innerHTML).toBe('<div><main><header>Header</header><section><div>Home Page</div></section></main></div>')
      })

      it('should throw outside of a layout', () => {
        expect(() => render(() => context$()(Outlet()))).toThrow(DependencyNotFound)
      })
    })

    describe('App', () => {
      it('should render the page from the injection context', () => {
        const [$location, navigation] = virtualNavigation('/home', {
          home: '/home',
          about: '/about'
        })
        const $page = router($location, [
          page('home', HomePage),
          page('about', AboutPage)
        ])
        const { container } = render(() => context$(provide(Page$, $page))(App()))

        expect(container.innerHTML).toBe('<div><div>Home Page</div></div>')

        navigation.push('/about')

        expect(container.innerHTML).toBe('<div><div>About Page</div></div>')
      })
    })

    describe('syncPageHead$', () => {
      it('should sync the document head with the matched page', () => {
        const [$location, navigation] = virtualNavigation('/home', {
          home: '/home',
          about: '/about'
        })
        const $page = router($location, [
          page('home', {
            default: HomePage,
            Head$: () => [title('Home')]
          }),
          page('about', {
            default: AboutPage,
            Head$: () => [title('About')]
          })
        ])
        const Root = component$(() => {
          syncPageHead$($page)

          return pageView($page)
        })

        render(() => Root())

        expect(document.title).toBe('Home')

        navigation.push('/about')

        expect(document.title).toBe('About')
      })
    })

    describe('syncHead$', () => {
      it('should sync the document head with the page resolving head factories within the injection context', () => {
        function Title$() {
          return 'Home'
        }

        const [$location, navigation] = virtualNavigation('/home', {
          home: '/home',
          about: '/about'
        })
        const $page = router($location, [
          page('home', {
            default: HomePage,
            Head$: () => [title(inject(Title$))]
          }),
          page('about', {
            default: AboutPage,
            Head$: () => [title('About')]
          })
        ])
        const Root = component$(() => {
          syncHead$()

          return App()
        })

        render(() => context$(provide(Page$, $page))(Root()))

        expect(document.title).toBe('Home')

        navigation.push('/about')

        expect(document.title).toBe('About')
      })
    })
  })
})
