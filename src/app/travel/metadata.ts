import { Metadata } from 'next'

import { ogImageUrl, SITE_URL } from '@/lib/site'

const DESCRIPTION =
  'Travel videos by Sean Oliver: Australia and New Zealand, Thailand and Cambodia, Miami and Cuba, and China.'

const OG_IMAGE = ogImageUrl({
  title: 'Travel',
  description: DESCRIPTION,
  path: '/travel',
})

export const metadata: Metadata = {
  title: 'Travel by Sean Oliver',
  description: DESCRIPTION,
  openGraph: {
    title: 'Travel by Sean Oliver',
    description: DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/travel`,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel by Sean Oliver',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
}
