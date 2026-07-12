import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostingJsonLd } from '@/components/json-ld'
import ReadingProgress from '@/components/reading-progress'
import { ReadingProgressFallback } from '@/components/reading-progress-fallback'
import { getCanonicalUrl, getEntryBySlug, getEntryRouteParams } from '@/content'
import { formatDate } from '@/lib/date-utils'
import { RSS_ALTERNATE, SITE_AUTHOR, SITE_URL } from '@/lib/site'

/**
 * Canonical route for the owned content pipeline: metadata, JSON-LD, and the
 * page body all derive from the same schema-validated entry projection
 * (`src/content`), and the body is a native `@next/mdx` import of the exact
 * file that projection validated.
 */

// Reject any slug not returned by generateStaticParams with a 404, so drafts
// (excluded outside development) can never be reached in production.
export const dynamicParams = false

export async function generateStaticParams() {
  return getEntryRouteParams()
}

type PageProps = { params: Promise<{ slug: string }> }

function ogImageUrl(title: string): string {
  return `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const entry = await getEntryBySlug(params.slug)
  if (!entry) notFound()

  const { title, summary, publishedAt } = entry.metadata
  const canonicalUrl = getCanonicalUrl(entry.slug)
  const imageUrl = ogImageUrl(title)

  return {
    title,
    description: summary,
    alternates: { canonical: canonicalUrl, types: RSS_ALTERNATE },
    openGraph: {
      title,
      description: summary,
      type: 'article',
      // Drafts (previewable in development only) have no publication date.
      ...(publishedAt && { publishedTime: publishedAt }),
      url: canonicalUrl,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: summary,
      images: [imageUrl],
    },
  }
}

export default async function WritingEntryPage(props: PageProps) {
  const params = await props.params
  const entry = await getEntryBySlug(params.slug)
  if (!entry) notFound()

  const { title, summary, publishedAt, updatedAt, status } = entry.metadata
  const canonicalUrl = getCanonicalUrl(entry.slug)

  // Native MDX import of the exact file the schema validated; the bundler
  // (Turbopack since Next 16) bundles every `content/writing/*.mdx` candidate
  // and compiles it with @next/mdx.
  // Two constraints follow from that template string:
  // - content/writing/ must stay FLAT. The content domain enforces this:
  //   `loadEntries` rejects nested .mdx files with an actionable error, so a
  //   nested entry fails validation long before this import could fail with
  //   an unfriendly "Cannot find module" build error.
  // - the bundler's module context includes every .mdx candidate, drafts included:
  //   drafts are unroutable in production, but their compiled bodies still
  //   exist in the server bundle.
  const { default: Body } = await import(
    `../../../../content/writing/${params.slug}.mdx`
  )

  // Drafts are only routable in development; label them like the old route.
  const showUnpublished = status === 'draft'

  return (
    <>
      <ReadingProgress />
      <ReadingProgressFallback />
      {publishedAt && (
        <BlogPostingJsonLd
          post={{
            headline: title,
            datePublished: publishedAt,
            dateModified: updatedAt ?? publishedAt,
            author: {
              name: SITE_AUTHOR.name,
              url: SITE_URL,
            },
            image: ogImageUrl(title),
            description: summary,
            url: canonicalUrl,
          }}
        />
      )}
      <article className='text-sm w-full my-10 md:my-20'>
        <div>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
            {title}
          </h1>
          <p className='text-md text-muted-foreground mt-3 mb-10'>
            By {SITE_AUTHOR.name}
            {publishedAt && ` · ${formatDate(publishedAt)}`}
            {showUnpublished && ' · '}
            {showUnpublished && (
              <span className='text-md font-semibold text-red-600'>
                Unpublished
              </span>
            )}
          </p>
        </div>
        <div className='mx-auto'>
          <Body />
        </div>
      </article>
    </>
  )
}
