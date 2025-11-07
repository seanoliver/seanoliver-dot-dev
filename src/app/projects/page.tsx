'use client'

import Section from '@/components/Section'
import { UnderLink } from '@/components/under-link'
import { PROJECTS } from '@/lib/constants'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export default function Projects(): JSX.Element {
  return (
    <Section title='Projects'>
      <div className='w-full max-w-xl'>
        {PROJECTS.map((project, idx) => (
          <div
            key={idx}
            className='w-full flex items-center justify-between leading-7 gap-4'
          >
            <span className='font-medium flex-1 min-w-0'>
              <UnderLink href={project.url}>{project.name}</UnderLink>
            </span>
            <span className='text-muted-foreground text-sm whitespace-nowrap hidden sm:inline'>
              {project.summary}
            </span>
            <a
              href={project.github}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground transition-colors'
              aria-label='View GitHub repository'
            >
              <GitHubLogoIcon className='w-4 h-4' />
            </a>
          </div>
        ))}
      </div>
    </Section>
  )
}
