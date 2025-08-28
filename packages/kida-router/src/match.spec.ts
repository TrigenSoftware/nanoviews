/* eslint-disable @stylistic/array-element-newline */
import {
  describe,
  it,
  expect
} from 'vitest'
import { router } from './router.js'
import { virtualNavigation } from './navigation.js'
import {
  page,
  layout,
  match
} from './match.js'

describe('kida-router', () => {
  describe('match', () => {
    it('should match correct page based on route', () => {
      const [$location, navigation] = virtualNavigation()
      const $route = router($location, {
        home: '/home',
        about: '/about'
      })
      const $page = match($route, [
        page('home', 'Home Page'),
        page('about', 'About Page')
      ])

      navigation.push('/home')
      expect($page()).toBe('Home Page')

      navigation.push('/about')
      expect($page()).toBe('About Page')
    })

    it('should return null for unmatched routes', () => {
      const [$location, navigation] = virtualNavigation()
      const $route = router($location, {
        home: '/home',
        about: '/about'
      })
      const $page = match($route, [
        page('home', 'Home Page'),
        page('about', 'About Page')
      ])

      navigation.push('/unknown')
      expect($page()).toBeNull()

      navigation.push('/')
      expect($page()).toBeNull()
    })

    it('should handle empty pages array', () => {
      const [$location, navigation] = virtualNavigation()
      const $route = router($location, {
        home: '/home'
      })
      const $page = match($route, [])

      navigation.push('/home')
      expect($page()).toBeNull()
    })

    it('should update when route changes', () => {
      const [$location, navigation] = virtualNavigation()
      const $route = router($location, {
        home: '/home',
        about: '/about'
      })
      const $page = match($route, [
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

    describe('layout', () => {
      it('should compose layout with nested content', () => {
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          home: '/home',
          login: '/login',
          register: '/register'
        })
        const compose = ($nested: any, layout: string) => () => `${layout} > ${$nested()()}`
        const $page = match($route, [
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
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          home: '/home',
          about: '/about',
          login: '/login',
          register: '/register',
          dashboard: '/dashboard',
          settings: '/settings'
        })
        const compose = ($nested: any, layout: string) => () => `${layout}(${$nested()()})`
        const $page = match($route, [
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
    })
  })
})
