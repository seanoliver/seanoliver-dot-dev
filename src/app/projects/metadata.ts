import { Metadata } from 'next'

import { ogImageUrl, SITE_URL } from '@/lib/site'

const OG_IMAGE = ogImageUrl({
  title: 'Projects',
  description:
    'Side projects including a Sudoku app that teaches every technique, a world clock for Chrome, and an AI journal.',
  path: '/projects',
})

export const metadata: Metadata = {
  title: 'Projects by Sean Oliver',
  description:
    "Side projects by Sean Oliver, including Sudoku (a calm Sudoku app that teaches every technique), Solstice (a world clock for Chrome's new tab), and TheraGPT (an AI-powered CBT journal).",
  openGraph: {
    title: 'Projects by Sean Oliver',
    description:
      'Side projects including a Sudoku app that teaches every technique, a world clock for Chrome, and an AI journal.',
    type: 'website',
    url: `${SITE_URL}/projects`,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects by Sean Oliver',
    description:
      'Side projects including a Sudoku app, a world clock for Chrome, and an AI journal.',
    images: [OG_IMAGE],
  },
}
