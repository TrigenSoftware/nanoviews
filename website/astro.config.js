import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import llmsTxt from 'starlight-llms-txt'
import { viewTransitions } from 'astro-vtbot/starlight-view-transitions'

export default defineConfig({
  site: 'https://nano_kit.js.org',
  integrations: [
    starlight({
      title: 'Nano Kit',
      titleDelimiter: '✧',
      description: 'Nano Kit is an ecosystem of lightweight, modular, and performant libraries for building modern web applications, built around a push-pull based reactivity system.',
      logo: {
        dark: './src/assets/universe_white.svg',
        light: './src/assets/universe_black.svg'
      },
      favicon: '/favicon.svg',
      // head: [
      //   {
      //     tag: 'script',
      //     attrs: {
      //       'src': 'https://cloud.umami.is/script.js',
      //       'data-website-id': '***',
      //       'defer': true
      //     }
      //   },
      //   {
      //     tag: 'meta',
      //     attrs: {
      //       name: 'google-site-verification',
      //       content: '***'
      //     }
      //   }
      // ],
      social: [
        {
          label: 'GitHub',
          icon: 'github',
          href: 'https://github.com/TrigenSoftware/nanoviews'
        }
      ],
      editLink: {
        baseUrl: 'https://github.com/TrigenSoftware/nanoviews/edit/main/website/'
      },
      plugins: [llmsTxt(), viewTransitions()],
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: {
            directory: 'getting-started'
          }
        },
        {
          label: 'Store',
          autogenerate: {
            directory: 'store'
          }
        },
        {
          label: 'Query',
          autogenerate: {
            directory: 'query'
          }
        },
        {
          label: 'Router',
          autogenerate: {
            directory: 'router'
          }
        },
        {
          label: 'Integrations',
          autogenerate: {
            directory: 'integrations'
          }
        },
        {
          label: 'Examples',
          autogenerate: {
            directory: 'examples'
          }
        }
      ],
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        themes: ['github-dark-high-contrast', 'github-light-default'],
        frames: {
          extractFileNameFromCode: false
        }
      }
    })
  ]
})
