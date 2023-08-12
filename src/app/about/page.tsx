'use client'

import React from 'react'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'

export default function About(): JSX.Element {
  return (
    <Section title="About">
      <div className="About">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          I’m a software engineer and former product marketer who loves building and growing
          technology products that delight users. I have 13 years of experience at leading companies
          like <UnderLink href="https://www.microsoft.com/">Microsoft</UnderLink>,{' '}
          <UnderLink href="https://www.linkedin.com/">LinkedIn</UnderLink>,{' '}
          <UnderLink href="https://www.lyft.com/">Lyft</UnderLink>, and{' '}
          <UnderLink href="https://www.block.xyz/">Block</UnderLink>.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          My background in marketing and growth has taught me that the best marketing is a product
          that prioritizes users’ needs above all else and then meets those needs in ways that feel
          natural and effortless.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          In 2023, I traded my full-time job in marketing for a seat at{' '}
          <UnderLink href="https://rithmschool.com">Rithm School</UnderLink>, a 16-week software
          engineering bootcamp that taught me how to program—not how to code. In addition to{' '}
          <UnderLink href="https://www.typescriptlang.org/">TypeScript</UnderLink> and{' '}
          <UnderLink href="https://www.python.org/">Python</UnderLink>, it taught me how to create
          strategically and how to evaluate technical tradeoffs.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          I have a <UnderLink href="https://newsletter.seanoliver.dev/">newsletter</UnderLink> where
          I write about programming, productivity, personal knowledge management.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          I live in San Francisco, CA with my amazing wife, two children, and our 3.5 lbs dog named
          Pixel (no relation to the phone). I love productivity tools and systems, personal
          knowledge management, artificial intelligence, tennis, and casual mobile games.
        </p>
      </div>
    </Section>
  )
}
