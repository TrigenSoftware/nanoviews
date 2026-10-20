import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import starlight from '@astrojs/starlight'
import starlightSidebarTopics from 'starlight-sidebar-topics'
import llmsTxt from 'starlight-llms-txt'
import { viewTransitions } from 'astro-vtbot/starlight-view-transitions'
import { rehypeNormalizeContent } from './rehype.js'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  site: 'https://nanoviews.js.org',
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeNormalizeContent]
    })
  },
  integrations: [
    starlight({
      title: 'Nanoviews',
      titleDelimiter: '✧',
      description: 'A small Direct DOM library for building user interfaces.',
      logo: {
        dark: './src/assets/moon_white.svg',
        light: './src/assets/moon_black.svg'
      },
      favicon: '/favicon.svg',
      head: [
        {
          // GitHub Pages can't set COOP/COEP headers, which StackBlitz
          // WebContainers embeds require; this service worker injects them
          tag: 'script',
          attrs: {
            src: '/coi-serviceworker.js'
          }
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://nanoviews.js.org/og-image.jpg'
          }
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:width',
            content: '1200'
          }
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:height',
            content: '630'
          }
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:type',
            content: 'image/jpeg'
          }
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:card',
            content: 'summary_large_image'
          }
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://nanoviews.js.org/og-image.jpg'
          }
        },
        {
          tag: 'meta',
          attrs: {
            name: 'format-detection',
            content: 'telephone=no'
          }
        },
        isProduction && {
          tag: 'script',
          attrs: {
            src: 'https://cloud.umami.is/script.js',
            'data-website-id': '1b1d953b-36cd-4491-85c1-0efddef901cb',
            defer: true,
            // Required to pass the COEP require-corp check
            crossorigin: 'anonymous'
          }
        }
      ].filter(Boolean),
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
      plugins: [
        llmsTxt(),
        viewTransitions(),
        starlightSidebarTopics([
          {
            id: 'documentation',
            label: 'Documentation',
            link: '/getting-started/',
            icon: 'open-book',
            items: [
              {
                label: 'Getting Started',
                items: [
                  {
                    autogenerate: {
                      directory: 'getting-started'
                    }
                  }
                ]
              },
              {
                label: 'Guides',
                items: [
                  {
                    autogenerate: {
                      directory: 'guides'
                    }
                  }
                ]
              },
              {
                label: 'Router',
                items: [
                  {
                    autogenerate: {
                      directory: 'router'
                    }
                  }
                ]
              },
              {
                label: 'Testing',
                items: [
                  {
                    autogenerate: {
                      directory: 'testing'
                    }
                  }
                ]
              },
              {
                label: 'Storybook',
                items: [
                  {
                    autogenerate: {
                      directory: 'storybook'
                    }
                  }
                ]
              }
            ]
          },
          {
            label: 'Examples',
            link: '/examples/',
            icon: 'seti:svg',
            items: [
              {
                autogenerate: {
                  directory: 'examples'
                }
              }
            ]
          }
        ])
      ],
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        themes: ['github-dark-high-contrast', 'github-light-default']
      }
    })
  ]
})
