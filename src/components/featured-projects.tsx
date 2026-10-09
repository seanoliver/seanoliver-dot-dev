import Link from 'next/link'
import ProjectThumbnail from '@/components/project-thumbnails'
import Section from '@/components/Section'
import { StatusLabel } from '@/components/status-label'
import { getChangelog, repoFromGitHubUrl } from '@/lib/changelog'
import { formatDateSpaced } from '@/lib/date-utils'
import type { Project } from '@/lib/types'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

import type { JSX } from 'react'

const CHANGELOG_LIMIT = 5

async function getMergedChangelog(projects: Project[]) {
  const perProject = await Promise.all(
    projects.map(async (project) => {
      const repo = repoFromGitHubUrl(project.github)
      const entries = repo ? await getChangelog(repo) : []
      return entries.map((entry) => ({ ...entry, project: project.name }))
    })
  )
  return perProject
    .flat()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, CHANGELOG_LIMIT)
}

export default async function FeaturedProjects({
  projects,
}: {
  projects: Project[]
}): Promise<JSX.Element> {
  const changelog = await getMergedChangelog(projects)

  return (
    <Section title='Now building' fullWidth>
      <article className='overflow-hidden rounded-xl border'>
        <ul className='divide-y'>
          {projects.map((project) => (
            <li
              key={project.url}
              className='grid grid-cols-[56px_1fr] items-center gap-x-4 gap-y-3 p-4 sm:grid-cols-[76px_1fr_auto] sm:gap-x-5 sm:px-6 sm:py-5'
            >
              <ProjectThumbnail project={project} />
              <div className='flex min-w-0 flex-col gap-1'>
                <div className='flex items-center gap-3'>
                  <h2 className='text-base font-semibold'>{project.name}</h2>
                  <StatusLabel status={project.status} />
                </div>
                <p className='text-muted-foreground leading-6'>
                  {project.summary}
                </p>
              </div>
              <div className='col-start-2 flex items-center gap-3 sm:col-start-auto'>
                <a
                  href={project.github}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                  aria-label={`View ${project.name} on GitHub`}
                >
                  <GitHubLogoIcon className='w-4 h-4' />
                </a>
                <Link
                  href={project.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='whitespace-nowrap rounded-md border px-3 py-2 text-xs hover:bg-muted'
                >
                  Open {project.name} <span aria-hidden='true'>→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {changelog.length > 0 && (
          <div className='px-4 pb-5 sm:px-6'>
            <ul
              className='grid grid-cols-[auto_auto_minmax(0,1fr)] gap-x-3 border-t border-dashed pt-4 text-xs leading-6 sm:gap-x-4'
              aria-label='Recent changes'
            >
              {changelog.map((entry) => {
                const date = formatDateSpaced(entry.date)
                return (
                  <li key={entry.url} className='contents'>
                    <span className='text-muted-foreground tabular-nums'>
                      {date.slice(0, 5)}
                      <span className='hidden sm:inline'>{date.slice(5)}</span>
                    </span>
                    <span className='text-muted-foreground'>
                      {entry.project}
                    </span>
                    <a
                      href={entry.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      title={entry.text}
                      className='truncate hover:underline underline-offset-4'
                    >
                      {entry.text}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </article>
    </Section>
  )
}
