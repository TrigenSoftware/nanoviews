export const VIRTUA_ID = 'virtual:attach-chunkname'

export const RESOLVED_VIRTUAL_ID = `\0${VIRTUA_ID}`

export const CODE = `
export function __attachChunkname(promise, chunk) {
  return promise.then(module => ({
    ...module,
    __chunks: [chunk]
  }))
}
`

export const IMPORT = `import { __attachChunkname } from '${VIRTUA_ID}';\n`

/**
 * @param {string} imp
 * @param {string} chunkname
 * @returns {string}
 */
export const INVOKE = (imp, chunkname) => `__attachChunkname(${imp}, ${JSON.stringify(chunkname)})`
