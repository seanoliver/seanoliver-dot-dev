import React from 'react'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'
import { Metadata } from 'next'
import { PersonJsonLd } from '@/components/json-ld'

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

export default function About(): JSX.Element {
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
      <Section title='About'>
        <div className='About'>
          <p className='leading-7'>
            Growth Engineer at{' '}
            <UnderLink href='https://supabase.com/'>Supabase</UnderLink>. Former
            product leader at{' '}
            <UnderLink href='https://www.microsoft.com/'>Microsoft</UnderLink>,{' '}
            <UnderLink href='https://www.linkedin.com/'>LinkedIn</UnderLink>,{' '}
            <UnderLink href='https://www.lyft.com/'>Lyft</UnderLink>,{' '}
            <UnderLink href='https://www.block.xyz/'>Block</UnderLink>, and{' '}
            <UnderLink href='https://gamma.app/'>Gamma</UnderLink> before
            switching to engineering. I write a{' '}
            <UnderLink href='https://newsletter.seanoliver.dev/'>
              newsletter
            </UnderLink>{' '}
            about programming and productivity.
          </p>
        </div>
      </Section>
    </>
  )
}
