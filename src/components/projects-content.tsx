import Section from '@/components/Section'
import List, { ListItem } from '@/components/list'
import { StatusLabel } from '@/components/status-label'
import { UnderLink } from '@/components/under-link'
import { PROJECTS } from '@/lib/constants'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

import type { JSX } from 'react'

export default function ProjectsContent({
  limit,
  href,
  excludeFeatured = false,
}: {
  limit?: number
  href?: string
  excludeFeatured?: boolean
} = {}): JSX.Element {
  const projects = excludeFeatured
    ? PROJECTS.filter((project) => !project.featured)
    : PROJECTS
  const displayProjects = limit ? projects.slice(0, limit) : projects
  const hasMore = limit != null && projects.length > limit

  const items: ListItem[] = displayProjects.map((project) => ({
    key: project.url,
    left: <UnderLink href={project.url}>{project.name}</UnderLink>,
    middle: project.summary,
    right: (
      <span className='flex items-center gap-3'>
        <StatusLabel status={project.status} />
        <a
          href={project.github}
          target='_blank'
          rel='noopener noreferrer'
          className='text-muted-foreground hover:text-foreground transition-colors'
          aria-label={`View ${project.name} on GitHub`}
        >
          <GitHubLogoIcon className='w-4 h-4' />
        </a>
      </span>
    ),
  }))

  return (
    <Section title='Projects' href={href} hasMore={hasMore}>
      <List items={items} />
    </Section>
  )
}
