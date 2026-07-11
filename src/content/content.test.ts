import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import type { FeedEntry } from '@/lib/feed'

import {
  canonicalEntryUrl,
  entryRoutePath,
  loadEntries,
  selectPublished,
  selectRoutable,
  toFeedEntries,
  toRouteParams,
  toSitemapEntries,
} from './files'
import {
  ContentValidationError,
  isPublishedMetadata,
  parseEntryMetadata,
  validateEntryMetadata,
  type EntryMetadata,
} from './schema'

const SOURCE_PATH = 'content/writing/example.mdx'

const validArticle = {
  kind: 'article',
  status: 'published',
  title: 'Owning the Content Pipeline',
  summary: 'Why this site now owns its content domain end to end.',
  publishedAt: '2026-03-10',
  updatedAt: '2026-04-01',
  tags: ['engineering', 'meta'],
  email: 'selected',
  substackUrl: 'https://seanoliver.substack.com/p/owning-the-content-pipeline',
  emailedAt: '2026-03-11',
}

const validNote = {
  kind: 'note',
  status: 'draft',
  title: 'A quick thought',
  summary: 'A short note about a small thing.',
}

/** Every failure-mode test asserts the same two error-quality invariants. */
function expectSingleError(raw: unknown, ...fragments: string[]): void {
  const result = validateEntryMetadata(raw, SOURCE_PATH)
  expect(result.ok).toBe(false)
  if (result.ok) return
  expect(result.errors.length).toBeGreaterThanOrEqual(1)
  for (const fragment of [SOURCE_PATH, ...fragments]) {
    expect(result.errors.join('\n')).toContain(fragment)
  }
}

describe('schema: valid metadata', () => {
  it('parses a fully specified published article', () => {
    const metadata = parseEntryMetadata(validArticle, SOURCE_PATH)

    expect(metadata).toEqual(validArticle)
  })

  it('parses a minimal draft note and applies defaults', () => {
    const metadata = parseEntryMetadata(validNote, SOURCE_PATH)

    expect(metadata.kind).toBe('note')
    expect(metadata.status).toBe('draft')
    expect(metadata.publishedAt).toBeUndefined()
    expect(metadata.tags).toEqual([])
    expect(metadata.email).toBe('never')
  })

  it('normalizes YAML Date objects to ISO date strings', () => {
    // gray-matter parses unquoted YAML dates (publishedAt: 2026-03-10)
    // into JavaScript Date instances; the schema must normalize them.
    const metadata = parseEntryMetadata(
      {
        ...validArticle,
        publishedAt: new Date('2026-03-10T00:00:00.000Z'),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
        emailedAt: new Date('2026-03-11T00:00:00.000Z'),
      },
      SOURCE_PATH
    )

    expect(metadata.publishedAt).toBe('2026-03-10')
    expect(metadata.updatedAt).toBe('2026-04-01')
    expect(metadata.emailedAt).toBe('2026-03-11')
  })

  it('allows email: selected without a substackUrl yet', () => {
    const metadata = parseEntryMetadata(
      { ...validNote, email: 'selected' },
      SOURCE_PATH
    )

    expect(metadata.email).toBe('selected')
  })
})

