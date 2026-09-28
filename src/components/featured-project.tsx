import Link from 'next/link'
import Section from '@/components/Section'
import { StatusLabel } from '@/components/status-label'
import SudokuBoard from '@/components/sudoku-board'
import { getChangelog, repoFromGitHubUrl } from '@/lib/changelog'
import { formatDateSpaced } from '@/lib/date-utils'
import type { Project } from '@/lib/types'

import type { JSX } from 'react'

export default async function FeaturedProject({
  project,
}: {
  project: Project
}): Promise<JSX.Element> {
  const repo = repoFromGitHubUrl(project.github)
  const changelog = repo ? await getChangelog(repo) : []
  const domain = new URL(project.url).host

  return (
    <Section title='Now building'>
      <article className='grid overflow-hidden rounded-xl border sm:grid-cols-[1fr_220px]'>
        <div className='flex flex-col gap-4 p-6'>
          <div className='flex items-center gap-3'>
            <StatusLabel status={project.status} />
            <span className='text-muted-foreground text-xs'>{domain}</span>
          </div>
          <h2 className='text-xl font-semibold'>{project.name}</h2>
          <p className='leading-7'>{project.description}</p>
          <div className='flex gap-3'>
            <Link
              href={project.url}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground hover:opacity-90'
            >
              Play {project.name} →
            </Link>
            <Link
              href={project.github}
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-md border px-3 py-2 text-xs hover:bg-muted'
            >
              Source
            </Link>
          </div>
          {changelog.length > 0 && (
            <ul
              className='border-t border-dashed pt-4 text-xs'
              aria-label='Recent changes'
            >
              {changelog.map((entry) => (
                <li key={entry.url} className='flex gap-4 leading-6'>
                  <span className='text-muted-foreground shrink-0'>
                    {formatDateSpaced(entry.date)}
                  </span>
                  <a
                    href={entry.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline underline-offset-4'
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='hidden items-center justify-center border-l bg-muted/50 p-6 sm:flex'>
          <SudokuBoard className='w-44 -rotate-3 shadow-lg' />
        </div>
      </article>
    </Section>
  )
}
