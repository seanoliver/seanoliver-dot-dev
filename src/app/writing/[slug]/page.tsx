import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getEntryBySlug, getEntryRouteParams } from '@/content'

/**
 * Tracer route for the first-party content pipeline: metadata comes from the
 * schema-validated content domain (`src/content`), the body from a native
 * `@next/mdx` import of the same file. Index page, redirects, JSON-LD, and
 * the full article chrome arrive when the Contentlayer routes are replaced.
 */

// Reject any slug not returned by generateStaticParams with a 404, so drafts
// (excluded outside development) can never be reached in production.
export const dynamicParams = false

export async function generateStaticParams() {
  return getEntryRouteParams()
}

type PageProps = { params: { slug: string } }

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const entry = await getEntryBySlug(params.slug)
  if (!entry) notFound()

  return {
    title: entry.metadata.title,
    description: entry.metadata.summary,
  }
}

export default async function WritingEntryPage({ params }: PageProps) {
  const entry = await getEntryBySlug(params.slug)
  if (!entry) notFound()

  // Native MDX import of the exact file the schema validated; webpack bundles
  // every `content/writing/*.mdx` candidate and compiles it with @next/mdx.
  const { default: Body } = await import(
    `../../../../content/writing/${params.slug}.mdx`
  )

  return (
    <article className='text-sm w-full my-10 md:my-20'>
      <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
        {entry.metadata.title}
      </h1>
      <div className='mx-auto mt-10'>
        <Body />
      </div>
    </article>
  )
}
