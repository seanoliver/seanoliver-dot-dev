import { type ContentEntry } from '@/content'
import List, { ListItem } from '@/components/list'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'
import { toWritingListItem } from '@/components/writing-presentation'

import type { JSX } from 'react'

/**
 * Server-rendered writing index. Pages fetch entries with the content API's
 * `getVisibleEntries()` (published in production, drafts previewable in
 * `next dev`, newest first) and this component only presents them via the
 * `toWritingListItem` projection: every link is the entry's canonical route
 * path — no filesystem reads, frontmatter parsing, or URL building happen
 * here. Notes carry a small muted kind marker; articles are the default
 * treatment.
 *
 * Invariant: this component receives full ContentEntry objects (including the
 * server filesystem `sourcePath`) and must remain a server component. If it
 * ever needs 'use client', project entries to the serializable
 * `WritingListItem` view model at the page boundary first.
 */
export default function WritingIndex({
  entries,
  title,
  limit,
  href,
  footer,
}: {
  entries: ContentEntry[]
  title: string
  limit?: number
  href?: string
  /**
   * Optional footer rendered below the list, inside the section's content
   * column (the full /writing index passes the newsletter signup here; the
   * home-page teaser passes nothing).
   */
  footer?: React.ReactNode
}): JSX.Element {
  const displayEntries = limit ? entries.slice(0, limit) : entries
  const hasMore = limit != null && entries.length > limit

  const items: ListItem[] = displayEntries
    .map(toWritingListItem)
    .map((item) => ({
      key: item.slug,
      left: (
        <>
          <UnderLink href={item.href}>{item.title}</UnderLink>
          {item.kindLabel && (
            <span className='ml-2 align-middle rounded border border-border px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted-foreground'>
              {item.kindLabel}
            </span>
          )}
        </>
      ),
      right: item.meta,
    }))

  return (
    <Section title={title} href={href} hasMore={hasMore}>
      {items.length > 0 && <List items={items} />}
      {footer && <div className='mt-8'>{footer}</div>}
    </Section>
  )
}
