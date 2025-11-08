import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reading List by Sean Oliver',
  description:
    "Books I've been reading, tracked through Goodreads. Mostly tech, business, and science fiction.",
  openGraph: {
    title: 'Reading List by Sean Oliver',
    description:
      "Books I've been reading. Mostly tech, business, and science fiction.",
    type: 'website',
    url: 'https://seanoliver.dev/read',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reading List by Sean Oliver',
    description: "Books I've been reading.",
  },
}
