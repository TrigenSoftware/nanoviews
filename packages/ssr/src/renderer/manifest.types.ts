export interface ManifestOptions {
  base?: string
  manifestPath?: string
}

export interface ManifestChunk {
  /**
   * The input file name of this chunk / asset if known
   */
  src?: string
  /**
   * The output file name of this chunk / asset
   */
  file: string
  /**
   * The list of CSS files imported by this chunk
   *
   * This field is only present in JS chunks.
   */
  css?: string[]
  /**
   * The list of asset files imported by this chunk, excluding CSS files
   *
   * This field is only present in JS chunks.
   */
  assets?: string[]
  /**
   * Whether this chunk or asset is an entry point
   */
  isEntry?: boolean
  /**
   * The name of this chunk / asset if known
   */
  name?: string
  /**
   * Whether this chunk is a dynamic entry point
   *
   * This field is only present in JS chunks.
   */
  isDynamicEntry?: boolean
  /**
   * The list of statically imported chunks by this chunk
   *
   * The values are the keys of the manifest. This field is only present in JS chunks.
   */
  imports?: string[]
  /**
   * The list of dynamically imported chunks by this chunk
   *
   * The values are the keys of the manifest. This field is only present in JS chunks.
   */
  dynamicImports?: string[]
}

export type ManifestRecord = Record<string, ManifestChunk>
