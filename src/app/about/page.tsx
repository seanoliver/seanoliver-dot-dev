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
          I’m a software engineer at{' '}
          <UnderLink href='https://gamma.app'>Gamma</UnderLink> obsessed with
          AI, PKM, and productivity. I have 13 years of experience building and
          growing products at leading companies like{' '}
          <UnderLink href='https://www.microsoft.com/'>Microsoft</UnderLink>,{' '}
          <UnderLink href='https://www.linkedin.com/'>LinkedIn</UnderLink>,{' '}
          <UnderLink href='https://www.lyft.com/'>Lyft</UnderLink>, and{' '}
          <UnderLink href='https://www.block.xyz/'>Block</UnderLink>.
        </p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          My background in marketing and growth has taught me that the best
          marketing is a product that prioritizes users’ needs above all else
          and then meets those needs in ways that feel natural and effortless.
        </p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          I have a{' '}
          <UnderLink href='https://newsletter.seanoliver.dev/'>
            newsletter
          </UnderLink>{' '}
          where I write about programming, productivity, personal knowledge
          management.
        </p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>
          I live in San Francisco, CA with my amazing wife, two children, and
          our 3.5 lbs dog named Pixel (no relation to the phone). I love
          productivity tools and systems, personal knowledge management, AI,
          tennis, and casual mobile games.
        </p>
      </div>
    </Section>
  )
}
