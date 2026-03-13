import {
  describe,
  it,
  expect
} from 'vitest'
import { Manifest } from './manifest.js'
import type { ManifestRecord } from './manifest.types.js'

describe('ssr', () => {
  describe('Manifest', () => {
    describe('getAssetsTags', () => {
      it('should return CSS styles, main entry script and modulepreload links', () => {
        const manifest = new Manifest()
        const manifestData: ManifestRecord = {
          'src/index.ts': {
            src: 'src/index.ts',
            file: 'assets/index-abc123.js',
            isEntry: true,
            css: ['assets/main.css'],
            imports: ['src/router.ts', 'src/store.ts']
          },
          'src/router.ts': {
            src: 'src/router.ts',
            file: 'assets/router-def456.js',
            imports: ['src/utils.ts']
          },
          'src/store.ts': {
            src: 'src/store.ts',
            file: 'assets/store-ghi789.js',
            css: ['assets/store.css'],
            imports: ['src/utils.ts']
          },
          'src/utils.ts': {
            src: 'src/utils.ts',
            file: 'assets/utils-jkl012.js'
          }
        }

        manifest.manifest = manifestData

        const tags = manifest.getAssetsTags()
        const cssLinks = tags.filter(tag => tag.tag === 'link' && tag.props?.rel === 'stylesheet')

        expect(cssLinks).toHaveLength(2)
        expect(cssLinks[0]).toMatchObject({
          tag: 'link',
          props: {
            rel: 'stylesheet',
            href: '/assets/main.css'
          }
        })
        expect(cssLinks[1]).toMatchObject({
          tag: 'link',
          props: {
            rel: 'stylesheet',
            href: '/assets/store.css'
          }
        })

        const mainScript = tags.find(tag => tag.tag === 'script')

        expect(mainScript).toMatchObject({
          tag: 'script',
          props: {
            type: 'module',
            src: '/assets/index-abc123.js'
          }
        })

        const modulepreloadLinks = tags.filter(tag => tag.tag === 'link' && tag.props?.rel === 'modulepreload')

        expect(modulepreloadLinks).toHaveLength(3)
        expect(modulepreloadLinks[0]).toMatchObject({
          tag: 'link',
          props: {
            rel: 'modulepreload',
            href: '/assets/router-def456.js'
          }
        })
        expect(modulepreloadLinks[1]).toMatchObject({
          tag: 'link',
          props: {
            rel: 'modulepreload',
            href: '/assets/utils-jkl012.js'
          }
        })
        expect(modulepreloadLinks[2]).toMatchObject({
          tag: 'link',
          props: {
            rel: 'modulepreload',
            href: '/assets/store-ghi789.js'
          }
        })
      })
    })
  })
})
