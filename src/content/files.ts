import fs from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'

import {
  ContentValidationError,
  isPublishedMetadata,
  validateEntryMetadata,
  type EntryMetadata,
  type PublishedEntryMetadata,
} from './schema'

/**
 * Filesystem boundary for the owned content domain. This module may only
 * depend on `node:fs/promises`, `node:path`, `gray-matter`, and the schema.
 * It returns metadata-only index entries — file bodies never cross this
 * boundary; routes compile MDX bodies through the framework instead.
 */

export type ContentEntry = {
  slug: string
  /** Absolute path to the source file, for actionable error messages. */
  sourcePath: string
  metadata: EntryMetadata
}

export type PublishedContentEntry = ContentEntry & {
  metadata: PublishedEntryMetadata
}

export type EntryRouteParams = { slug: string }

/** Structurally compatible with `FeedEntry` in `src/lib/feed.ts`. */
export type FeedEntryProjection = {
  title: string
  summary: string
  publishedAt: string
  canonicalUrl: string
  isPublished: true
}

export type SitemapEntryProjection = {
  url: string
  lastModified: string
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function findMdxFiles(directory: string): Promise<string[]> {
  const dirents = await fs.readdir(directory, { withFileTypes: true })
  const files: string[] = []
  // Sort directory listings so discovery order never depends on the
  // filesystem; final ordering is by date, but error output stays stable too.
  for (const dirent of [...dirents].sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    const entryPath = path.join(directory, dirent.name)
    if (dirent.isDirectory()) {
      files.push(...(await findMdxFiles(entryPath)))
    } else if (dirent.isFile() && dirent.name.endsWith('.mdx')) {
      files.push(entryPath)
    }
    // Entries that are neither regular files nor directories (e.g. symlinks)
    // are intentionally not supported and fall through here.
  }
  return files
}

function deriveSlug(filePath: string): string {
  return path.basename(filePath, '.mdx')
}

/**
 * Slugs are interpolated verbatim into route paths, RSS links, and sitemap
 * URLs, so only lowercase kebab-case basenames are allowed.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Newest first by publication date; entries without a date (drafts) sort
 * first, and ties break on slug ascending so ordering is deterministic.
 */
function compareEntries(a: ContentEntry, b: ContentEntry): number {
  const aTime = a.metadata.publishedAt
    ? Date.parse(a.metadata.publishedAt)
    : Number.POSITIVE_INFINITY
  const bTime = b.metadata.publishedAt
    ? Date.parse(b.metadata.publishedAt)
    : Number.POSITIVE_INFINITY
  if (aTime !== bTime) return aTime > bTime ? -1 : 1
  return a.slug.localeCompare(b.slug)
}

/**
 * Discover, parse, and validate every `.mdx` file under `contentRoot`
 * (recursively). Validation problems are aggregated across files so authors
 * can fix more than one file per run; every error line carries the source
 * path and failing field.
 */
export async function loadEntries(
  contentRoot: string
): Promise<ContentEntry[]> {
  let filePaths: string[]
  try {
    filePaths = await findMdxFiles(contentRoot)
  } catch (error) {
    throw new ContentValidationError([
      `${contentRoot}: content root cannot be read (${describeError(error)})`,
    ])
  }

  const entries: ContentEntry[] = []
  const errors: string[] = []
  const slugSources = new Map<string, string>()

  for (const sourcePath of filePaths) {
    // Read + parse per file inside try/catch so an unreadable file or
    // malformed YAML becomes one aggregated error entry instead of aborting
    // the whole load and hiding every other file's problems. The two failure
    // modes carry distinct labels: `read:` for filesystem errors,
    // `frontmatter:` for YAML parse errors.
    let rawFile: string
    try {
      rawFile = await fs.readFile(sourcePath, 'utf8')
    } catch (error) {
      errors.push(`${sourcePath}: read: ${describeError(error)}`)
      continue
    }

    let data: unknown
    try {
      ;({ data } = matter(rawFile))
    } catch (error) {
      errors.push(`${sourcePath}: frontmatter: ${describeError(error)}`)
      continue
    }

    const result = validateEntryMetadata(data, sourcePath)
    if (!result.ok) {
      errors.push(...result.errors)
      continue
    }

    const slug = deriveSlug(sourcePath)
    if (!SLUG_PATTERN.test(slug)) {
      errors.push(
        `${sourcePath}: slug: "${slug}" is not URL-safe; rename the file to lowercase kebab-case (${SLUG_PATTERN.source})`
      )
      continue
    }

    const existingSource = slugSources.get(slug)
    if (existingSource !== undefined) {
      errors.push(
        `${sourcePath}: slug: duplicate slug "${slug}" already used by ${existingSource}`
      )
      continue
    }
    slugSources.set(slug, sourcePath)

    entries.push({ slug, sourcePath, metadata: result.metadata })
  }

  if (errors.length > 0) {
    throw new ContentValidationError(errors)
  }

  return entries.sort(compareEntries)
}

/** Route path for an entry under the unified /writing index. */
export function entryRoutePath(slug: string): string {
  return `/writing/${slug}`
}

/** The one canonical URL builder feeding metadata, RSS, sitemap, and JSON-LD. */
export function canonicalEntryUrl(siteUrl: string, slug: string): string {
  return `${siteUrl.replace(/\/+$/, '')}${entryRoutePath(slug)}`
}

/** Published entries only — the projection for indexes, feeds, and sitemaps. */
export function selectPublished(
  entries: ContentEntry[]
): PublishedContentEntry[] {
  return entries.filter((entry): entry is PublishedContentEntry =>
    isPublishedMetadata(entry.metadata)
  )
}

/**
 * Entries that may resolve to a route. Drafts are only routable when
 * explicitly included (development preview); production stays published-only.
 */
export function selectRoutable(
  entries: ContentEntry[],
  options: { includeDrafts: boolean }
): ContentEntry[] {
  return options.includeDrafts ? [...entries] : selectPublished(entries)
}

export function toRouteParams(entries: ContentEntry[]): EntryRouteParams[] {
  return entries.map((entry) => ({ slug: entry.slug }))
}

export function toFeedEntries(
  entries: ContentEntry[],
  siteUrl: string
): FeedEntryProjection[] {
  return selectPublished(entries).map((entry) => ({
    title: entry.metadata.title,
    summary: entry.metadata.summary,
    publishedAt: entry.metadata.publishedAt,
    canonicalUrl: canonicalEntryUrl(siteUrl, entry.slug),
    isPublished: true,
  }))
}

export function toSitemapEntries(
  entries: ContentEntry[],
  siteUrl: string
): SitemapEntryProjection[] {
  return selectPublished(entries).map((entry) => ({
    url: canonicalEntryUrl(siteUrl, entry.slug),
    lastModified: entry.metadata.updatedAt ?? entry.metadata.publishedAt,
  }))
}
