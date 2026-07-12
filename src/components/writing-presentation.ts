import {
  entryRoutePath,
  type ContentEntry,
  type EntryMetadata,
} from '@/content'
import { formatDateSpaced } from '@/lib/date-utils'

/**
 * Pure presentation policy for the writing surfaces: how the unified index
 * distinguishes articles from notes, and which schema.org type an entry page
 * emits. Kept free of JSX so the article/note treatments stay unit-testable
 * (published-note treatments have no e2e surface until a note is published).
 */

export type WritingListItem = {
  slug: string
  /** Canonical route path for the entry — the only link an index may use. */
  href: string
  title: string
  /**
   * Small muted marker rendered next to the title. Notes get one; articles
   * are the default treatment and get none.
   */
  kindLabel?: 'Note'
  /**
   * Right-hand metadata text. Drafts (visible in dev preview only) always
   * lead with the draft marker, with the date alongside when one exists.
   */
  meta: string
}

export function toWritingListItem(entry: ContentEntry): WritingListItem {
  const { kind, status, title, publishedAt } = entry.metadata
  const date = publishedAt ? formatDateSpaced(publishedAt) : undefined
  const meta =
    status === 'draft' ? (date ? `Draft · ${date}` : 'Draft') : (date ?? '')

  return {
    slug: entry.slug,
    href: entryRoutePath(entry.slug),
    title,
    kindLabel: kind === 'note' ? 'Note' : undefined,
    meta,
  }
}

/**
 * Articles are full blog posts (BlogPosting). Notes are short informal
 * posts, and schema.org's SocialMediaPosting — an Article subtype covering
 * microblog-style entries — is the established type for that shape.
 */
export function entryJsonLdType(
  kind: EntryMetadata['kind']
): 'BlogPosting' | 'SocialMediaPosting' {
  return kind === 'note' ? 'SocialMediaPosting' : 'BlogPosting'
}
