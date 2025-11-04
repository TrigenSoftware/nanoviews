import {
  describe,
  it,
  expect,
  vi
} from 'vitest'
import type { ReadableSignal } from 'kida'
import { virtualNavigation } from './navigation.js'
import {
  page,
  layout,
  router,
  loadable,
  loadPages,
  loadPage
} from './router.js'

describe('kida-router', () => {
  describe('router', () => {
    it('should match correct page based on route', () => {
      const [$location, navigation] = virtualNavigation('/', {
        home: '/home',
        about: '/about'
      })
      const [$page] = router($location, [
        page('home', 'Home Page'),
        page('about', 'About Page')
      ])

      navigation.push('/home')
      expect($page()).toBe('Home Page')

      navigation.push('/about')
      expect($page()).toBe('About Page')
    })

    it('should return null for unmatched routes', () => {
      const [$location, navigation] = virtualNavigation('/', {
        home: '/home',
        about: '/about'
      })
      const [$page] = router($location, [
        page('home', 'Home Page'),
        page('about', 'About Page')
      ])

      navigation.push('/unknown')
      expect($page()).toBeNull()

      navigation.push('/')
      expect($page()).toBeNull()
    })

    it('should handle empty pages array', () => {
      const [$location, navigation] = virtualNavigation('/', {
        home: '/home'
      })
      const [$page] = router($location, [])

      navigation.push('/home')
      expect($page()).toBeNull()
    })

    it('should update when route changes', () => {
      const [$location, navigation] = virtualNavigation('/', {
        home: '/home',
        about: '/about'
      })
      const [$page] = router($location, [
        page('home', 'Home Page'),
        page('about', 'About Page')
      ])

      navigation.push('/')
      expect($page()).toBeNull()

      navigation.push('/home')
      expect($page()).toBe('Home Page')

      navigation.push('/about')
      expect($page()).toBe('About Page')

      navigation.push('/')
      expect($page()).toBeNull()
    })

    it('should expose page stores when provided', () => {
      const [$location, navigation] = virtualNavigation('/', {
        home: '/home',
        about: '/about'
      })
      const $homeData = () => 'home-store'
      const $aboutData = () => 'about-store'
      const [, storesToPreload] = router($location, [
        page('home', 'Home Page', () => [$homeData]),
        page('about', 'About Page', () => [$aboutData])
      ])

      expect(storesToPreload()).toEqual([])

      navigation.push('/home')

      expect(storesToPreload()).toEqual([$homeData])

      navigation.push('/about')

      expect(storesToPreload()).toEqual([$aboutData])

      navigation.push('/unknown')

      expect(storesToPreload()).toEqual([])
    })

    it('should render loadable page', async () => {
      const [$location, navigation] = virtualNavigation('/', {
        home: '/home',
        about: '/about',
        contact: '/contact'
      })
      const $homeData = () => 'home-store'
      const homePagePromise = Promise.resolve({
        default: 'Home Page',
        storesToPreload: () => [$homeData]
      })
      const $aboutData = () => 'about-store'
      const aboutPagePromise = Promise.resolve({
        default: 'About Page',
        storesToPreload: () => [$aboutData]
      })
      const contactPagePromise = Promise.resolve({
        default: 'Contact Page'
      })
      const [$page, storesToPreload] = router($location, [
        page('home', loadable(() => homePagePromise, 'Home Fallback')),
        page('about', loadable(() => aboutPagePromise, 'About Fallback')),
        page('contact', loadable(() => contactPagePromise))
      ])

      expect($page()).toBeNull()
      expect(storesToPreload()).toEqual([])

      navigation.push('/home')

      expect($page()).toBe('Home Fallback')
      expect(storesToPreload()).toEqual([])

      await homePagePromise

      expect($page()).toBe('Home Page')
      expect(storesToPreload()).toEqual([$homeData])

      navigation.push('/about')

      expect($page()).toBe('About Fallback')
      expect(storesToPreload()).toEqual([])

      await aboutPagePromise

      expect($page()).toBe('About Page')
      expect(storesToPreload()).toEqual([$aboutData])

      navigation.push('/contact')

      expect($page()).toBeNull()
      expect(storesToPreload()).toEqual([])

      await contactPagePromise

      expect($page()).toBe('Contact Page')
      expect(storesToPreload()).toEqual([])

      navigation.push('/unknown')

      expect($page()).toBeNull()
      expect(storesToPreload()).toEqual([])
    })

    describe('layout', () => {
      it('should compose layout with nested content', () => {
        const [$location, navigation] = virtualNavigation('/', {
          home: '/home',
          login: '/login',
          register: '/register'
        })
        const compose = ($nested: ReadableSignal<{ v: (() => string) | null }>, layout: string) => () => `${layout} > ${$nested().v?.()}`
        const [$page] = router($location, [
          page('home', (): string => 'Home Page'),
          layout('AuthLayout', [
            page('login', (): string => 'Login Page'),
            page('register', (): string => 'Register Page')
          ])
        ], compose)

        navigation.push('/login')
        expect($page()!()).toBe('AuthLayout > Login Page')

        navigation.push('/register')
        expect($page()!()).toBe('AuthLayout > Register Page')

        navigation.push('/home')
        expect($page()!()).toBe('Home Page')
      })

      it('should handle complex nested structure', () => {
        const [$location, navigation] = virtualNavigation('/', {
          home: '/home',
          about: '/about',
          login: '/login',
          register: '/register',
          dashboard: '/dashboard',
          settings: '/settings'
        })
        const compose = ($nested: ReadableSignal<{ v: (() => string) | null }>, layout: string) => () => `${layout}(${$nested().v?.()})`
        const [$page] = router($location, [
          page('home', (): string => 'Home'),
          page('about', (): string => 'About'),
          layout('AuthLayout', [
            page('login', (): string => 'Login'),
            page('register', (): string => 'Register'),
            layout('DashboardLayout', [
              page('dashboard', (): string => 'Dashboard'),
              page('settings', (): string => 'Settings')
            ])
          ])
        ], compose)

        navigation.push('/settings')
        expect($page()!()).toBe('AuthLayout(DashboardLayout(Settings))')

        navigation.push('/dashboard')
        expect($page()!()).toBe('AuthLayout(DashboardLayout(Dashboard))')

        navigation.push('/login')
        expect($page()!()).toBe('AuthLayout(Login)')

        navigation.push('/home')
        expect($page()!()).toBe('Home')

        navigation.push('/about')
        expect($page()!()).toBe('About')
      })

      it('should combine layout stores with nested page stores', () => {
        const [$location, navigation] = virtualNavigation('/', {
          home: '/home',
          about: '/about',
          dashboard: '/dashboard',
          admin: '/dashboard/admin'
        })
        const $homeData = () => 'home-store'
        const $aboutData = () => 'about-store'
        const $layoutData = () => 'layout-store'
        const $dashboardData = () => 'dashboard-store'
        const $adminData = () => 'admin-store'
        const compose = ($nested: ReadableSignal<{ v: (() => string) | null }>, layout: string) => () => `${layout} > ${$nested().v?.()}`
        const [, storesToPreload] = router($location, [
          page('home', (): string => 'Home', () => [$homeData]),
          page('about', (): string => 'About', () => [$aboutData]),
          layout('MainLayout', () => [$layoutData], [
            page('dashboard', (): string => 'Dashboard', () => [$dashboardData]),
            page('admin', (): string => 'Admin', () => [$adminData])
          ])
        ], compose)

        expect(storesToPreload()).toEqual([])

        navigation.push('/home')

        expect(storesToPreload()).toEqual([$homeData])

        navigation.push('/about')

        expect(storesToPreload()).toEqual([$aboutData])

        navigation.push('/dashboard')

        expect(storesToPreload()).toEqual([$layoutData, $dashboardData])

        navigation.push('/dashboard/admin')

        expect(storesToPreload()).toEqual([$layoutData, $adminData])

        navigation.push('/unknown')

        expect(storesToPreload()).toEqual([])
      })

      it('should render loadable page within layout', async () => {
        const [$location, navigation] = virtualNavigation('/', {
          home: '/home',
          about: '/about',
          dashboard: '/dashboard',
          admin: '/dashboard/admin'
        })
        const $homeData = () => 'home-store'
        const homePagePromise = Promise.resolve({
          default: (): string => 'Home',
          storesToPreload: () => [$homeData]
        })
        const $aboutData = () => 'about-store'
        const aboutPagePromise = Promise.resolve({
          default: (): string => 'About',
          storesToPreload: () => [$aboutData]
        })
        const $layoutData = () => 'layout-store'
        const layoutPromise = Promise.resolve({
          default: 'Layout',
          storesToPreload: () => [$layoutData]
        })
        const $dashboardData = () => 'dashboard-store'
        const dashboardPagePromise = Promise.resolve({
          default: (): string => 'Dashboard',
          storesToPreload: () => [$dashboardData]
        })
        const $adminData = () => 'admin-store'
        const adminPagePromise = Promise.resolve({
          default: (): string => 'Admin',
          storesToPreload: () => [$adminData]
        })
        const compose = (nested: ReadableSignal<{ v: (() => string) | null }>, layout: string) => () => `${layout}:${nested().v?.()}`
        const [$page, storesToPreload] = router($location, [
          page('home', loadable(() => homePagePromise, () => 'Home Fallback')),
          page('about', loadable(() => aboutPagePromise, () => 'About Fallback')),
          layout(loadable(() => layoutPromise, 'Layout Fallback'), [
            page('dashboard', loadable(() => dashboardPagePromise, () => 'Dashboard Fallback')),
            page('admin', loadable(() => adminPagePromise, () => 'Admin Fallback'))
          ])
        ], compose)

        expect($page()).toBeNull()
        expect(storesToPreload()).toEqual([])

        navigation.push('/home')

        expect($page()!()).toBe('Home Fallback')
        expect(storesToPreload()).toEqual([])

        await homePagePromise

        expect($page()!()).toBe('Home')
        expect(storesToPreload()).toEqual([$homeData])

        navigation.push('/about')

        expect($page()!()).toBe('About Fallback')
        expect(storesToPreload()).toEqual([])

        await aboutPagePromise

        expect($page()!()).toBe('About')
        expect(storesToPreload()).toEqual([$aboutData])

        navigation.push('/dashboard')

        expect($page()).toBe('Layout Fallback')
        expect(storesToPreload()).toEqual([])

        await layoutPromise

        expect($page()!()).toBe('Layout:Dashboard')
        expect(storesToPreload()).toEqual([$layoutData, $dashboardData])

        navigation.push('/dashboard/admin')

        expect($page()!()).toBe('Layout:Admin Fallback')
        expect(storesToPreload()).toEqual([$layoutData])

        await adminPagePromise

        expect($page()!()).toBe('Layout:Admin')
        expect(storesToPreload()).toEqual([$layoutData, $adminData])

        navigation.push('/unknown')

        expect($page()).toBeNull()
        expect(storesToPreload()).toEqual([])
      })
    })

    describe('utils', () => {
      it('should preload all loadable refs and collect tasks', async () => {
        const homePageLoader = vi.fn(() => Promise.resolve({
          default: 'Home'
        }))
        const aboutPageLoader = vi.fn(() => Promise.resolve({
          default: 'About'
        }))
        const layoutLoader = vi.fn(() => Promise.resolve({
          default: 'Layout'
        }))
        const dashboardPageLoader = vi.fn(() => Promise.resolve({
          default: 'Dashboard'
        }))
        const adminPageLoader = vi.fn(() => Promise.resolve({
          default: 'Admin'
        }))
        const pages = [
          page('home', loadable(homePageLoader)),
          page('about', loadable(aboutPageLoader)),
          layout(loadable(layoutLoader), [
            page('dashboard', loadable(dashboardPageLoader)),
            page('admin', loadable(adminPageLoader))
          ])
        ]
        const tasks = new Set<Promise<unknown>>()

        loadPages(pages, tasks)

        await Promise.all(tasks)

        expect(tasks.size).toBe(5)
        expect(homePageLoader).toHaveBeenCalledOnce()
        expect(aboutPageLoader).toHaveBeenCalledOnce()
        expect(layoutLoader).toHaveBeenCalledOnce()
        expect(dashboardPageLoader).toHaveBeenCalledOnce()
        expect(adminPageLoader).toHaveBeenCalledOnce()
      })

      it('should preload matched route and its parent layouts', async () => {
        const homePageLoader = vi.fn(() => Promise.resolve({
          default: 'Home'
        }))
        const aboutPageLoader = vi.fn(() => Promise.resolve({
          default: 'About'
        }))
        const layoutLoader = vi.fn(() => Promise.resolve({
          default: 'Layout'
        }))
        const dashboardPageLoader = vi.fn(() => Promise.resolve({
          default: 'Dashboard'
        }))
        const adminPageLoader = vi.fn(() => Promise.resolve({
          default: 'Admin'
        }))
        const pages = [
          page('home', loadable(homePageLoader)),
          page('about', loadable(aboutPageLoader)),
          layout(loadable(layoutLoader), [
            page('dashboard', loadable(dashboardPageLoader)),
            page('admin', loadable(adminPageLoader))
          ])
        ]

        await loadPage(pages, 'admin')

        expect(homePageLoader).not.toHaveBeenCalled()
        expect(aboutPageLoader).not.toHaveBeenCalled()
        expect(layoutLoader).toHaveBeenCalledOnce()
        expect(dashboardPageLoader).not.toHaveBeenCalled()
        expect(adminPageLoader).toHaveBeenCalledOnce()
      })
    })
  })
})
