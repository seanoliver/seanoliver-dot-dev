'use client'

import Section from '@/components/Section'
import List, { ListItem } from '@/components/list'
import { UnderLink } from '@/components/under-link'
import { PROJECTS } from '@/lib/constants'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export default function Projects({ limit, href }: { limit?: number; href?: string } = {}): JSX.Element {
  const displayProjects = limit ? PROJECTS.slice(0, limit) : PROJECTS

  const items: ListItem[] = displayProjects.map((project) => ({
    key: project.url,
    left: <UnderLink href={project.url}>{project.name}</UnderLink>,
    middle: project.summary,
    right: (
      <a
        href={project.github}
        target='_blank'
        rel='noopener noreferrer'
        className='text-muted-foreground hover:text-foreground transition-colors'
        aria-label='View GitHub repository'
      >
        <GitHubLogoIcon className='w-4 h-4' />
      </a>
    ),
  }))

  return (
    <Section title='Projects' href={href}>
      <List items={items} />
    </Section>
  )
}
