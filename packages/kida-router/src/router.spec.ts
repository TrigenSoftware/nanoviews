import {
  describe,
  it,
  expect
} from 'vitest'
import {
  router,
  routeParam
} from './router.js'
import { virtualNavigation } from './navigation.js'

describe('kida-router', () => {
  describe('router', () => {
    it('should match simple routes', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        home: '/home',
        about: '/about',
        contact: '/contact'
      })

      navigation.push('/home')
      expect($match()).toEqual({
        route: 'home',
        params: {}
      })

      navigation.push('/about')
      expect($match()).toEqual({
        route: 'about',
        params: {}
      })

      navigation.push('/contact')
      expect($match()).toEqual({
        route: 'contact',
        params: {}
      })
    })

    it('should match routes with parameters', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        user: '/users/:id',
        userEdit: '/users/:id/edit',
        post: '/posts/:postId'
      })

      navigation.push('/users/123')
      expect($match()).toEqual({
        route: 'user',
        params: {
          id: '123'
        }
      })

      navigation.push('/users/456/edit')
      expect($match()).toEqual({
        route: 'userEdit',
        params: {
          id: '456'
        }
      })

      navigation.push('/posts/abc-def')
      expect($match()).toEqual({
        route: 'post',
        params: {
          postId: 'abc-def'
        }
      })
    })

    it('should match routes with optional parameters', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        blog: '/blog/:page?',
        category: '/blog/category/:slug/:page?'
      })

      navigation.push('/blog')
      expect($match()).toEqual({
        route: 'blog',
        params: {
          page: ''
        }
      })

      navigation.push('/blog/2')
      expect($match()).toEqual({
        route: 'blog',
        params: {
          page: '2'
        }
      })

      navigation.push('/blog/category/tech')
      expect($match()).toEqual({
        route: 'category',
        params: {
          slug: 'tech',
          page: ''
        }
      })

      navigation.push('/blog/category/tech/3')
      expect($match()).toEqual({
        route: 'category',
        params: {
          slug: 'tech',
          page: '3'
        }
      })
    })

    it('should match wildcard routes', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        files: '/files/*',
        api: '/api/*'
      })

      navigation.push('/files/documents/report.pdf')
      expect($match()).toEqual({
        route: 'files',
        params: {
          wildcard: 'documents/report.pdf'
        }
      })

      navigation.push('/api/v1/users/123')
      expect($match()).toEqual({
        route: 'api',
        params: {
          wildcard: 'v1/users/123'
        }
      })
    })

    it('should handle URL encoding in parameters', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        search: '/search/:query'
      })

      navigation.push('/search/hello%20world')
      expect($match()).toEqual({
        route: 'search',
        params: {
          query: 'hello world'
        }
      })

      navigation.push('/search/special%2Bchars%26symbols')
      expect($match()).toEqual({
        route: 'search',
        params: {
          query: 'special+chars&symbols'
        }
      })
    })

    it('should handle special characters in route patterns', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        apiV1: '/api/v1.0/:endpoint',
        brackets: '/data[test]/:id',
        special: '/path+with+plus/:param'
      })

      navigation.push('/api/v1.0/test')
      expect($match()).toEqual({
        route: 'apiV1',
        params: {
          endpoint: 'test'
        }
      })

      navigation.push('/data[test]/123')
      expect($match()).toEqual({
        route: 'brackets',
        params: {
          id: '123'
        }
      })

      navigation.push('/path+with+plus/value')
      expect($match()).toEqual({
        route: 'special',
        params: {
          param: 'value'
        }
      })
    })

    it('should handle trailing slashes correctly', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        home: '/home',
        users: '/users/'
      })

      navigation.push('/home/')
      expect($match()).toEqual({
        route: 'home',
        params: {}
      })

      navigation.push('/users')
      expect($match()).toEqual({
        route: 'users',
        params: {}
      })

      navigation.push('/users/')
      expect($match()).toEqual({
        route: 'users',
        params: {}
      })
    })

    it('should handle root path', () => {
      const [$location] = virtualNavigation()
      const $match = router($location, {
        home: '/',
        about: '/about'
      })

      expect($match()).toEqual({
        route: 'home',
        params: {}
      })
    })

    it('should return nomatch when no route matches', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        home: '/home',
        about: '/about'
      })

      navigation.push('/unknown-path')
      expect($match()).toEqual({
        route: null,
        params: {}
      })
    })

    it('should be case insensitive', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        home: '/home',
        about: '/about'
      })

      navigation.push('/HOME')
      expect($match()).toEqual({
        route: 'home',
        params: {}
      })

      navigation.push('/ABOUT')
      expect($match()).toEqual({
        route: 'about',
        params: {}
      })
    })

    it('should prioritize exact matches over parameterized routes', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        userNew: '/users/new',
        user: '/users/:id'
      })

      navigation.push('/users/new')
      expect($match()).toEqual({
        route: 'userNew',
        params: {}
      })
    })

    it('should handle complex nested routes', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        adminUserPermission: '/admin/users/:userId/permissions/:permission',
        adminUser: '/admin/users/:id',
        admin: '/admin'
      })

      navigation.push('/admin/users/123/permissions/read')
      expect($match()).toEqual({
        route: 'adminUserPermission',
        params: {
          userId: '123',
          permission: 'read'
        }
      })
    })

    it('should update when pathname changes', () => {
      const [$location, navigation] = virtualNavigation()
      const $match = router($location, {
        home: '/home',
        about: '/about'
      })

      navigation.push('/home')
      expect($match()).toEqual({
        route: 'home',
        params: {}
      })

      navigation.push('/about')
      expect($match()).toEqual({
        route: 'about',
        params: {}
      })
    })

    describe('routeParam', () => {
      it('should extract and parse route parameters', () => {
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          user: '/users/:id/:category'
        })

        navigation.push('/users/123/tech')

        const $id = routeParam($route, 'id')
        const $category = routeParam($route, 'category')

        expect($id()).toBe('123')
        expect($category()).toBe('tech')
      })

      it('should parse parameter with custom parser', () => {
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          user: '/users/:id/:page/:active'
        })

        navigation.push('/users/123/5/true')

        const $id = routeParam($route, 'id', Number)
        const $page = routeParam($route, 'page', parseInt)
        const $active = routeParam($route, 'active', value => value === 'true')

        expect($id()).toBe(123)
        expect($page()).toBe(5)
        expect($active()).toBe(true)
      })

      it('should handle missing parameters gracefully', () => {
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          user: '/users/:id'
        })

        navigation.push('/users/123')

        const $missing = routeParam($route, 'missing' as any)

        expect($missing()).toBeUndefined()
      })

      it('should update when route changes', () => {
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          user: '/users/:id'
        })

        navigation.push('/users/123')

        const $id = routeParam($route, 'id', Number)

        expect($id()).toBe(123)

        navigation.push('/users/456')
        expect($id()).toBe(456)
      })

      it('should parse with complex transformations', () => {
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          search: '/search/:tags'
        })

        navigation.push('/search/javascript,typescript,react')

        const $tags = routeParam($route, 'tags', value => value?.split(',') || [])

        expect($tags()).toEqual([
          'javascript',
          'typescript',
          'react'
        ])

        navigation.push('/search/vue,angular')
        expect($tags()).toEqual(['vue', 'angular'])
      })

      it('should handle empty string parameters', () => {
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          page: '/page/:optional?'
        })

        navigation.push('/page')

        const $optional = routeParam($route, 'optional')

        expect($optional()).toBe('')
      })

      it('should work with wildcard parameters', () => {
        const [$location, navigation] = virtualNavigation()
        const $route = router($location, {
          files: '/files/*'
        })

        navigation.push('/files/documents/report.pdf')

        const $wildcard = routeParam($route, 'wildcard')

        expect($wildcard()).toBe('documents/report.pdf')
      })
    })
  })
})
