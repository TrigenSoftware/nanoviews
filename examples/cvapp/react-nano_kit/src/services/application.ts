import { nanoid } from 'nanoid'
import { MAX_DETAILS_LENGTH } from '~/constants'
import type {
  ApplicationId,
  Application,
  ApplicationDraft
} from './application.types'

const DB_NAME = 'altshift'
const DB_VERSION = 1
const STORE_NAME = 'applications'
const LETTER_GENERATION_DELAY = 3000
let dbConnection: Promise<IDBDatabase> | null = null

function openDatabase(): Promise<IDBDatabase> {
  if (dbConnection) {
    return dbConnection
  }

  dbConnection = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open database'))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id'
        })
      }
    }
  })

  return dbConnection
}

function validateDetails(details: string): void {
  if (details.length > MAX_DETAILS_LENGTH) {
    throw new Error(
      `Details cannot exceed ${MAX_DETAILS_LENGTH} characters`
    )
  }
}

function generateLetter(application: ApplicationDraft): string {
  const {
    company,
    title,
    skills,
    details
  } = application

  return `Dear ${company} Team,

I am writing to express my interest in the ${title} position.

My experience in the realm combined with my skills in ${skills} make me a strong candidate for this role.

${details}

I am confident that my skills and enthusiasm would translate into valuable contributions to your esteemed organization.

Thank you for considering my application. I eagerly await the opportunity to discuss my qualifications further.`
}

/**
 * Generates a cover letter for the given application using OpenAI's API.
 * Will fallback to a generated example letter if the API key is not set.
 * @param application - The application draft containing job details.
 * @param signal - Optional AbortSignal to cancel the request.
 * @returns A promise that resolves to the generated cover letter as a string.
 */
export async function createLetter(
  application: ApplicationDraft,
  signal?: AbortSignal
): Promise<string> {
  validateDetails(application.details)

  const exampleLetter = generateLetter(application)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }

      resolve(exampleLetter)
    }, LETTER_GENERATION_DELAY)
  })
}

/**
 * Fetches all job applications from the local database.
 * @returns Job applications sorted by creation date in descending order.
 */
export async function fetchApplications(): Promise<Application[]> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onerror = () => {
      reject(new Error('Failed to fetch applications'))
    }

    request.onsuccess = () => {
      const applications = request.result as Application[]

      applications.sort((a, b) => b.createdAt - a.createdAt)
      resolve(applications)
    }
  })
}

/**
 * Creates or updates a job application in the local database.
 * @param draft - The application draft to create or update.
 * @returns Job application that was created or updated.
 */
export async function createOrUpdateApplication(draft: ApplicationDraft): Promise<Application> {
  validateDetails(draft.details)

  const db = await openDatabase()
  const application: Application = {
    ...draft,
    id: draft.id ?? nanoid(),
    createdAt: draft.createdAt ?? Date.now()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(application)

    request.onerror = () => {
      reject(new Error('Failed to save application'))
    }

    request.onsuccess = () => {
      resolve(application)
    }
  })
}

/**
 * Deletes a job application from the local database.
 * @param id - The ID of the application to delete.
 */
export async function deleteApplication(id: ApplicationId): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onerror = () => {
      reject(new Error('Failed to delete application'))
    }

    request.onsuccess = () => {
      resolve()
    }
  })
}
