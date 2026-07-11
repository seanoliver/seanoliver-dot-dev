import { z } from 'zod'

/**
 * Frontmatter schema for the owned content domain (`content/writing/*.mdx`).
 *
 * One discriminated collection supports both formats (`kind: article | note`).
 * Author identity and the site URL live in site configuration, never in
 * per-file frontmatter.
 */

/**
 * YAML parsers hand unquoted dates (`publishedAt: 2026-03-10`) to us as
 * JavaScript Date instances; quoted dates arrive as strings. Normalize both
 * to a plain ISO `YYYY-MM-DD` string so every consumer sees one shape.
 */
const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.iso.date()
)

const sharedFields = {
  status: z.enum(['draft', 'published']),
  title: z.string().min(1),
  summary: z.string().min(1),
  publishedAt: isoDate.optional(),
  updatedAt: isoDate.optional(),
  tags: z.array(z.string()).default([]),
  // Substack is an explicit distribution channel, never a source of truth.
  email: z.enum(['never', 'selected']).default('never'),
  substackUrl: z.url().optional(),
  emailedAt: isoDate.optional(),
}

// strictObject rejects unrecognized keys so frontmatter typos
// (e.g. `publishedat:`) fail loudly instead of silently dropping data.
const articleSchema = z.strictObject({
  kind: z.literal('article'),
  ...sharedFields,
})

const noteSchema = z.strictObject({
  kind: z.literal('note'),
  ...sharedFields,
})

export const entryMetadataSchema = z
  .discriminatedUnion('kind', [articleSchema, noteSchema])
  .superRefine((data, ctx) => {
    if (data.status === 'published' && data.publishedAt === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['publishedAt'],
        message: 'publishedAt is required when status is "published"',
      })
    }
    if (data.email !== 'selected') {
      if (data.substackUrl !== undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['substackUrl'],
          message:
            'substackUrl is only allowed when email is "selected"; this entry is not marked for email distribution',
        })
      }
      if (data.emailedAt !== undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['emailedAt'],
          message:
            'emailedAt is only allowed when email is "selected"; this entry is not marked for email distribution',
        })
      }
    }
  })

export type EntryMetadata = z.infer<typeof entryMetadataSchema>

/** A published entry is guaranteed to carry its publication date. */
export type PublishedEntryMetadata = EntryMetadata & {
  status: 'published'
  publishedAt: string
}

export function isPublishedMetadata(
  metadata: EntryMetadata
): metadata is PublishedEntryMetadata {
  return metadata.status === 'published' && metadata.publishedAt !== undefined
}

/**
 * Validation failure for one or more content files. `errors` holds one
 * human-readable line per problem, each prefixed with the source path.
 */
export class ContentValidationError extends Error {
  readonly errors: readonly string[]

  constructor(errors: readonly string[]) {
    super(errors.join('\n'))
    this.name = 'ContentValidationError'
    this.errors = errors
  }
}

export type MetadataValidationResult =
  | { ok: true; metadata: EntryMetadata }
  | { ok: false; errors: string[] }

function formatIssuePath(issuePath: PropertyKey[]): string {
  if (issuePath.length === 0) return '(root)'
  return issuePath.map(String).join('.')
}

/**
 * Validate raw frontmatter against the schema. Every error line includes the
 * source path and the failing field so authors can fix files without
 * re-running the build one problem at a time.
 */
export function validateEntryMetadata(
  raw: unknown,
  sourcePath: string
): MetadataValidationResult {
  const result = entryMetadataSchema.safeParse(raw)
  if (result.success) {
    return { ok: true, metadata: result.data }
  }
  const errors = result.error.issues.map(
    (issue) => `${sourcePath}: ${formatIssuePath(issue.path)}: ${issue.message}`
  )
  return { ok: false, errors }
}

/** Like {@link validateEntryMetadata} but throws a ContentValidationError. */
export function parseEntryMetadata(
  raw: unknown,
  sourcePath: string
): EntryMetadata {
  const result = validateEntryMetadata(raw, sourcePath)
  if (!result.ok) {
    throw new ContentValidationError(result.errors)
  }
  return result.metadata
}
