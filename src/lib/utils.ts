import { type ClassValue, clsx } from 'clsx'
import { Metadata } from 'next'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Defines the shape of metadata used throughout the site and returns a
 * complete metadata object aligned with Next.js' metadata object.
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata#the-metadata-object
 */
export function getCompleteMetadata({
  title,
  description,
  type = 'website',
}: {
  title: string
  description: string
  type: 'article' | 'website'
  slug: string
}) {
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
    },
  }
}

export const metadata: Metadata = {
  title: 'About',
  description: 'About Sean Oliver',
  openGraph: {
    title: 'About',
    description: 'About Sean Oliver',
    type: 'article',
    url: 'https://seanoliver.dev/about',
    images: [
      {
        url: 'https://seanoliver.dev/images/about.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About',
    description: 'About Sean Oliver',
    images: ['https://seanoliver.dev/images/about.png'],
  },
}