describe('schema: invalid metadata', () => {
  it('rejects an unknown kind, naming the field and file', () => {
    expectSingleError({ ...validArticle, kind: 'essay' }, 'kind')
  })

  it('rejects an unknown status, naming the field and file', () => {
    expectSingleError({ ...validArticle, status: 'live' }, 'status')
  })

  it('rejects a missing title, naming the field and file', () => {
    const { title: _title, ...withoutTitle } = validArticle
    expectSingleError(withoutTitle, 'title')
  })

  it('rejects an unparseable publishedAt date', () => {
    expectSingleError(
      { ...validArticle, publishedAt: 'yesterday' },
      'publishedAt'
    )
  })

  it('rejects a malformed substackUrl', () => {
    expectSingleError(
      { ...validArticle, substackUrl: 'not-a-url' },
      'substackUrl'
    )
  })

  it('rejects a published entry without publishedAt', () => {
    const { publishedAt: _publishedAt, ...withoutDate } = validArticle
    expectSingleError(withoutDate, 'publishedAt')
  })

  it('rejects a substackUrl on an entry not selected for email', () => {
    expectSingleError(
      {
        ...validNote,
        email: 'never',
        substackUrl: 'https://seanoliver.substack.com/p/a-quick-thought',
      },
      'substackUrl'
    )
  })

  it('rejects an emailedAt timestamp on an entry not selected for email', () => {
    expectSingleError(
      { ...validNote, email: 'never', emailedAt: '2026-03-11' },
      'emailedAt'
    )
  })

  it('rejects unrecognized frontmatter keys to catch typos', () => {
    expectSingleError(
      { ...validArticle, publishedat: '2026-03-10' },
      'publishedat'
    )
  })

  it('aggregates multiple field errors in one pass', () => {
    const { title: _title, ...broken } = { ...validArticle, status: 'live' }
    const result = validateEntryMetadata(broken, SOURCE_PATH)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errors.length).toBeGreaterThanOrEqual(2)
    expect(result.errors.join('\n')).toContain('title')
    expect(result.errors.join('\n')).toContain('status')
    for (const error of result.errors) {
      expect(error).toContain(SOURCE_PATH)
    }
  })

  it('parseEntryMetadata throws a ContentValidationError with path and field', () => {
    expect(() =>
      parseEntryMetadata({ ...validArticle, kind: 'essay' }, SOURCE_PATH)
    ).toThrowError(ContentValidationError)

    try {
      parseEntryMetadata({ ...validArticle, kind: 'essay' }, SOURCE_PATH)
      expect.unreachable('parseEntryMetadata should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ContentValidationError)
      const message = (error as ContentValidationError).message
      expect(message).toContain(SOURCE_PATH)
      expect(message).toContain('kind')
    }
  })
})

describe('schema: publication narrowing', () => {
  it('isPublishedMetadata narrows to entries with a publication date', () => {
    const published: EntryMetadata = parseEntryMetadata(
      validArticle,
      SOURCE_PATH
    )
    const draft: EntryMetadata = parseEntryMetadata(validNote, SOURCE_PATH)

    expect(isPublishedMetadata(published)).toBe(true)
    expect(isPublishedMetadata(draft)).toBe(false)

    if (isPublishedMetadata(published)) {
      // Type-level: publishedAt is a plain string after narrowing.
      const publishedAt: string = published.publishedAt
      expect(publishedAt).toBe('2026-03-10')
    }
  })
})

const fixturesRoot = fileURLToPath(new URL('./__fixtures__', import.meta.url))
const validRoot = path.join(fixturesRoot, 'valid')
const draftsRoot = path.join(fixturesRoot, 'drafts')
const duplicateSlugsRoot = path.join(fixturesRoot, 'duplicate-slugs')
const invalidRoot = path.join(fixturesRoot, 'invalid')

const SITE = 'https://example.com'

describe('files: discovery and ordering', () => {
  it('discovers .mdx files recursively and sorts newest first with a slug tie-break', async () => {
    const entries = await loadEntries(validRoot)

    // note.mdx and nested/second-note.mdx share 2026-06-01; the tie breaks
    // on slug ascending. article.mdx (2026-03-10) comes last.
    expect(entries.map((entry) => entry.slug)).toEqual([
      'note',
      'second-note',
      'article',
    ])
  })

  it('derives each slug from the file name and records the source path', async () => {
    const entries = await loadEntries(validRoot)
    const secondNote = entries.find((entry) => entry.slug === 'second-note')

    expect(secondNote).toBeDefined()
    expect(secondNote?.sourcePath).toContain(
      path.join('valid', 'nested', 'second-note.mdx')
    )
  })

  it('places undated drafts ahead of dated entries deterministically', async () => {
    const entries = await loadEntries(draftsRoot)

    expect(entries.map((entry) => entry.slug)).toEqual([
      'secret-draft',
      'shipped-note',
      'shipped-article',
    ])
  })

  it('normalizes unquoted YAML dates read from disk into ISO strings', async () => {
    const entries = await loadEntries(validRoot)
    const note = entries.find((entry) => entry.slug === 'note')

    expect(note?.metadata.publishedAt).toBe('2026-06-01')
    expect(typeof note?.metadata.publishedAt).toBe('string')
  })

  it('returns metadata-only index entries, never file bodies', async () => {
    const entries = await loadEntries(validRoot)

    for (const entry of entries) {
      expect(Object.keys(entry).sort()).toEqual([
        'metadata',
        'slug',
        'sourcePath',
      ])
    }
    expect(JSON.stringify(entries)).not.toContain('BODY_MARKER')
  })
})

