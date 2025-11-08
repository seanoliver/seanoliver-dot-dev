import { Metadata } from 'next'
import { PersonJsonLd } from '@/components/json-ld'
import AboutContent from '@/components/about-content'

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
      <PersonJsonLd
        person={{
          name: 'Sean Oliver',
          jobTitle: 'Growth Engineer',
          url: 'https://seanoliver.dev',
          sameAs: [
            'https://x.com/SeanOliver',
            'https://github.com/SeanOliver',
            'https://www.linkedin.com/in/theseanoliver/',
          ],
          image: 'https://seanoliver.dev/profile.jpeg',
          description:
            'Growth Engineer at Supabase blending technical expertise with user insights.',
        }}
      />
      <AboutContent />
    </>
  )
}
