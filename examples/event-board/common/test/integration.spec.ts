import { join } from 'node:path'
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it
} from 'vitest'
import {
  type Browser,
  type Locator,
  type Page,
  type Request,
  chromium
} from 'playwright'
import { implementations } from '../../../common/test/integration-test-utils.js'

const EVENT_BOARD_API_PATTERN = /\/api\/events(?:[/?]|$)/
const SEARCH_DEBOUNCE_TIMEOUT = 700
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
      timeout: UI_TIMEOUT
    })
  }

  return null
}

async function numberText(locator: Locator) {
  return Number((await locator.textContent())?.match(/\d+/)?.[0])
}

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  await browser?.close()
})

describe('Event Board App', async () => {
  const list = await implementations({
    self: import.meta.dirname,
    root: join(import.meta.dirname, '..', '..')
  })

  describe.each(list)('$name', ({ start }) => {
    const url = start()
    let page!: Page

    beforeAll(async () => {
      page = await browser.newPage({
        viewport: {
          width: 1280,
          height: 800
        }
      })

      await url
    })

    afterAll(async () => {
      await page?.close()
    })

    it('should render home events list', async () => {
      await openPage(page, url)

      await expect.poll(() => page.title(), {
        timeout: UI_TIMEOUT
      }).toBe('Upcoming events | Event Board')
      await page.locator('article.event-card > h2 a').first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'Find your next frontend event'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'Frontend Meetup: Spring Edition'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'State Management Webinar'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should load more events', async () => {
      const apiRequests: string[] = []
      const onRequest = (request: Request) => {
        const requestUrl = request.url()

        if (EVENT_BOARD_API_PATTERN.test(requestUrl)) {
          apiRequests.push(requestUrl)
        }
      }

      await page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      page.on('request', onRequest)

      try {
        await page.getByRole('button', {
          name: 'Load more'
        }).click()

        await page.getByRole('heading', {
          name: 'Vite Plugin Night'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await page.getByRole('heading', {
          name: 'Web Platform Conference'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await page.getByRole('heading', {
          name: 'Hydration Deep Dive'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        expect(apiRequests.some(requestUrl => new URL(requestUrl).searchParams.has('cursor'))).toBe(true)
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should keep loaded events page after detail back navigation', async () => {
      const cursorRequests: string[] = []
      const onRequest = (request: Request) => {
        const requestUrl = request.url()

        if (
          EVENT_BOARD_API_PATTERN.test(requestUrl)
          && new URL(requestUrl).searchParams.has('cursor')
        ) {
          cursorRequests.push(requestUrl)
        }
      }

      await page.getByRole('heading', {
        name: 'Vite Plugin Night'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      page.on('request', onRequest)

      try {
        await page.getByRole('link', {
          name: 'Vite Plugin Night'
        }).click()

        await expect.poll(() => new URL(page.url()).pathname, {
          timeout: UI_TIMEOUT
        }).toBe('/events/vite-plugin-night')
        await page.getByRole('button', {
          name: "I'm going"
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect.poll(() => page.title(), {
          timeout: UI_TIMEOUT
        }).toBe('Vite Plugin Night | Event Board')

        await page.getByRole('link', {
          name: 'Back to events'
        }).click()

        await expect.poll(() => new URL(page.url()).pathname, {
          timeout: UI_TIMEOUT
        }).toBe('/')
        await page.getByRole('heading', {
          name: 'Vite Plugin Night'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await page.getByRole('heading', {
          name: 'Hydration Deep Dive'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect.poll(() => page.title(), {
          timeout: UI_TIMEOUT
        }).toBe('Upcoming events | Event Board')

        expect(cursorRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should filter events by search in browser', async () => {
      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/')

      await page.getByLabel('Search').fill('vite')

      await expect.poll(() => new URL(page.url()).searchParams.get('q'), {
        timeout: UI_TIMEOUT
      }).toBe('vite')
      await page.getByRole('heading', {
        name: 'Vite Plugin Night'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).count(), {
        timeout: UI_TIMEOUT
      }).toBe(0)
    })

    it('should render search filter from direct load', async () => {
      await openPage(page, url, '/?q=vite')

      await expect.poll(() => new URL(page.url()).searchParams.get('q'), {
        timeout: UI_TIMEOUT
      }).toBe('vite')
      await expect.poll(() => page.getByLabel('Search').inputValue(), {
        timeout: UI_TIMEOUT
      }).toBe('vite')
      await page.getByRole('heading', {
        name: 'Vite Plugin Night'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).count(), {
        timeout: UI_TIMEOUT
      }).toBe(0)
    })

    it('should filter events by category in browser', async () => {
      await openPage(page, url)

      await page.getByLabel('Category').selectOption('meetup')

      await expect.poll(() => new URL(page.url()).searchParams.get('category'), {
        timeout: UI_TIMEOUT
      }).toBe('meetup')
      await page.getByRole('heading', {
        name: 'Frontend Meetup: Spring Edition'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'Vite Plugin Night'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).count(), {
        timeout: UI_TIMEOUT
      }).toBe(0)
    })

    it('should render category filter from direct load', async () => {
      await openPage(page, url, '/?category=webinar')

      await expect.poll(() => new URL(page.url()).searchParams.get('category'), {
        timeout: UI_TIMEOUT
      }).toBe('webinar')
      await expect.poll(() => page.getByLabel('Category').inputValue(), {
        timeout: UI_TIMEOUT
      }).toBe('webinar')
      await page.getByRole('heading', {
        name: 'State Management Webinar'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('heading', {
        name: 'Hydration Deep Dive'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).count(), {
        timeout: UI_TIMEOUT
      }).toBe(0)
    })

    it('should render no results for combined filters', async () => {
      await openPage(page, url, '/?q=does-not-exist&category=conference')

      await expect.poll(() => new URL(page.url()).searchParams.get('q'), {
        timeout: UI_TIMEOUT
      }).toBe('does-not-exist')
      await expect.poll(() => new URL(page.url()).searchParams.get('category'), {
        timeout: UI_TIMEOUT
      }).toBe('conference')
      await page.getByText('No events found. Try another search or category.').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.locator('article.event-card').count(), {
        timeout: UI_TIMEOUT
      }).toBe(0)
    })

    it('should render event detail', async () => {
      await openPage(page, url, '/events/react-ssr-workshop')

      await expect.poll(() => page.title(), {
        timeout: UI_TIMEOUT
      }).toBe('React SSR Workshop | Event Board')
      await page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByText('workshop', {
        exact: true
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByText('A hands-on workshop about server rendering, hydration, and app architecture.').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('button', {
        name: "I'm going"
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should render not found event detail', async () => {
      await openPage(page, url, '/events/not-a-real-event')

      await page.getByRole('heading', {
        name: 'Event not found'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByText('not-a-real-event').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('link', {
        name: 'Back to events'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should navigate to event detail in browser', async () => {
      const documentRequests: string[] = []
      const onRequest = (request: Request) => {
        if (request.resourceType() === 'document') {
          documentRequests.push(request.url())
        }
      }

      await openPage(page, url)
      await page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      page.on('request', onRequest)

      try {
        await page.getByRole('link', {
          name: 'React SSR Workshop'
        }).click()

        await expect.poll(() => new URL(page.url()).pathname, {
          timeout: UI_TIMEOUT
        }).toBe('/events/react-ssr-workshop')
        await page.getByRole('heading', {
          name: 'React SSR Workshop'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await page.getByRole('button', {
          name: "I'm going"
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect.poll(() => page.title(), {
          timeout: UI_TIMEOUT
        }).toBe('React SSR Workshop | Event Board')

        expect(documentRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should reuse event detail cache after back navigation', async () => {
      const detailRequests: string[] = []
      const onRequest = (request: Request) => {
        const requestUrl = request.url()

        if (requestUrl.includes('/api/events/react-ssr-workshop')) {
          detailRequests.push(requestUrl)
        }
      }

      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/events/react-ssr-workshop')

      page.on('request', onRequest)

      try {
        await page.getByRole('link', {
          name: 'Back to events'
        }).click()

        await expect.poll(() => new URL(page.url()).pathname, {
          timeout: UI_TIMEOUT
        }).toBe('/')
        await page.getByRole('heading', {
          name: 'React SSR Workshop'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await page.getByRole('heading', {
          name: 'State Management Webinar'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        await page.getByRole('link', {
          name: 'React SSR Workshop'
        }).click()

        await expect.poll(() => new URL(page.url()).pathname, {
          timeout: UI_TIMEOUT
        }).toBe('/events/react-ssr-workshop')
        await page.getByRole('button', {
          name: "I'm going"
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        expect(detailRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should optimistically update RSVP and sync the list entity', async () => {
      const goingCount = page.locator('.details-panel dt').filter({
        hasText: /^Going$/
      }).locator('xpath=following-sibling::dd')
      const workshopCard = page.locator('article.event-card').filter({
        hasText: 'React SSR Workshop'
      })
      const attendees = workshopCard.locator('.event-card__footer span').filter({
        hasText: /going$/
      })
      const initialCount = await numberText(goingCount)
      const response = page.waitForResponse(
        item => item.url().includes('/api/events/1/rsvp') && item.request().method() === 'POST'
      )

      await page.getByRole('button', {
        name: "I'm going"
      }).click()

      await expect.poll(() => numberText(goingCount), {
        timeout: UI_TIMEOUT
      }).toBe(initialCount + 1)

      await response

      await expect.poll(() => numberText(goingCount), {
        timeout: UI_TIMEOUT
      }).toBe(initialCount + 1)

      await page.getByRole('link', {
        name: 'Back to events'
      }).click()

      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/')

      await page.getByRole('heading', {
        name: 'React SSR Workshop'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => numberText(attendees), {
        timeout: UI_TIMEOUT
      }).toBe(initialCount + 1)
    })

    it('should redirect anonymous visitor from new event page to login', async () => {
      await openPage(page, url, '/events/new')

      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/login')
      await page.getByRole('heading', {
        name: 'Log in'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.title(), {
        timeout: UI_TIMEOUT
      }).toBe('Log in | Event Board')
    })

    it('should redirect anonymous visitor to login on client-side navigation', async () => {
      await openPage(page, url)
      await page.locator('article.event-card').first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('link', {
        name: 'New event'
      }).click()

      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/login')
      await page.getByRole('heading', {
        name: 'Log in'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should login a demo user', async () => {
      await page.getByLabel('Username').fill('ada')
      await page.getByLabel('Password').fill('lovelace')
      await page.getByRole('button', {
        name: 'Log in'
      }).click()

      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/')
      await page.getByText('Ada Lovelace').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('button', {
        name: 'Log out'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should render new event page', async () => {
      await openPage(page, url, '/events/new')

      await expect.poll(() => page.title(), {
        timeout: UI_TIMEOUT
      }).toBe('New event | Event Board')
      await page.getByRole('heading', {
        name: 'Create an event'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByLabel('Title').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByLabel('Description').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByLabel('Date and time').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByLabel('Category').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByLabel('Location').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect(page.getByRole('button', {
        name: 'Create event'
      }).isDisabled()).resolves.toBe(true)
    })

    it('should validate new event form', async () => {
      const createButton = page.getByRole('button', {
        name: 'Create event'
      })

      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/events/new')
      await expect(createButton.isDisabled()).resolves.toBe(true)

      await page.getByLabel('Title').fill('Validation draft')

      await expect(createButton.isDisabled()).resolves.toBe(true)
    })

    it('should fill new event form with keyboard mock', async () => {
      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/events/new')

      await page.keyboard.press('Control+M')

      await expect.poll(() => page.getByLabel('Title').inputValue(), {
        timeout: UI_TIMEOUT
      }).toBe('Frontend Architecture Night')
      await expect.poll(() => page.getByLabel('Description').inputValue(), {
        timeout: UI_TIMEOUT
      }).toBe('Short talks about SSR, routing, query caching, and pragmatic app architecture.')
      await expect.poll(() => page.getByLabel('Date and time').inputValue(), {
        timeout: UI_TIMEOUT
      }).not.toBe('')
      await expect.poll(() => page.getByLabel('Location').inputValue(), {
        timeout: UI_TIMEOUT
      }).toBe('Online')
      await expect.poll(() => page.getByLabel('Category').inputValue(), {
        timeout: UI_TIMEOUT
      }).toBe('meetup')
    })

    it('should create a new event', async () => {
      const response = page.waitForResponse(
        item => item.url().endsWith('/api/events') && item.request().method() === 'POST'
      )

      await expect.poll(() => page.getByLabel('Title').inputValue(), {
        timeout: UI_TIMEOUT
      }).toBe('Frontend Architecture Night')

      await page.getByRole('button', {
        name: 'Create event'
      }).click()

      const createdResponse = await response
      const created = await createdResponse.json() as {
        slug: string
        title: string
      }

      expect(created.title).toBe('Frontend Architecture Night')
      expect(created.slug).toBe('frontend-architecture-night')

      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/events/frontend-architecture-night')
      await page.getByRole('heading', {
        name: 'Frontend Architecture Night'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByText('Short talks about SSR, routing, query caching, and pragmatic app architecture.').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should show newly created event in the events list', async () => {
      const documentRequests: string[] = []
      const onRequest = (request: Request) => {
        if (request.resourceType() === 'document') {
          documentRequests.push(request.url())
        }
      }

      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/events/frontend-architecture-night')

      page.on('request', onRequest)

      try {
        await page.getByRole('link', {
          name: 'Back to events'
        }).click()

        await expect.poll(() => new URL(page.url()).pathname, {
          timeout: UI_TIMEOUT
        }).toBe('/')
        await page.getByRole('heading', {
          name: 'Frontend Architecture Night'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        expect(documentRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should restore the logged in user from the session cookie', async () => {
      await openPage(page, url)

      await page.getByText('Ada Lovelace').waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('button', {
        name: 'Log out'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should toggle personal attendance from the event page', async () => {
      await openPage(page, url, '/events/react-ssr-workshop')

      const attendees = page.locator('.details-panel dd').last()

      await page.getByRole('button', {
        name: "I'm going"
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      const initialCount = await numberText(attendees)

      await page.getByRole('button', {
        name: "I'm going"
      }).click()

      await expect.poll(() => numberText(attendees), {
        timeout: UI_TIMEOUT
      }).toBe(initialCount + 1)
      await page.getByRole('button', {
        name: "I'm not going"
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      await openPage(page, url, '/events/react-ssr-workshop')

      await page.getByRole('button', {
        name: "I'm not going"
      }).click()

      await expect.poll(() => numberText(attendees), {
        timeout: UI_TIMEOUT
      }).toBe(initialCount)
      await page.getByRole('button', {
        name: "I'm going"
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
    })

    it('should revert optimistic attendance on rsvp failure', async () => {
      await openPage(page, url, '/events/react-ssr-workshop')

      const attendees = page.locator('.details-panel dd').last()

      await page.getByRole('button', {
        name: "I'm going"
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      const initialCount = await numberText(attendees)

      await page.route('**/api/events/*/rsvp', route => route.abort())

      try {
        await page.getByRole('button', {
          name: "I'm going"
        }).click()

        await page.locator('.details-panel .notice_error').waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect.poll(() => numberText(attendees), {
          timeout: UI_TIMEOUT
        }).toBe(initialCount)
        await page.getByRole('button', {
          name: "I'm going"
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
      } finally {
        await page.unroute('**/api/events/*/rsvp')
      }
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
      const activeNav = async () => await page.$$eval(
        'header nav a[aria-current="page"]',
        links => links.map(link => link.textContent?.trim())
      )

      try {
        await openPage(page, url)
        await page.locator('article.event-card').first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        page.on('request', onRequest)

        await expect.poll(activeNav, {
          timeout: UI_TIMEOUT
        }).toEqual(['Events'])
        await expect.poll(() => page.title(), {
          timeout: UI_TIMEOUT
        }).toBe('Upcoming events | Event Board')

        preloadRequests.length = 0

        await page.getByRole('link', {
          name: 'New event'
        }).hover()

        await expect.poll(() => preloadRequests.length, {
          timeout: UI_TIMEOUT
        }).toBeGreaterThan(0)

        await page.getByRole('link', {
          name: 'New event'
        }).click()

        await page.getByRole('heading', {
          name: 'Create an event'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect.poll(activeNav, {
          timeout: UI_TIMEOUT
        }).toEqual(['New event'])
        await expect.poll(() => page.title(), {
          timeout: UI_TIMEOUT
        }).toBe('New event | Event Board')

        await page.getByRole('link', {
          name: 'Events'
        }).click()

        await page.locator('article.event-card').first().waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect.poll(activeNav, {
          timeout: UI_TIMEOUT
        }).toEqual(['Events'])
        await expect.poll(() => page.title(), {
          timeout: UI_TIMEOUT
        }).toBe('Upcoming events | Event Board')

        expect(documentRequests).toEqual([])
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should use query cache for repeated filters', async () => {
      const viteRequests: string[] = []
      const onRequest = (request: Request) => {
        const requestUrl = request.url()

        if (
          EVENT_BOARD_API_PATTERN.test(requestUrl)
          && new URL(requestUrl).searchParams.get('q') === 'vite'
        ) {
          viteRequests.push(requestUrl)
        }
      }

      await openPage(page, url)
      await page.locator('article.event-card').first().waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      page.on('request', onRequest)

      try {
        await page.getByLabel('Search').fill('vite')

        await expect.poll(() => new URL(page.url()).searchParams.get('q'), {
          timeout: UI_TIMEOUT
        }).toBe('vite')
        await page.getByRole('heading', {
          name: 'Vite Plugin Night'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await expect.poll(() => viteRequests.length, {
          timeout: UI_TIMEOUT
        }).toBe(1)

        await page.getByLabel('Search').fill('')

        await expect.poll(() => page.getByLabel('Search').inputValue(), {
          timeout: UI_TIMEOUT
        }).toBe('')
        await page.getByRole('heading', {
          name: 'React SSR Workshop'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })

        await page.getByLabel('Search').fill('vite')

        await expect.poll(() => new URL(page.url()).searchParams.get('q'), {
          timeout: UI_TIMEOUT
        }).toBe('vite')
        await page.getByRole('heading', {
          name: 'Vite Plugin Night'
        }).waitFor({
          state: 'visible',
          timeout: UI_TIMEOUT
        })
        await page.waitForTimeout(SEARCH_DEBOUNCE_TIMEOUT)

        expect(viteRequests).toHaveLength(1)
      } finally {
        page.off('request', onRequest)
      }
    })

    it('should logout from the header', async () => {
      await openPage(page, url)
      await page.getByRole('button', {
        name: 'Log out'
      }).click()

      await page.getByRole('link', {
        name: 'Log in'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.getByText('Ada Lovelace').count(), {
        timeout: UI_TIMEOUT
      }).toBe(0)
    })

    it('should render styled not found page for unknown routes', async () => {
      await openPage(page, url, '/not-a-real-route')

      await expect.poll(() => page.title(), {
        timeout: UI_TIMEOUT
      }).toBe('Page not found | Event Board')
      await page.getByRole('heading', {
        name: 'Page not found'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('link', {
        name: 'Back to events'
      }).click()
      await expect.poll(() => new URL(page.url()).pathname, {
        timeout: UI_TIMEOUT
      }).toBe('/')
    })

    it('should render Russian messages for a Russian browser locale', async () => {
      await page.close()

      page = await browser.newPage({
        viewport: {
          width: 1280,
          height: 800
        },
        locale: 'ru'
      })

      await openPage(page, url)

      await expect.poll(() => page.title(), {
        timeout: UI_TIMEOUT
      }).toBe('События | Доска Событий')
      await page.getByRole('heading', {
        name: 'Найдите следующее frontend-событие'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.locator('html').getAttribute('lang'), {
        timeout: UI_TIMEOUT
      }).toBe('ru')
    })

    it('should persist locale across document reloads', async () => {
      await page.getByRole('button', {
        name: 'EN'
      }).click()

      await page.getByRole('heading', {
        name: 'Find your next frontend event'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('link', {
        name: 'Events'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('link', {
        name: 'New event'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.title(), {
        timeout: UI_TIMEOUT
      }).toBe('Upcoming events | Event Board')
      await expect.poll(() => page.locator('html').getAttribute('lang'), {
        timeout: UI_TIMEOUT
      }).toBe('en')

      await page.reload({
        waitUntil: 'domcontentloaded',
        timeout: UI_TIMEOUT
      })

      await page.getByRole('heading', {
        name: 'Find your next frontend event'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('link', {
        name: 'Events'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await page.getByRole('link', {
        name: 'New event'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => page.title(), {
        timeout: UI_TIMEOUT
      }).toBe('Upcoming events | Event Board')
      await expect.poll(() => page.locator('html').getAttribute('lang'), {
        timeout: UI_TIMEOUT
      }).toBe('en')
    })

    it('should format localized home plural and date messages', async () => {
      await page.getByRole('button', {
        name: 'RU'
      }).click()

      await page.getByRole('heading', {
        name: 'Найдите следующее frontend-событие'
      }).waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })

      const expectedDate = await page.evaluate(() => new Intl.DateTimeFormat('ru', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date('2026-05-12T18:00:00Z')))

      await openPage(page, url)

      const card = page.locator('article.event-card').filter({
        hasText: 'React SSR Workshop'
      })

      await card.waitFor({
        state: 'visible',
        timeout: UI_TIMEOUT
      })
      await expect.poll(() => card.locator('.event-card__meta span').nth(1).textContent(), {
        timeout: UI_TIMEOUT
      }).toBe(expectedDate)
      await expect.poll(() => card.locator('.event-card__footer span').last().textContent(), {
        timeout: UI_TIMEOUT
      }).toBe('25 участников')
    })
  })
})
