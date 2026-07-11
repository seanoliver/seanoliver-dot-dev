import { entryRoutePath, type ContentEntry } from '@/content'
import List, { ListItem } from '@/components/list'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'
import { formatDateSpaced } from '@/lib/date-utils'

/**
 * Server-rendered writing index. Pages fetch entries with the content API's
 * `getVisibleEntries()` (published in production, drafts previewable in
 * `next dev`, newest first) and this component only presents them: every link
 * is the entry's canonical route path — no filesystem reads, frontmatter
 * parsing, or URL building happen here.
 */
export default function WritingIndex({
  entries,
  title,
  limit,
  href,
}: {
  entries: ContentEntry[]
  title: string
  limit?: number
  href?: string
}): JSX.Element {
  const displayEntries = limit ? entries.slice(0, limit) : entries
  const hasMore = limit != null && entries.length > limit

  const items: ListItem[] = displayEntries.map((entry) => ({
    key: entry.slug,
    left: (
      <UnderLink href={entryRoutePath(entry.slug)}>
        {entry.metadata.title}
      </UnderLink>
    ),
    // Drafts (dev-only) may not have a publication date yet.
    right: entry.metadata.publishedAt
      ? formatDateSpaced(entry.metadata.publishedAt)
      : 'Draft',
  }))

  return (
    <Section title={title} href={href} hasMore={hasMore}>
      {items.length > 0 && <List items={items} />}
    </Section>
  )
}
