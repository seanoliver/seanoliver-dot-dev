import { Metadata } from 'next'

import { ogImageUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Reading List by Sean Oliver',
  description:
    "Books I've been reading, tracked through Goodreads. Mostly tech, business, and science fiction.",
  openGraph: {
    title: 'Reading List by Sean Oliver',
    description:
      "Books I've been reading. Mostly tech, business, and science fiction.",
    type: 'website',
    url: 'https://www.seanoliver.dev/read',
    images: [{ url: ogImageUrl('Reading List') }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reading List by Sean Oliver',
    description: "Books I've been reading.",
    images: [ogImageUrl('Reading List')],
  },
}
