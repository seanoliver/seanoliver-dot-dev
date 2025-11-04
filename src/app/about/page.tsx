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
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            I'm a Growth Engineer at{' '}
            <UnderLink href='https://supabase.com/'>Supabase</UnderLink>, where
            I blend technical expertise with user insights to build experiences
            that actually move the needle.
          </p>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            My path here was unconventional — I spent a decade growing products
            at{' '}
            <UnderLink href='https://www.microsoft.com/'>Microsoft</UnderLink>,{' '}
            <UnderLink href='https://www.linkedin.com/'>LinkedIn</UnderLink>,{' '}
            <UnderLink href='https://www.lyft.com/'>Lyft</UnderLink>, and{' '}
            <UnderLink href='https://www.block.xyz/'>Block</UnderLink> before
            diving headfirst into engineering. Most recently at{' '}
            <UnderLink href='https://gamma.app/'>Gamma</UnderLink>, I helped
            build AI-powered tools that make creating and sharing ideas
            effortless.
          </p>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            What drives me is the intersection of human behavior and code —
            running experiments, digging into usage patterns, and crafting
            features that feel inevitable rather than forced. I work primarily
            with React, Next.js, and TypeScript, but I'm most excited when I'm
            turning data into decisions and hypotheses into shipped features.
          </p>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            I also write a{' '}
            <UnderLink href='https://newsletter.seanoliver.dev/'>
              newsletter
            </UnderLink>{' '}
            about programming, productivity, and personal knowledge management.
          </p>
          <p className='leading-7 [&:not(:first-child)]:mt-6'>
            I live in San Francisco, CA with my wife, two kids, and our
            3.5-pound dog, Pixel (no relation to the phone). Outside of work, I
            love exploring productivity tools, experimenting with AI side
            projects, playing tennis, and designing casual mobile games.
          </p>
        </div>
      </Section>
    </>
  )
}
