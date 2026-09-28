import { Metadata } from 'next'
import { PersonJsonLd, SITE_OWNER } from '@/components/json-ld'
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
    url: 'https://seanoliver.dev/about',
    images: [
      {
        url: 'https://seanoliver.dev/profile.jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Sean Oliver',
    description:
      'Growth Engineer at Supabase blending technical expertise with user insights.',
    images: ['https://seanoliver.dev/profile.jpeg'],
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
