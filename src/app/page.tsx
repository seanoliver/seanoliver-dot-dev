import CurrentlyReading from '@/components/currently-reading'
import Goodreads from '@/components/goodreads'
import PortfolioIntro from '@/components/portfolio-intro'
import ProjectCaseStudies from '@/components/project-case-studies'
import ExperienceContent from '@/components/experience-content'
import WritingIndex from '@/components/writing-index'
import { getVisibleEntries } from '@/content'

import type { JSX } from 'react'

export default async function Home(): Promise<JSX.Element> {
  const entries = await getVisibleEntries()

  return (
    <>
      <PortfolioIntro />
      <ProjectCaseStudies />
      <WritingIndex
        entries={entries}
        title='Writing'
        limit={3}
        href='/writing'
      />
      <ExperienceContent limit={3} href='/experience' />
      <CurrentlyReading />
      <Goodreads limit={3} href='/read' />
    </>
  )
}
