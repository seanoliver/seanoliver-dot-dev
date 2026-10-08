import { Metadata } from 'next'

import { ogImageUrl } from '@/lib/site'

const OG_IMAGE = ogImageUrl({
  title: 'Projects',
  description:
    'Software engineering projects including AI-powered apps, web platforms, and developer tools built with React, Next.js, and TypeScript.',
  path: '/projects',
})

export const metadata: Metadata = {
  title: 'Projects by Sean Oliver',
  description:
    'Software engineering projects by Sean Oliver including TheraGPT (AI-powered CBT journal), Audioflare (AI audio playground), and Smol Menubar (desktop AI assistant).',
  openGraph: {
    title: 'Projects by Sean Oliver',
    description:
      'Software engineering projects including AI-powered apps, web platforms, and developer tools built with React, Next.js, and TypeScript.',
    type: 'website',
    url: 'https://www.seanoliver.dev/projects',
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects by Sean Oliver',
    description:
      'Software engineering projects including AI-powered apps and developer tools.',
    images: [OG_IMAGE],
  },
}
