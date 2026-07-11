import type { Metadata } from 'next'

import WritingIndex from '@/components/writing-index'
import { getVisibleEntries } from '@/content'
import { RSS_ALTERNATE, SITE_URL } from '@/lib/site'

import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Writing by Sean Oliver',
  description:
    'Articles and notes by Sean Oliver about software engineering, React, TypeScript, and building products.',
  alternates: { canonical: `${SITE_URL}/writing`, types: RSS_ALTERNATE },
  openGraph: {
    title: 'Writing by Sean Oliver',
    description:
      'Articles and notes about software engineering, React, TypeScript, and building products.',
    type: 'website',
    url: `${SITE_URL}/writing`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing by Sean Oliver',
    description:
      'Articles and notes about software engineering and building products.',
  },
}

export default async function WritingPage(): Promise<JSX.Element> {
  const entries = await getVisibleEntries()
  return <WritingIndex entries={entries} title='Writing' />
}
