import { Metadata } from 'next'

import { ogImageUrl } from '@/lib/site'

const OG_IMAGE = ogImageUrl({
  title: 'Experience',
  description:
    'Growth Engineer at Supabase with engineering experience at Gamma and product leadership at Microsoft, LinkedIn, Lyft, and Block.',
  path: '/experience',
})

export const metadata: Metadata = {
  title: 'Experience - Sean Oliver',
  description:
    'Career history of Sean Oliver: Growth Engineer at Supabase, previously at Gamma, Smol AI, State Technologies, and product roles at Microsoft, LinkedIn, Lyft, and Block.',
  openGraph: {
    title: 'Experience - Sean Oliver',
    description:
      'Growth Engineer at Supabase with engineering experience at Gamma and product leadership at Microsoft, LinkedIn, Lyft, and Block.',
    type: 'profile',
    url: 'https://www.seanoliver.dev/experience',
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experience - Sean Oliver',
    description:
      'Growth Engineer at Supabase with product and engineering experience at top tech companies.',
    images: [OG_IMAGE],
  },
}
