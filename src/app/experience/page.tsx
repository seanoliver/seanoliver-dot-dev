'use client'

import { EXPERIENCES } from '@/lib/constants'
import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'

export default function Experience(): JSX.Element {
  return (
    <Section title='Experience'>
      <div className='w-full max-w-xl'>
        {EXPERIENCES.map((experience, idx) => (
          <div
            key={idx}
            className='w-full flex items-center justify-between leading-7 gap-4'
          >
            <span className='font-medium flex-1 min-w-0'>
              <UnderLink href={experience.url}>{experience.company}</UnderLink>
            </span>
            <span className='text-muted-foreground text-xs whitespace-nowrap'>
              {experience.date}
            </span>
          </div>
        ))}
      </div>
    </Section>
  )
}