describe('files: rejection with actionable errors', () => {
  it('rejects duplicate slugs, naming the slug and both files', async () => {
    const failure = await loadEntries(duplicateSlugsRoot).then(
      () => undefined,
      (error: unknown) => error
    )

    expect(failure).toBeInstanceOf(ContentValidationError)
    const message = (failure as ContentValidationError).message
    expect(message).toContain('hello-world')
    expect(message).toContain(path.join('duplicate-slugs', 'hello-world.mdx'))
    expect(message).toContain(
      path.join('duplicate-slugs', 'nested', 'hello-world.mdx')
    )
  })

  it('aggregates validation errors across files with path and field', async () => {
    const failure = await loadEntries(invalidRoot).then(
      () => undefined,
      (error: unknown) => error
    )

    expect(failure).toBeInstanceOf(ContentValidationError)
    const message = (failure as ContentValidationError).message
    const expectations: Array<[file: string, field: string]> = [
      ['bad-kind.mdx', 'kind'],
      ['missing-title.mdx', 'title'],
      ['published-without-date.mdx', 'publishedAt'],
      ['never-emailed-distribution.mdx', 'substackUrl'],
      ['never-emailed-distribution.mdx', 'emailedAt'],
    ]
    for (const [file, field] of expectations) {
      const line = message
        .split('\n')
        .find(
          (candidate) => candidate.includes(file) && candidate.includes(field)
        )
      expect(
        line,
        `expected an error line naming ${file} and ${field}`
      ).toBeDefined()
    }
  })

  it('rejects a missing content root with the root path in the error', async () => {
    const missingRoot = path.join(fixturesRoot, 'does-not-exist')
    await expect(loadEntries(missingRoot)).rejects.toThrowError(missingRoot)
  })
})

describe('files: publication projections', () => {
  it('excludes drafts from the published selection', async () => {
    const entries = await loadEntries(draftsRoot)
    const published = selectPublished(entries)

    expect(published.map((entry) => entry.slug)).toEqual([
      'shipped-note',
      'shipped-article',
    ])
    for (const entry of published) {
      // Type-level: narrowing guarantees a publication date.
      const publishedAt: string = entry.metadata.publishedAt
      expect(publishedAt).toBeTruthy()
    }
  })

  it('excludes drafts from route params unless drafts are explicitly included', async () => {
    const entries = await loadEntries(draftsRoot)

    expect(
      toRouteParams(selectRoutable(entries, { includeDrafts: false }))
    ).toEqual([{ slug: 'shipped-note' }, { slug: 'shipped-article' }])
    expect(
      toRouteParams(selectRoutable(entries, { includeDrafts: true }))
    ).toContainEqual({ slug: 'secret-draft' })
  })

  it('excludes drafts from the feed projection and builds canonical URLs', async () => {
    const entries = await loadEntries(draftsRoot)
    // Compile-time contract: the projection must satisfy the RSS FeedEntry type.
    const feedEntries: FeedEntry[] = toFeedEntries(entries, SITE)

    expect(feedEntries.map((entry) => entry.canonicalUrl)).toEqual([
      `${SITE}/writing/shipped-note`,
      `${SITE}/writing/shipped-article`,
    ])
    expect(JSON.stringify(feedEntries)).not.toContain('Secret Draft')
    for (const entry of feedEntries) {
      expect(entry.isPublished).toBe(true)
    }
  })

  it('excludes drafts from the sitemap projection and prefers updatedAt', async () => {
    const entries = await loadEntries(draftsRoot)
    const sitemapEntries = toSitemapEntries(entries, SITE)

    expect(sitemapEntries).toEqual([
      { url: `${SITE}/writing/shipped-note`, lastModified: '2026-03-01' },
      { url: `${SITE}/writing/shipped-article`, lastModified: '2026-01-15' },
    ])
  })
})

describe('files: URL policy', () => {
  it('builds route paths under /writing', () => {
    expect(entryRoutePath('my-post')).toBe('/writing/my-post')
  })

  it('builds canonical URLs from one builder, tolerating trailing slashes', () => {
    expect(canonicalEntryUrl(SITE, 'my-post')).toBe(`${SITE}/writing/my-post`)
    expect(canonicalEntryUrl(`${SITE}/`, 'my-post')).toBe(
      `${SITE}/writing/my-post`
    )
  })
})
