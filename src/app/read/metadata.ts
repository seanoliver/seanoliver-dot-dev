import { Metadata } from 'next'

import { ogImageUrl, SITE_URL } from '@/lib/site'

const OG_IMAGE = ogImageUrl({
  title: 'Reading List',
  description:
    "Books I've been reading. Mostly tech, business, and science fiction.",
  path: '/read',
})

export const metadata: Metadata = {
  title: 'Reading List by Sean Oliver',
  description:
    "Books I've been reading, tracked through Goodreads. Mostly tech, business, and science fiction.",
  openGraph: {
    title: 'Reading List by Sean Oliver',
    description:
      "Books I've been reading. Mostly tech, business, and science fiction.",
    type: 'website',
    url: `${SITE_URL}/read`,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reading List by Sean Oliver',
    description: "Books I've been reading.",
    images: [OG_IMAGE],
  },
}
