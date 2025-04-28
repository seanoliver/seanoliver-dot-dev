import React from 'react'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'
import { Metadata } from 'next'

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

export default function About(): JSX.Element {
  return (
    <Section title='About'>
      <div className='About'>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          I’m a software engineer passionate about building AI-powered
          applications and frictionless user experiences.
        </p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          After a decade growing products at{' '}
          <UnderLink href='https://www.microsoft.com/'>Microsoft</UnderLink>,{' '}
          <UnderLink href='https://www.linkedin.com/'>LinkedIn</UnderLink>,{' '}
          <UnderLink href='https://www.lyft.com/'>Lyft</UnderLink>, and{' '}
          <UnderLink href='https://www.block.xyz/'>Block</UnderLink>, I pivoted
          fully into software engineering — most recently at{' '}
          <UnderLink href='https://gamma.app/'>Gamma</UnderLink>, an AI startup
          rethinking how people present and share ideas.
        </p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          Today, I focus on frontend development with React, Next.js, and
          TypeScript, and love designing interfaces where AI and UX meet.
        </p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          I also write a{' '}
          <UnderLink href='https://newsletter.seanoliver.dev/'>
            newsletter
          </UnderLink>{' '}
          about programming, productivity, and personal knowledge management.
        </p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          I live in San Francisco, CA with my wife, two kids, and our 3.5-pound
          dog, Pixel (no relation to the phone). Outside of work, I love
          exploring productivity tools, experimenting with AI side projects,
          playing tennis, and designing casual mobile games.
        </p>
      </div>
    </Section>
  )
}
