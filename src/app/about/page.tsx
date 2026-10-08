import { Metadata } from 'next'
import { PersonJsonLd, SITE_OWNER } from '@/components/json-ld'
import { SITE_URL } from '@/lib/site'
import AboutContent from '@/components/about-content'

import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'About Sean Oliver',
  description:
    'Growth Engineer at Supabase blending technical expertise with user insights. Former product leader at Microsoft, LinkedIn, Lyft, and Block who transitioned to engineering.',
  openGraph: {
    title: 'About Sean Oliver',
    description:
      'Growth Engineer at Supabase blending technical expertise with user insights. Former product leader at Microsoft, LinkedIn, Lyft, and Block.',
    type: 'profile',
    url: `${SITE_URL}/about`,
    images: [
      {
        url: `${SITE_URL}/profile.jpeg`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Sean Oliver',
    description:
      'Growth Engineer at Supabase blending technical expertise with user insights.',
    images: [`${SITE_URL}/profile.jpeg`],
  },
}

export default function AboutPage(): JSX.Element {
  return (
    <>
      <PersonJsonLd person={SITE_OWNER} />
      <AboutContent />
    </>
  )
}
