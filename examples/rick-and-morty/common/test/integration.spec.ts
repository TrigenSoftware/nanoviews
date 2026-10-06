import { join } from 'node:path'
import {
  beforeAll,
  afterAll,
  describe,
  it,
  expect
} from 'vitest'
import {
  type Browser,
  type Page,
  type Request,
  chromium
} from 'playwright'
import {
  implementations,
  useNetworkMemoryCache
} from '../../../common/test/integration-test-utils.js'

const RICK_AND_MORTY_API_JSON = /^https:\/\/trigensoftware\.github\.io\/rick-and-morty-api\/api\/.*\.json$/
const UI_TIMEOUT = 10000

async function openPage(
  page: Page,
  url: Promise<string | false>,
  path = '/'
) {
  const resolvedUrl = await url

  if (resolvedUrl) {
    return await page.goto(new URL(path, resolvedUrl).href, {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    })
  }

  return null
}

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  await browser?.close()
})

describe('Rick And Morty App', async () => {
  const list = await implementations({
    self: import.meta.dirname,
    root: join(import.meta.dirname, '..', '..')
  })

  describe.each(list)('$name', ({ start }) => {
    const url = start()
    let page!: Page
    let unuse: () => Promise<void>

    beforeAll(async () => {
      page = await browser.newPage({
        viewport: {
          width: 1280,
          height: 800
        }
      })

      unuse = await useNetworkMemoryCache(page, [
        RICK_AND_MORTY_API_JSON
      ])
    })

    afterAll(async () => {
      await unuse()
      await page?.close()
    })

    it('should redirect home route to characters', async () => {
      await openPage(page, url)

      await expect.poll(() => new URL(page.url()).pathname).toBe('/characters')
    })

    it('should render characters list', async () => {
      await openPage(page, url, '/characters')

      await page.getByRole('heading', {
        name: 'Rick and Morty'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'Rick Sanchez'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should navigate characters list to page 2 in browser', async () => {
      const documentRequests: string[] = []
      const onRequest = (request: Request) => {
        if (request.resourceType() === 'document') {
          documentRequests.push(request.url())
        }
      }

      await page.getByRole('heading', {
        name: 'Rick Sanchez'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      page.on('request', onRequest)

      try {
        await page.getByRole('link', {
          name: 'Go to page 2'
        }).click()

        await expect.poll(() => new URL(page.url()).searchParams.get('page'), {
          timeout: UI_TIMEOUT
        }).toBe('2')
        await page.getByRole('heading', {
          name: 'Aqua Morty'
        }).first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect(page.getByRole('heading', {
          name: 'Rick Sanchez'
        }).count()).resolves.toBe(0)

        expect(documentRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should render characters list page 2 from direct load', async () => {
      await openPage(page, url, '/characters?page=2')

      await expect.poll(() => new URL(page.url()).searchParams.get('page'), {
        timeout: UI_TIMEOUT
      }).toBe('2')
      await page.getByRole('heading', {
        name: 'Aqua Morty'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect(page.getByRole('heading', {
        name: 'Rick Sanchez'
      }).count()).resolves.toBe(0)
    })

    it('should render character detail with related episodes', async () => {
      await openPage(page, url, '/character/1')

      await page.getByRole('heading', {
        name: 'Rick Sanchez'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect(page.getByText('Alive - Human').isVisible()).resolves.toBe(true)
      await expect(page.getByText('Gender: Male').isVisible()).resolves.toBe(true)
      await expect(page.getByRole('heading', {
        name: 'Origin'
      }).isVisible()).resolves.toBe(true)
      await expect(page.getByRole('heading', {
        name: 'Last known location'
      }).isVisible()).resolves.toBe(true)
      await expect(page.getByRole('heading', {
        name: /Episodes \(\d+\)/
      }).isVisible()).resolves.toBe(true)
      await page.getByRole('heading', {
        name: 'Pilot'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should render episodes list', async () => {
      await openPage(page, url, '/episodes')

      await page.getByRole('heading', {
        name: 'Rick and Morty'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'Pilot'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should navigate episodes list to page 2 in browser', async () => {
      const documentRequests: string[] = []
      const onRequest = (request: Request) => {
        if (request.resourceType() === 'document') {
          documentRequests.push(request.url())
        }
      }

      await page.getByRole('heading', {
        name: 'Pilot'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      page.on('request', onRequest)

      try {
        await page.getByRole('link', {
          name: 'Go to page 2'
        }).click()

        await expect.poll(() => new URL(page.url()).searchParams.get('page'), {
          timeout: UI_TIMEOUT
        }).toBe('2')
        await page.getByRole('heading', {
          name: 'The Wedding Squanchers'
        }).first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect(page.getByRole('heading', {
          name: 'Pilot'
        }).count()).resolves.toBe(0)

        expect(documentRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should render episodes list page 2 from direct load', async () => {
      await openPage(page, url, '/episodes?page=2')

      await expect.poll(() => new URL(page.url()).searchParams.get('page'), {
        timeout: UI_TIMEOUT
      }).toBe('2')
      await page.getByRole('heading', {
        name: 'The Wedding Squanchers'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect(page.getByRole('heading', {
        name: 'Pilot'
      }).count()).resolves.toBe(0)
    })

    it('should render episode detail with related characters', async () => {
      await openPage(page, url, '/episode/1')

      await page.getByRole('heading', {
        name: 'Pilot'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect(page.getByText('S01E01').isVisible()).resolves.toBe(true)
      await expect(page.getByText('December 2, 2013').isVisible()).resolves.toBe(true)
      await expect(page.getByRole('heading', {
        name: /Characters \(\d+\)/
      }).isVisible()).resolves.toBe(true)
      await page.getByRole('heading', {
        name: 'Rick Sanchez'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should render locations list', async () => {
      await openPage(page, url, '/locations')

      await page.getByRole('heading', {
        name: 'Rick and Morty'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'Earth (C-137)'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should navigate locations list to page 2 in browser', async () => {
      const documentRequests: string[] = []
      const onRequest = (request: Request) => {
        if (request.resourceType() === 'document') {
          documentRequests.push(request.url())
        }
      }

      await page.getByRole('heading', {
        name: 'Earth (C-137)'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      page.on('request', onRequest)

      try {
        await page.getByRole('link', {
          name: 'Go to page 2'
        }).click()

        await expect.poll(() => new URL(page.url()).searchParams.get('page'), {
          timeout: UI_TIMEOUT
        }).toBe('2')
        await page.getByRole('heading', {
          name: 'Testicle Monster Dimension'
        }).first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect(page.getByRole('heading', {
          name: 'Earth (C-137)'
        }).count()).resolves.toBe(0)

        expect(documentRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should render locations list page 2 from direct load', async () => {
      await openPage(page, url, '/locations?page=2')

      await expect.poll(() => new URL(page.url()).searchParams.get('page'), {
        timeout: UI_TIMEOUT
      }).toBe('2')
      await page.getByRole('heading', {
        name: 'Testicle Monster Dimension'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect(page.getByRole('heading', {
        name: 'Earth (C-137)'
      }).count()).resolves.toBe(0)
    })

    it('should render location detail with related residents', async () => {
      await openPage(page, url, '/location/1')

      await page.getByRole('heading', {
        name: 'Earth (C-137)'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect(page.getByText('Planet').isVisible()).resolves.toBe(true)
      await expect(page.getByText('Dimension C-137').isVisible()).resolves.toBe(true)
      await expect(page.getByRole('heading', {
        name: /Residents \(\d+\)/
      }).isVisible()).resolves.toBe(true)
      await page.getByRole('heading', {
        name: 'Beth Smith'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should navigate top nav in browser', async () => {
      const documentRequests: string[] = []
      const preloadRequests: string[] = []
      const onRequest = (request: Request) => {
        if (request.resourceType() === 'document') {
          documentRequests.push(request.url())
        }

        if (request.resourceType() === 'script') {
          preloadRequests.push(request.url())
        }
      }
      const TOP_NAV_LINKS = [
        'Characters',
        'Locations',
        'Episodes'
      ] as const

      try {
        await openPage(page, url, '/characters')

        page.on('request', onRequest)

        for (let i = 0, linkName: string, nextLinkName: string; i < TOP_NAV_LINKS.length; i++) {
          linkName = TOP_NAV_LINKS[i]
          nextLinkName = TOP_NAV_LINKS[i + 1]

          if (i === 0) {
            await page.locator('article > a').first().waitFor({
              state: 'visible',
              timeout: UI_TIMEOUT
            })
          }

          await expect.poll(
            async () => await page.$$eval(
              'header nav a[aria-current="page"]',
              links => links.map(link => link.textContent?.trim())
            ),
            {
              timeout: UI_TIMEOUT
            }
          ).toEqual([linkName])

          if (nextLinkName) {
            preloadRequests.length = 0

            await page.getByRole('link', {
              name: nextLinkName
            }).first().hover()

            await expect.poll(() => preloadRequests.length, {
              timeout: UI_TIMEOUT
            }).toBeGreaterThan(0)

            await page.getByRole('link', {
              name: nextLinkName
            }).first().click()
            await page.locator('article > a').first().waitFor({
              state: 'visible',
              timeout: UI_TIMEOUT
            })
          }
        }

        expect(documentRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should use query cache when navigating back to characters list', async () => {
      const requests: string[] = []
      const onRequest = (request: Request) => {
        if (request.url().toLowerCase().endsWith('/api/character/page/1.json')) {
          requests.push(request.url())
        }
      }

      page.on('request', onRequest)

      try {
        await openPage(page, url, '/characters')
        await page.locator('article > a').first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        await page.getByRole('link', {
          name: 'Go to page 2'
        }).click()
        await expect.poll(() => new URL(page.url()).searchParams.get('page'), {
          timeout: UI_TIMEOUT
        }).toBe('2')
        await page.locator('article > a').first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        requests.length = 0

        await page.getByRole('link', {
          name: 'Go to page 1'
        }).click()
        await page.getByRole('heading', {
          name: 'Rick Sanchez'
        }).first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        expect(requests.length).toBe(0)
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should use query cache when returning to character detail', async () => {
      const requests: string[] = []
      const onRequest = (request: Request) => {
        if (request.url().toLowerCase().endsWith('character/1.json')) {
          requests.push(request.url())
        }
      }

      page.on('request', onRequest)

      try {
        await openPage(page, url, '/character/1')
        await page.getByRole('heading', {
          name: 'Rick Sanchez'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await page.getByRole('heading', {
          name: 'Pilot'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        await page.getByRole('link', {
          name: 'Characters'
        }).first().click()
        await page.locator('article > a').first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        requests.length = 0

        await page.locator('article > a[href="/character/1"]').first().click()
        await page.getByRole('heading', {
          name: 'Rick Sanchez'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await page.getByRole('heading', {
          name: 'Pilot'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        expect(requests.length).toBe(0)
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should update characters pagination state across page changes', async () => {
      const documentRequests: string[] = []
      const onRequest = (request: Request) => {
        if (request.resourceType() === 'document') {
          documentRequests.push(request.url())
        }
      }
      const expectCurrentPage = async (pageNumber: string) => {
        await expect.poll(
          async () => await page.$$eval(
            'nav[aria-label="Character pages navigation"] a[aria-current="page"]',
            links => links.map(link => link.textContent?.trim())
          ),
          {
            timeout: UI_TIMEOUT
          }
        ).toEqual([pageNumber])
      }

      await openPage(page, url, '/characters')
      await page.getByRole('heading', {
        name: 'Rick Sanchez'
      }).first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      page.on('request', onRequest)

      try {
        await expectCurrentPage('1')

        for (const pageNumber of [2, 3, 2, 1]) {
          await page.getByRole('link', {
            name: `Go to page ${pageNumber}`
          }).click()

          await expect.poll(() => new URL(page.url()).searchParams.get('page') || '1', {
            timeout: UI_TIMEOUT
          }).toBe(String(pageNumber))
          await expectCurrentPage(String(pageNumber))
        }

        expect(documentRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })
  })
})
